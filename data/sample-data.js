/**
 * Y-CAS 示例数据
 * 包含2套完整示例数据（男/女各1），用于开发调试和演示
 */
const SAMPLE_DATA = [
  // 示例1：女童 - 张小萌
  {
    report: {
      id: 'YCAS-2025-001',
      date: '2025-02-11',
      generatedAt: '2025-02-11 14:30:00'
    },
    child: {
      name: '张小萌',
      gender: 'female',
      birthDate: '2016-03-15',
      age: '',
      avatar: null
    },
    measurements: {
      date: '2025-02-11',
      height: 128.5,
      weight: 26.8,
      heightPercentile: '',
      heightLevel: '',
      heightLabel: '',
      bmi: 0,
      bmiStatus: '',
      growthRate: 5.5
    },
    genetics: {
      fatherHeight: 175,
      motherHeight: 162,
      targetHeight: 0,
      targetHeightRange: [0, 0]
    },
    boneAge: {
      hasXRay: true,
      age: '9岁2个月',
      ageDiff: 3,
      status: 'advanced',
      closureEstimate: '14-15岁'
    },
    scores4D: {
      d1_sleep: 85,
      d2_nutrition: 68,
      d3_sport: 72,
      d4_mood: 78
    },
    details4D: {
      d1: {
        sleepTime: '21:30',
        wakeTime: '07:00',
        sleepDuration: 9.5,
        sleepDifficulty: 'none',
        nightWaking: '0',
        earlyWaking: 'none',
        dayEnergy: 'energetic',
        summary: '睡眠质量良好，入睡快，夜间无觉醒'
      },
      d2: {
        pickyEating: 'moderate',
        mealRegularity: 'irregular',
        snackIntake: 'often',
        breakfastHabit: 'occasional',
        milkIntake: 500,
        calciumSupplement: false,
        summary: '挑食偏食较严重，早餐不规律，零食摄入偏多'
      },
      d3: {
        exerciseFrequency: '3-4',
        verticalSportRatio: 40,
        duration: 30,
        intensity: 'moderate',
        mainSports: ['跳绳', '跑步'],
        summary: '运动频率尚可，但纵向运动占比偏低，时长不足'
      },
      d4: {
        anxiety: 'occasional',
        sleepQuality: 'good',
        appetiteChange: 'none',
        socialWillingness: 'high',
        familyAtmosphere: 'harmonious',
        parentExpectation: 'reasonable',
        academicPressure: 'low',
        summary: '情绪整体稳定，家庭氛围和谐，偶有焦虑情绪'
      }
    },
    risks: {
      growthDelay: { level: 'low', description: '年增长速率正常', suggestion: '定期监测身高变化' },
      earlyPuberty: { level: 'low', description: '目前无早发育迹象', suggestion: '关注第二性征发育情况' },
      malnutrition: { level: 'medium', description: '挑食偏食较严重', suggestion: '建议进行营养评估' },
      psychological: { level: 'low', description: '情绪稳定', suggestion: '保持良好家庭沟通' }
    },
    predictions: {
      genetic: 162,
      currentTrajectory: 160,
      optimized4D: 166,
      improvement: 4
    },
    interventions: {
      d1: {
        problem: '睡眠质量良好',
        focus: '保持规律作息，确保21:00前入睡',
        actions: ['保持每天21:00前上床', '睡前1小时停止使用电子设备', '保持卧室安静、暗光环境'],
        duration: '持续保持',
        priority: 'maintain'
      },
      d2: {
        problem: '挑食偏食较严重，早餐不规律',
        focus: '改善饮食结构，保证营养均衡',
        actions: ['每天保证500ml以上牛奶摄入', '增加蛋白质和钙质摄入', '减少零食，按时吃早餐', '每周食谱多样化'],
        duration: '3个月',
        priority: 'urgent'
      },
      d3: {
        problem: '纵向运动占比偏低',
        focus: '增加纵向运动频率和时长',
        actions: ['每天跳绳300-500个', '增加摸高、篮球等纵向运动', '每次运动不少于45分钟'],
        duration: '2个月',
        priority: 'improve'
      },
      d4: {
        problem: '偶发焦虑情绪',
        focus: '心理疏导，减轻压力',
        actions: ['保持家庭沟通畅通', '合理安排学习和休息时间', '鼓励参与户外活动'],
        duration: '1个月',
        priority: 'maintain'
      }
    },
    followUp: {
      nextDate: '2025-03-11',
      frequency: '每月1次',
      items: ['身高体重复测', '4D维度评分复评', '干预方案执行跟进', '饮食日记检查']
    },
    advisor: {
      name: '李医生',
      title: '高级儿童健康管理师',
      phone: '138-0000-0000',
      wechat: '',
      message: '小萌目前的生长发育状况整体良好，身高处于同龄人中等水平。重点需要改善营养摄入，建议家长配合制定科学的膳食计划，同时增加纵向运动。按照4D管理方案坚持执行，预期可获得{{improvement}}cm的额外身高增长空间。'
    },
    institution: {
      name: '益康顺儿童健康管理',
      slogan: '医育结合 · 4D科学 · 5S品质',
      logo: 'assets/logo.png'
    }
  },

  // 示例2：男童 - 王小明
  {
    report: {
      id: 'YCAS-2025-002',
      date: '2025-02-11',
      generatedAt: '2025-02-11 15:00:00'
    },
    child: {
      name: '王小明',
      gender: 'male',
      birthDate: '2015-08-20',
      age: '',
      avatar: null
    },
    measurements: {
      date: '2025-02-11',
      height: 135.0,
      weight: 30.2,
      heightPercentile: '',
      heightLevel: '',
      heightLabel: '',
      bmi: 0,
      bmiStatus: '',
      growthRate: 4.8
    },
    genetics: {
      fatherHeight: 178,
      motherHeight: 165,
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
    scores4D: {
      d1_sleep: 62,
      d2_nutrition: 80,
      d3_sport: 85,
      d4_mood: 55
    },
    details4D: {
      d1: {
        sleepTime: '22:30',
        wakeTime: '06:30',
        sleepDuration: 8,
        sleepDifficulty: 'occasional',
        nightWaking: '1-2',
        earlyWaking: 'none',
        dayEnergy: 'normal',
        summary: '入睡时间偏晚，睡眠时长不足，偶尔夜醒'
      },
      d2: {
        pickyEating: 'mild',
        mealRegularity: 'regular',
        snackIntake: 'sometimes',
        breakfastHabit: 'daily',
        milkIntake: 600,
        calciumSupplement: true,
        summary: '饮食较规律，营养摄入基本均衡，轻微挑食'
      },
      d3: {
        exerciseFrequency: '>=5',
        verticalSportRatio: 60,
        duration: 60,
        intensity: 'vigorous',
        mainSports: ['篮球', '跳绳', '游泳'],
        summary: '运动充足，纵向运动占比高，强度适中'
      },
      d4: {
        anxiety: 'frequent',
        sleepQuality: 'fair',
        appetiteChange: 'decreased',
        socialWillingness: 'medium',
        familyAtmosphere: 'tense',
        parentExpectation: 'high',
        academicPressure: 'high',
        summary: '学业压力较大，家长期望偏高，焦虑情绪频繁，影响睡眠和食欲'
      }
    },
    risks: {
      growthDelay: { level: 'medium', description: '年增长速率略低于均值', suggestion: '建议骨龄检查' },
      earlyPuberty: { level: 'low', description: '无异常', suggestion: '定期随访' },
      malnutrition: { level: 'low', description: '营养摄入基本均衡', suggestion: '保持现有饮食习惯' },
      psychological: { level: 'high', description: '焦虑情绪频繁，学业压力大', suggestion: '建议心理咨询' }
    },
    predictions: {
      genetic: 178,
      currentTrajectory: 174,
      optimized4D: 180,
      improvement: 6
    },
    interventions: {
      d1: {
        problem: '入睡晚，睡眠时长不足',
        focus: '提前入睡时间，改善睡眠质量',
        actions: ['逐步将入睡时间提前至21:30', '睡前30分钟进行放松活动', '限制睡前电子设备使用', '保持规律的作息时间'],
        duration: '2个月',
        priority: 'urgent'
      },
      d2: {
        problem: '轻微挑食',
        focus: '保持良好饮食习惯',
        actions: ['继续保证每日三餐规律', '适当增加优质蛋白摄入', '每天保证600ml牛奶'],
        duration: '持续保持',
        priority: 'maintain'
      },
      d3: {
        problem: '运动状况良好',
        focus: '保持运动习惯',
        actions: ['继续保持每周5次以上运动', '注意运动后充分休息和拉伸', '保持篮球、跳绳等纵向运动'],
        duration: '持续保持',
        priority: 'maintain'
      },
      d4: {
        problem: '焦虑情绪频繁，学业压力大',
        focus: '减压疏导，改善家庭氛围',
        actions: ['与学校沟通，合理减负', '家长降低不合理期望', '每周安排放松休闲时间', '必要时寻求专业心理咨询'],
        duration: '3个月',
        priority: 'urgent'
      }
    },
    followUp: {
      nextDate: '2025-03-11',
      frequency: '每2周1次',
      items: ['身高体重复测', '睡眠日记检查', '情绪状态评估', '骨龄检查安排']
    },
    advisor: {
      name: '王医生',
      title: '儿童生长发育专家',
      phone: '139-0000-0000',
      wechat: '',
      message: '小明的运动和营养状况都不错，但睡眠和情绪问题需要重点关注。学业压力过大和家长期望过高是主要影响因素，建议家长调整教育方式，给孩子更多放松和自由的时间。改善睡眠和情绪后，预期身高可获得6cm的提升空间。'
    },
    institution: {
      name: '益康顺儿童健康管理',
      slogan: '医育结合 · 4D科学 · 5S品质',
      logo: 'assets/logo.png'
    }
  }
];

// 加载示例数据到USER_CONFIG的便捷函数
function loadSampleData(index) {
  if (index < 0 || index >= SAMPLE_DATA.length) {
    console.error('示例数据索引超出范围，可选: 0-' + (SAMPLE_DATA.length - 1));
    return false;
  }
  Object.assign(USER_CONFIG, JSON.parse(JSON.stringify(SAMPLE_DATA[index])));
  return true;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SAMPLE_DATA, loadSampleData };
}
