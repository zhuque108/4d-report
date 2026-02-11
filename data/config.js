/**
 * Y-CAS 用户数据配置文件
 * 健康师通过修改此文件中的值来生成不同用户的报告
 */
const USER_CONFIG = {
  // 报告信息
  report: {
    id: 'YCAS-2025-001',
    date: '2025-02-11',
    generatedAt: '2025-02-11 14:30:00'
  },

  // 儿童基本信息
  child: {
    name: '张小萌',
    gender: 'female', // male / female
    birthDate: '2016-03-15',
    age: '', // 自动计算，也可手动填写如 '8岁11个月'
    avatar: null // 可选，头像图片路径
  },

  // 测量数据
  measurements: {
    date: '2025-02-11',
    height: 128.5, // cm
    weight: 26.8,  // kg
    heightPercentile: '', // 自动计算，也可手动填写: P3/P10/P25/P50/P75/P90/P97
    heightLevel: '',      // 自动计算: abnormal_low/low/normal/high/abnormal_high
    heightLabel: '',      // 自动计算: 偏矮（异常）/正常偏矮/正常/中等/偏高/偏高（异常）
    bmi: 0,              // 自动计算
    bmiStatus: '',       // 自动计算: underweight/normal/overweight/obese
    growthRate: 5.5      // cm/year，年增长速率
  },

  // 遗传背景
  genetics: {
    fatherHeight: 175, // cm
    motherHeight: 162, // cm
    targetHeight: 0,   // 自动计算，遗传靶身高
    targetHeightRange: [0, 0] // 自动计算，靶身高范围 ±5cm
  },

  // 骨龄数据（可选）
  boneAge: {
    hasXRay: false,
    age: '',              // 如 '9岁2个月'
    ageDiff: 0,           // 月，正数表示超前，负数表示落后
    status: '',           // normal / advanced / delayed
    closureEstimate: ''   // 如 '14-15岁'
  },

  // 4D维度评分（0-100）
  scores4D: {
    d1_sleep: 85,
    d2_nutrition: 68,
    d3_sport: 72,
    d4_mood: 78
  },

  // 4D详细评估数据
  details4D: {
    d1: {
      sleepTime: '21:30',           // 入睡时间
      wakeTime: '07:00',            // 起床时间
      sleepDuration: 9.5,           // 睡眠时长（小时）
      sleepDifficulty: 'none',      // none / occasional / often
      nightWaking: '0',             // 0 / 1-2 / 3+
      earlyWaking: 'none',          // none / occasional / often
      dayEnergy: 'energetic',       // energetic / normal / tired
      summary: '睡眠质量良好，入睡快，夜间无觉醒'
    },
    d2: {
      pickyEating: 'moderate',      // none / mild / moderate / severe
      mealRegularity: 'irregular',  // regular / irregular
      snackIntake: 'often',         // rarely / sometimes / often
      breakfastHabit: 'occasional', // daily / occasional / rarely
      milkIntake: 500,              // ml/day
      calciumSupplement: false,
      summary: '挑食偏食较严重，早餐不规律，零食摄入偏多'
    },
    d3: {
      exerciseFrequency: '3-4',     // <=2 / 3-4 / >=5 (次/周)
      verticalSportRatio: 40,       // % 纵向运动占比
      duration: 30,                 // minutes 每次运动时长
      intensity: 'moderate',        // light / moderate / vigorous
      mainSports: ['跳绳', '跑步'],
      summary: '运动频率尚可，但纵向运动占比偏低，时长不足'
    },
    d4: {
      anxiety: 'occasional',          // none / occasional / frequent
      sleepQuality: 'good',           // good / fair / poor
      appetiteChange: 'none',         // none / decreased / increased
      socialWillingness: 'high',      // high / medium / low
      familyAtmosphere: 'harmonious', // harmonious / tense / conflict
      parentExpectation: 'reasonable', // reasonable / high / excessive
      academicPressure: 'low',        // low / medium / high
      summary: '情绪整体稳定，家庭氛围和谐，偶有焦虑情绪'
    }
  },

  // 风险评估
  risks: {
    growthDelay: {
      level: 'low',        // low / medium / high
      description: '年增长速率正常',
      suggestion: '定期监测身高变化'
    },
    earlyPuberty: {
      level: 'low',
      description: '目前无早发育迹象',
      suggestion: '关注第二性征发育情况'
    },
    malnutrition: {
      level: 'medium',
      description: '挑食偏食较严重，营养摄入不均衡',
      suggestion: '建议进行营养评估，制定膳食计划'
    },
    psychological: {
      level: 'low',
      description: '情绪稳定，社交意愿良好',
      suggestion: '保持良好的家庭沟通氛围'
    }
  },

  // 身高预测
  predictions: {
    genetic: 162,          // 遗传靶身高（自动计算）
    currentTrajectory: 160, // 按当前趋势预测
    optimized4D: 166,       // 4D优化后预测
    improvement: 4          // 潜在提升空间(cm)
  },

  // 干预建议
  interventions: {
    d1: {
      problem: '睡眠质量良好',
      focus: '保持规律作息，确保21:00前入睡',
      actions: [
        '保持每天21:00前上床',
        '睡前1小时停止使用电子设备',
        '保持卧室安静、暗光环境'
      ],
      duration: '持续保持',
      priority: 'maintain' // improve / maintain / urgent
    },
    d2: {
      problem: '挑食偏食较严重，早餐不规律',
      focus: '改善饮食结构，保证营养均衡',
      actions: [
        '每天保证500ml以上牛奶摄入',
        '增加蛋白质和钙质摄入',
        '减少零食，按时吃早餐',
        '每周食谱多样化，减少重复'
      ],
      duration: '3个月',
      priority: 'urgent'
    },
    d3: {
      problem: '纵向运动占比偏低，运动时长不足',
      focus: '增加纵向运动频率和时长',
      actions: [
        '每天跳绳300-500个',
        '增加摸高、篮球等纵向运动',
        '每次运动时间不少于45分钟',
        '运动后注意拉伸放松'
      ],
      duration: '2个月',
      priority: 'improve'
    },
    d4: {
      problem: '偶发焦虑情绪',
      focus: '心理疏导，减轻压力',
      actions: [
        '保持家庭沟通畅通',
        '合理安排学习和休息时间',
        '鼓励参与社交和户外活动'
      ],
      duration: '1个月',
      priority: 'maintain'
    }
  },

  // 随访计划
  followUp: {
    nextDate: '2025-03-11',
    frequency: '每月1次',
    items: [
      '身高体重复测',
      '4D维度评分复评',
      '干预方案执行情况跟进',
      '饮食日记检查'
    ]
  },

  // 健康师信息
  advisor: {
    name: '李医生',
    title: '高级儿童健康管理师',
    phone: '138-0000-0000',
    wechat: '',
    message: '小萌目前的生长发育状况整体良好，身高处于同龄人中等水平。重点需要改善营养摄入，建议家长配合制定科学的膳食计划，同时增加纵向运动。按照4D管理方案坚持执行，预期可获得4cm的额外身高增长空间。'
  },

  // 机构信息
  institution: {
    name: '益康顺儿童健康管理',
    slogan: '医育结合 · 4D科学 · 5S品质',
    logo: 'assets/logo.png',
    address: '',
    phone: '',
    website: ''
  }
};

// 兼容Node.js环境（用于批量脚本）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = USER_CONFIG;
}
