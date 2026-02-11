/**
 * Y-CAS 评分计算模块
 */
const YCASCalculator = {
  /**
   * 计算BMI
   */
  calculateBMI(weight, height) {
    if (!weight || !height || height <= 0) return 0;
    var heightM = height / 100;
    return parseFloat((weight / (heightM * heightM)).toFixed(1));
  },

  /**
   * 获取BMI状态
   */
  getBMIStatus(bmi, age, gender) {
    if (!bmi || !age || !gender) return { status: 'unknown', label: '未知' };

    var categories = PERCENTILE_DATA.bmiCategories[gender];
    if (!categories) return { status: 'unknown', label: '未知' };

    // 找最近的年龄段
    var ageKey = Math.round(age);
    if (ageKey < 6) ageKey = 6;
    if (ageKey > 18) ageKey = 18;

    var thresholds = categories[ageKey];
    if (!thresholds) return { status: 'unknown', label: '未知' };

    // [underweight, normal_low, normal_high, overweight, obese]
    if (bmi < thresholds[0]) return { status: 'underweight', label: '偏瘦', color: '#f59e0b' };
    if (bmi < thresholds[2]) return { status: 'normal', label: '正常', color: '#10b981' };
    if (bmi < thresholds[3]) return { status: 'overweight', label: '超重', color: '#f59e0b' };
    return { status: 'obese', label: '肥胖', color: '#ef4444' };
  },

  /**
   * 计算遗传靶身高
   * 男: (父+母+13) / 2    女: (父+母-13) / 2
   */
  calculateGeneticHeight(fatherHeight, motherHeight, gender) {
    if (!fatherHeight || !motherHeight) return { target: 0, range: [0, 0] };

    var target;
    if (gender === 'male') {
      target = (fatherHeight + motherHeight + 13) / 2;
    } else {
      target = (fatherHeight + motherHeight - 13) / 2;
    }

    return {
      target: parseFloat(target.toFixed(1)),
      range: [parseFloat((target - 5).toFixed(1)), parseFloat((target + 5).toFixed(1))]
    };
  },

  /**
   * 查询身高百分位
   */
  getHeightPercentile(height, age, gender) {
    if (!height || age === undefined || !gender) return null;

    var genderData = PERCENTILE_DATA[gender];
    if (!genderData) return null;

    // 取整岁查表
    var ageKey = Math.round(age);
    if (ageKey < 0) ageKey = 0;
    if (ageKey > 18) ageKey = 18;

    var data = genderData[ageKey];
    if (!data) return null;

    if (height < data.P3) return { percentile: '<P3', level: 'abnormal_low', label: '偏矮（异常）', color: '#ef4444' };
    if (height < data.P10) return { percentile: 'P3-P10', level: 'low', label: '正常偏矮', color: '#f59e0b' };
    if (height < data.P25) return { percentile: 'P10-P25', level: 'normal', label: '正常', color: '#10b981' };
    if (height < data.P50) return { percentile: 'P25-P50', level: 'normal', label: '正常', color: '#10b981' };
    if (height < data.P75) return { percentile: 'P50-P75', level: 'normal', label: '中等', color: '#10b981' };
    if (height < data.P90) return { percentile: 'P75-P90', level: 'normal', label: '正常偏高', color: '#10b981' };
    if (height < data.P97) return { percentile: 'P90-P97', level: 'high', label: '偏高', color: '#f59e0b' };
    return { percentile: '>P97', level: 'abnormal_high', label: '偏高（异常）', color: '#ef4444' };
  },

  /**
   * 获取身高在同龄人中的大致百分比数值（用于进度条显示）
   */
  getHeightPercentileValue(height, age, gender) {
    var genderData = PERCENTILE_DATA[gender];
    if (!genderData) return 50;

    var ageKey = Math.round(age);
    if (ageKey < 0) ageKey = 0;
    if (ageKey > 18) ageKey = 18;

    var data = genderData[ageKey];
    if (!data) return 50;

    if (height <= data.P3) return 3;
    if (height <= data.P10) return 3 + (height - data.P3) / (data.P10 - data.P3) * 7;
    if (height <= data.P25) return 10 + (height - data.P10) / (data.P25 - data.P10) * 15;
    if (height <= data.P50) return 25 + (height - data.P25) / (data.P50 - data.P25) * 25;
    if (height <= data.P75) return 50 + (height - data.P50) / (data.P75 - data.P50) * 25;
    if (height <= data.P90) return 75 + (height - data.P75) / (data.P90 - data.P75) * 15;
    if (height <= data.P97) return 90 + (height - data.P90) / (data.P97 - data.P90) * 7;
    return 97;
  },

  /**
   * 计算4D综合得分
   */
  calculateTotalScore(scores4D) {
    if (!scores4D) return 0;
    var d1 = scores4D.d1_sleep || 0;
    var d2 = scores4D.d2_nutrition || 0;
    var d3 = scores4D.d3_sport || 0;
    var d4 = scores4D.d4_mood || 0;
    return parseFloat(((d1 + d2 + d3 + d4) / 4).toFixed(1));
  },

  /**
   * 获取评级
   */
  getRating(score) {
    if (score >= 90) return { level: 'excellent', label: '优秀', color: '#10b981', bgColor: '#ecfdf5' };
    if (score >= 80) return { level: 'good', label: '良好', color: '#0c9af0', bgColor: '#eff6ff' };
    if (score >= 60) return { level: 'average', label: '一般', color: '#f59e0b', bgColor: '#fffbeb' };
    return { level: 'poor', label: '较差', color: '#ef4444', bgColor: '#fef2f2' };
  },

  /**
   * 获取单维度评级
   */
  getDimensionRating(score) {
    if (score >= 90) return { label: '优秀', color: '#10b981', icon: 'fa-circle-check' };
    if (score >= 80) return { label: '良好', color: '#0c9af0', icon: 'fa-circle-check' };
    if (score >= 60) return { label: '一般', color: '#f59e0b', icon: 'fa-circle-exclamation' };
    return { label: '较差', color: '#ef4444', icon: 'fa-circle-xmark' };
  },

  /**
   * 计算4D优化预测身高
   */
  calculateOptimizedHeight(currentPrediction, scores4D) {
    if (!currentPrediction || !scores4D) return { height: 0, improvement: 0 };

    var avgScore = this.calculateTotalScore(scores4D);
    // 当前平均分越低，改善空间越大；最大提升6cm
    var potential = Math.max(0, (85 - avgScore) / 85 * 6);

    return {
      height: Math.round(currentPrediction + potential),
      improvement: Math.round(potential * 10) / 10
    };
  },

  /**
   * 计算当前趋势预测身高（简化模型）
   */
  calculateTrajectoryHeight(currentHeight, age, gender, growthRate) {
    if (!currentHeight || !age || !gender) return 0;

    // 简化：根据当前身高百分位和遗传靶身高估算
    var percentileValue = this.getHeightPercentileValue(currentHeight, age, gender);

    // 参考成年平均身高（男171.8，女159.7）加上百分位偏移
    var avgAdultHeight = gender === 'male' ? 171.8 : 159.7;
    var stdDev = gender === 'male' ? 6.5 : 5.8;

    // 根据当前百分位估算成年身高
    var zScore = this.percentileToZScore(percentileValue / 100);
    return Math.round(avgAdultHeight + zScore * stdDev);
  },

  /**
   * 百分位转Z分数（近似）
   */
  percentileToZScore(p) {
    if (p <= 0) return -3;
    if (p >= 1) return 3;

    // 使用简单近似公式
    var t = Math.sqrt(-2 * Math.log(p < 0.5 ? p : 1 - p));
    var c0 = 2.515517, c1 = 0.802853, c2 = 0.010328;
    var d1 = 1.432788, d2 = 0.189269, d3 = 0.001308;
    var z = t - (c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t);
    return p < 0.5 ? -z : z;
  },

  /**
   * 执行所有自动计算并写回数据
   */
  computeAll(data) {
    if (!data) return;

    var measurements = data.measurements;
    var genetics = data.genetics;
    var child = data.child;
    var scores4D = data.scores4D;

    // 计算年龄
    if (child && child.birthDate) {
      var ageResult = YCASUtils.calculateAge(child.birthDate, measurements ? measurements.date : null);
      child.age = ageResult.text;
      data._ageYears = ageResult.years;
      data._ageMonths = ageResult.totalMonths;
    }

    // 计算BMI
    if (measurements && measurements.height && measurements.weight) {
      measurements.bmi = this.calculateBMI(measurements.weight, measurements.height);
      if (data._ageYears !== undefined && child) {
        var bmiResult = this.getBMIStatus(measurements.bmi, data._ageYears, child.gender);
        measurements.bmiStatus = bmiResult.status;
        measurements.bmiLabel = bmiResult.label;
      }
    }

    // 计算遗传靶身高
    if (genetics && genetics.fatherHeight && genetics.motherHeight && child) {
      var geneticResult = this.calculateGeneticHeight(genetics.fatherHeight, genetics.motherHeight, child.gender);
      genetics.targetHeight = geneticResult.target;
      genetics.targetHeightRange = geneticResult.range;
    }

    // 计算身高百分位
    if (measurements && measurements.height && data._ageYears !== undefined && child) {
      var percentileResult = this.getHeightPercentile(measurements.height, data._ageYears, child.gender);
      if (percentileResult) {
        measurements.heightPercentile = percentileResult.percentile;
        measurements.heightLevel = percentileResult.level;
        measurements.heightLabel = percentileResult.label;
      }
    }

    // 计算综合得分和评级
    if (scores4D) {
      data.totalScore = this.calculateTotalScore(scores4D);
      data.rating = this.getRating(data.totalScore);
    }

    // 计算身高预测
    if (measurements && data._ageYears !== undefined && child && genetics && scores4D) {
      if (!data.predictions) data.predictions = {};
      data.predictions.genetic = genetics.targetHeight;
      data.predictions.currentTrajectory = this.calculateTrajectoryHeight(
        measurements.height, data._ageYears, child.gender, measurements.growthRate
      );
      var optimized = this.calculateOptimizedHeight(data.predictions.currentTrajectory, scores4D);
      data.predictions.optimized4D = optimized.height;
      data.predictions.improvement = optimized.improvement;
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = YCASCalculator;
}
