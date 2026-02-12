/**
 * Y-CAS 单用户表单处理模块
 */
const FormHandler = {
  init() {
    this.bindEvents();
    this.loadDefaultValues();
  },

  bindEvents() {
    var self = this;

    // 实时验证
    document.querySelectorAll('#report-form input[data-validate]').forEach(function(input) {
      input.addEventListener('blur', function() { self.validateFieldUI(input); });
    });

    // 表单提交
    var form = document.getElementById('report-form');
    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        self.handleSubmit();
      });
    }

    // 预览按钮
    var previewBtn = document.getElementById('btn-preview');
    if (previewBtn) {
      previewBtn.addEventListener('click', function() {
        self.handleSubmit();
      });
    }
  },

  loadDefaultValues() {
    // 设置默认测量日期为今天
    var measureDateInput = document.querySelector('input[name="measureDate"]');
    if (measureDateInput && !measureDateInput.value) {
      measureDateInput.value = YCASUtils.formatDate(new Date());
    }

    // 设置默认值
    this.setDefaultRadioValues();
  },

  setDefaultRadioValues() {
    // D1 默认值
    this.setDefaultRadio('d1_sleepDifficulty', 'none');
    this.setDefaultRadio('d1_nightWaking', '0');
    this.setDefaultRadio('d1_earlyWaking', 'none');
    this.setDefaultRadio('d1_dayEnergy', 'energetic');

    // D2 默认值
    this.setDefaultRadio('d2_pickyEating', 'moderate');
    this.setDefaultRadio('d2_mealRegularity', 'irregular');
    this.setDefaultRadio('d2_snackIntake', 'often');
    this.setDefaultRadio('d2_breakfastHabit', 'occasional');
    this.setDefaultRadio('d2_calciumSupplement', 'false');

    // D3 默认值
    this.setDefaultRadio('d3_exerciseFrequency', '3-4');
    this.setDefaultRadio('d3_verticalSportRatio', '<40');
    this.setDefaultRadio('d3_duration', '<30');
    this.setDefaultRadio('d3_intensity', 'moderate');

    // D4 默认值
    this.setDefaultRadio('d4_anxiety', 'occasional');
    this.setDefaultRadio('d4_sleepQuality', 'good');
    this.setDefaultRadio('d4_appetiteChange', 'none');
    this.setDefaultRadio('d4_socialWillingness', 'high');
    this.setDefaultRadio('d4_familyAtmosphere', 'harmonious');
    this.setDefaultRadio('d4_parentExpectation', 'reasonable');
    this.setDefaultRadio('d4_academicPressure', 'low');
  },

  setDefaultRadio(name, value) {
    var radio = document.querySelector('[name="' + name + '"][value="' + value + '"]');
    if (radio) radio.checked = true;
  },

  validateFieldUI(field) {
    var result = DataValidator.validateField(field);
    DataValidator.showFieldError(field, result.error);
    return result.valid;
  },

  validateAll() {
    var allValid = true;
    var self = this;
    document.querySelectorAll('#report-form input[data-validate]').forEach(function(input) {
      if (!self.validateFieldUI(input)) {
        allValid = false;
      }
    });
    return allValid;
  },

  collectData() {
    var form = document.getElementById('report-form');
    if (!form) return null;
    var fd = new FormData(form);

    // 收集4D详细数据
    var details4D = {
      d1: {
        sleepTime: fd.get('d1_sleepTime') || '21:30',
        wakeTime: fd.get('d1_wakeTime') || '07:00',
        sleepDuration: YCASUtils.safeParseFloat(fd.get('d1_sleepDuration')) || 9.5,
        sleepDifficulty: this.getRadioValue('d1_sleepDifficulty') || 'none',
        nightWaking: this.getRadioValue('d1_nightWaking') || '0',
        earlyWaking: this.getRadioValue('d1_earlyWaking') || 'none',
        dayEnergy: this.getRadioValue('d1_dayEnergy') || 'energetic',
        summary: ''
      },
      d2: {
        pickyEating: this.getRadioValue('d2_pickyEating') || 'moderate',
        mealRegularity: this.getRadioValue('d2_mealRegularity') || 'irregular',
        snackIntake: this.getRadioValue('d2_snackIntake') || 'often',
        breakfastHabit: this.getRadioValue('d2_breakfastHabit') || 'occasional',
        milkIntake: YCASUtils.safeParseInt(fd.get('d2_milkIntake')) || 500,
        calciumSupplement: fd.get('d2_calciumSupplement') === 'true',
        summary: ''
      },
      d3: {
        exerciseFrequency: this.getRadioValue('d3_exerciseFrequency') || '3-4',
        verticalSportRatio: this.getRadioValue('d3_verticalSportRatio') || '<40',
        duration: this.getRadioValue('d3_duration') || '<30',
        intensity: this.getRadioValue('d3_intensity') || 'moderate',
        mainSports: (fd.get('d3_mainSports') || '跳绳, 跑步').split(',').map(item => item.trim()),
        summary: ''
      },
      d4: {
        anxiety: this.getRadioValue('d4_anxiety') || 'occasional',
        sleepQuality: this.getRadioValue('d4_sleepQuality') || 'good',
        appetiteChange: this.getRadioValue('d4_appetiteChange') || 'none',
        socialWillingness: this.getRadioValue('d4_socialWillingness') || 'high',
        familyAtmosphere: this.getRadioValue('d4_familyAtmosphere') || 'harmonious',
        parentExpectation: this.getRadioValue('d4_parentExpectation') || 'reasonable',
        academicPressure: this.getRadioValue('d4_academicPressure') || 'low',
        summary: ''
      }
    };

    // 计算4D评分
    var scores4D = this.calculateScores4D(details4D);

    // 生成总结
    this.generateSummaries(details4D, scores4D);

    return {
      report: {
        id: YCASUtils.generateReportId(1),
        date: YCASUtils.formatDate(new Date()),
        generatedAt: YCASUtils.getNow()
      },
      child: {
        name: fd.get('childName') || '',
        gender: fd.get('gender') || '',
        birthDate: fd.get('birthDate') || '',
        age: '',
        avatar: null
      },
      measurements: {
        date: fd.get('measureDate') || YCASUtils.formatDate(new Date()),
        height: YCASUtils.safeParseFloat(fd.get('height')),
        weight: YCASUtils.safeParseFloat(fd.get('weight')),
        heightPercentile: '',
        heightLevel: '',
        heightLabel: '',
        bmi: 0,
        bmiStatus: '',
        growthRate: YCASUtils.safeParseFloat(fd.get('growthRate'))
      },
      genetics: {
        fatherHeight: YCASUtils.safeParseFloat(fd.get('fatherHeight')),
        motherHeight: YCASUtils.safeParseFloat(fd.get('motherHeight')),
        targetHeight: 0,
        targetHeightRange: [0, 0]
      },
      boneAge: {
        hasXRay: false,
        age: '',
        ageDiff: 0,
        status: '',
        closureEstimate: ''
      },
      scores4D: scores4D,
      details4D: details4D,
      risks: USER_CONFIG.risks || {},
      predictions: {},
      interventions: USER_CONFIG.interventions || {},
      followUp: USER_CONFIG.followUp || {},
      advisor: USER_CONFIG.advisor || {},
      institution: USER_CONFIG.institution || {}
    };
  },

  getRadioValue(name) {
    var radio = document.querySelector('[name="' + name + '"]:checked');
    return radio ? radio.value : null;
  },

  calculateScores4D(details4D) {
    // 评分配置
    const scoreConfig = {
      d1: {
        sleepDifficulty: {
          'none': 25,
          'occasional': 15,
          'often': 5
        },
        nightWaking: {
          '0': 25,
          '1-2': 15,
          '3+': 5
        },
        earlyWaking: {
          'none': 25,
          'occasional': 15,
          'often': 5
        },
        dayEnergy: {
          'energetic': 25,
          'normal': 15,
          'tired': 5
        }
      },
      d2: {
        pickyEating: {
          'none': 25,
          'mild': 20,
          'moderate': 10,
          'severe': 5
        },
        mealRegularity: {
          'regular': 25,
          'irregular': 10
        },
        snackIntake: {
          'rarely': 25,
          'sometimes': 20,
          'often': 10
        },
        breakfastHabit: {
          'daily': 25,
          'occasional': 15,
          'rarely': 5
        }
      },
      d3: {
        exerciseFrequency: {
          '<=2': 10,
          '3-4': 20,
          '>=5': 25
        },
        verticalSportRatio: {
          '<40': 10,
          '40-60': 15,
          '>=60': 25
        },
        duration: {
          '<30': 10,
          '30-45': 15,
          '>=45': 25
        },
        intensity: {
          'light': 15,
          'moderate': 25,
          'vigorous': 20
        }
      },
      d4: {
        anxiety: {
          'none': 25,
          'occasional': 20,
          'frequent': 10
        },
        sleepQuality: {
          'good': 25,
          'fair': 15,
          'poor': 10
        },
        appetiteChange: {
          'none': 25,
          'decreased': 15,
          'increased': 15
        },
        socialWillingness: {
          'high': 25,
          'medium': 15,
          'low': 10
        },
        familyAtmosphere: {
          'harmonious': 25,
          'tense': 10,
          'conflict': 5
        },
        parentExpectation: {
          'reasonable': 25,
          'high': 15,
          'excessive': 5
        },
        academicPressure: {
          'low': 25,
          'medium': 15,
          'high': 10
        }
      }
    };

    // 计算D1评分
    const d1Score = Math.round((
      scoreConfig.d1.sleepDifficulty[details4D.d1.sleepDifficulty] +
      scoreConfig.d1.nightWaking[details4D.d1.nightWaking] +
      scoreConfig.d1.earlyWaking[details4D.d1.earlyWaking] +
      scoreConfig.d1.dayEnergy[details4D.d1.dayEnergy]
    ) / 4);

    // 计算D2评分
    const d2Score = Math.round((
      scoreConfig.d2.pickyEating[details4D.d2.pickyEating] +
      scoreConfig.d2.mealRegularity[details4D.d2.mealRegularity] +
      scoreConfig.d2.snackIntake[details4D.d2.snackIntake] +
      scoreConfig.d2.breakfastHabit[details4D.d2.breakfastHabit]
    ) / 4);

    // 计算D3评分
    const d3Score = Math.round((
      scoreConfig.d3.exerciseFrequency[details4D.d3.exerciseFrequency] +
      scoreConfig.d3.verticalSportRatio[details4D.d3.verticalSportRatio] +
      scoreConfig.d3.duration[details4D.d3.duration] +
      scoreConfig.d3.intensity[details4D.d3.intensity]
    ) / 4);

    // 计算D4评分
    const d4Score = Math.round((
      scoreConfig.d4.anxiety[details4D.d4.anxiety] +
      scoreConfig.d4.sleepQuality[details4D.d4.sleepQuality] +
      scoreConfig.d4.appetiteChange[details4D.d4.appetiteChange] +
      scoreConfig.d4.socialWillingness[details4D.d4.socialWillingness] +
      scoreConfig.d4.familyAtmosphere[details4D.d4.familyAtmosphere] +
      scoreConfig.d4.parentExpectation[details4D.d4.parentExpectation] +
      scoreConfig.d4.academicPressure[details4D.d4.academicPressure]
    ) / 7);

    return {
      d1_sleep: d1Score,
      d2_nutrition: d2Score,
      d3_sport: d3Score,
      d4_mood: d4Score
    };
  },

  generateSummaries(details4D, scores4D) {
    // D1 总结
    if (scores4D.d1_sleep >= 20) {
      details4D.d1.summary = '睡眠质量良好，入睡快，夜间无觉醒';
    } else if (scores4D.d1_sleep >= 15) {
      details4D.d1.summary = '睡眠质量一般，存在入睡困难或夜间觉醒情况';
    } else {
      details4D.d1.summary = '睡眠质量较差，需要改善睡眠环境和作息习惯';
    }

    // D2 总结
    if (scores4D.d2_nutrition >= 20) {
      details4D.d2.summary = '饮食规律，营养均衡，无挑食偏食现象';
    } else if (scores4D.d2_nutrition >= 15) {
      details4D.d2.summary = '挑食偏食较严重，早餐不规律，零食摄入偏多';
    } else {
      details4D.d2.summary = '饮食结构不合理，营养摄入严重不足，需要专业指导';
    }

    // D3 总结
    if (scores4D.d3_sport >= 20) {
      details4D.d3.summary = '运动频率充足，纵向运动占比高，时长和强度适宜';
    } else if (scores4D.d3_sport >= 15) {
      details4D.d3.summary = '运动频率尚可，但纵向运动占比偏低，时长不足';
    } else {
      details4D.d3.summary = '运动量严重不足，需要增加运动频率和纵向运动比例';
    }

    // D4 总结
    if (scores4D.d4_mood >= 20) {
      details4D.d4.summary = '情绪稳定，家庭氛围和谐，社交意愿高';
    } else if (scores4D.d4_mood >= 15) {
      details4D.d4.summary = '情绪整体稳定，家庭氛围和谐，偶有焦虑情绪';
    } else {
      details4D.d4.summary = '情绪波动较大，家庭氛围紧张，需要心理疏导';
    }
  },

  handleSubmit() {
    if (!this.validateAll()) {
      alert('请检查表单中的错误项');
      return;
    }

    var data = this.collectData();
    if (!data) return;

    // 更新全局配置
    Object.assign(USER_CONFIG, data);

    // 触发报告渲染
    var success = ReportRenderer.init(USER_CONFIG);

    if (success) {
      // 切换到预览
      TabSwitcher.switchTo('preview');
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormHandler;
}
