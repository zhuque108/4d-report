/**
 * Y-CAS 数据验证模块
 */
const DataValidator = {
  /**
   * 验证必填字段
   */
  validateRequired(data) {
    var required = [
      { path: 'child.name', label: '儿童姓名' },
      { path: 'child.gender', label: '性别' },
      { path: 'child.birthDate', label: '出生日期' },
      { path: 'measurements.height', label: '当前身高' },
      { path: 'measurements.weight', label: '当前体重' },
      { path: 'genetics.fatherHeight', label: '父亲身高' },
      { path: 'genetics.motherHeight', label: '母亲身高' },
      { path: 'scores4D.d1_sleep', label: 'D1睡眠评分' },
      { path: 'scores4D.d2_nutrition', label: 'D2营养评分' },
      { path: 'scores4D.d3_sport', label: 'D3运动评分' },
      { path: 'scores4D.d4_mood', label: 'D4情绪评分' }
    ];

    var missing = [];
    for (var i = 0; i < required.length; i++) {
      var val = YCASUtils.getValueByPath(data, required[i].path);
      if (val === undefined || val === null || val === '') {
        missing.push(required[i]);
      }
    }

    return {
      valid: missing.length === 0,
      missing: missing,
      errors: missing.map(function(m) { return m.label + ' 为必填项'; })
    };
  },

  /**
   * 验证数值范围
   */
  validateRanges(data) {
    var ranges = [
      { path: 'measurements.height', min: 40, max: 250, label: '身高' },
      { path: 'measurements.weight', min: 1, max: 150, label: '体重' },
      { path: 'genetics.fatherHeight', min: 140, max: 220, label: '父亲身高' },
      { path: 'genetics.motherHeight', min: 130, max: 200, label: '母亲身高' },
      { path: 'scores4D.d1_sleep', min: 0, max: 100, label: 'D1睡眠评分' },
      { path: 'scores4D.d2_nutrition', min: 0, max: 100, label: 'D2营养评分' },
      { path: 'scores4D.d3_sport', min: 0, max: 100, label: 'D3运动评分' },
      { path: 'scores4D.d4_mood', min: 0, max: 100, label: 'D4情绪评分' }
    ];

    var errors = [];
    for (var i = 0; i < ranges.length; i++) {
      var r = ranges[i];
      var value = YCASUtils.getValueByPath(data, r.path);
      if (value !== undefined && value !== null && value !== '') {
        var num = parseFloat(value);
        if (isNaN(num)) {
          errors.push(r.label + ' 必须为数值');
        } else if (num < r.min || num > r.max) {
          errors.push(r.label + ' 应在 ' + r.min + '-' + r.max + ' 之间，当前值: ' + num);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * 验证日期格式
   */
  validateDates(data) {
    var errors = [];

    var birthDate = YCASUtils.getValueByPath(data, 'child.birthDate');
    if (birthDate) {
      var bd = new Date(birthDate);
      if (isNaN(bd.getTime())) {
        errors.push('出生日期格式不正确');
      } else if (bd > new Date()) {
        errors.push('出生日期不能晚于今天');
      }
    }

    var measureDate = YCASUtils.getValueByPath(data, 'measurements.date');
    if (measureDate) {
      var md = new Date(measureDate);
      if (isNaN(md.getTime())) {
        errors.push('测量日期格式不正确');
      }
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  },

  /**
   * 验证性别
   */
  validateGender(data) {
    var gender = YCASUtils.getValueByPath(data, 'child.gender');
    if (gender && gender !== 'male' && gender !== 'female') {
      return {
        valid: false,
        errors: ['性别必须为 male 或 female']
      };
    }
    return { valid: true, errors: [] };
  },

  /**
   * 完整验证
   */
  validateAll(data) {
    var results = [
      this.validateRequired(data),
      this.validateRanges(data),
      this.validateDates(data),
      this.validateGender(data)
    ];

    var allErrors = [];
    var allValid = true;

    for (var i = 0; i < results.length; i++) {
      if (!results[i].valid) {
        allValid = false;
      }
      allErrors = allErrors.concat(results[i].errors);
    }

    return {
      valid: allValid,
      errors: allErrors
    };
  },

  /**
   * 验证单个表单字段
   */
  validateField(field) {
    var rules;
    try {
      rules = JSON.parse(field.dataset.validate || '{}');
    } catch (e) {
      return { valid: true, error: null };
    }

    var value = field.value;
    var error = null;

    if (rules.required && !value) {
      error = '此字段必填';
    } else if (value) {
      if (rules.type === 'number') {
        var num = parseFloat(value);
        if (isNaN(num)) {
          error = '请输入有效数字';
        } else {
          if (rules.min !== undefined && num < rules.min) {
            error = '最小值为 ' + rules.min;
          }
          if (rules.max !== undefined && num > rules.max) {
            error = '最大值为 ' + rules.max;
          }
        }
      }
      if (rules.minLength && value.length < rules.minLength) {
        error = '最少输入 ' + rules.minLength + ' 个字符';
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        error = '最多输入 ' + rules.maxLength + ' 个字符';
      }
    }

    return {
      valid: !error,
      error: error
    };
  },

  /**
   * 显示字段错误
   */
  showFieldError(field, error) {
    var errorEl = field.parentElement.querySelector('.error-msg');
    if (errorEl) {
      errorEl.textContent = error || '';
      errorEl.style.display = error ? 'block' : 'none';
    }
    field.classList.toggle('field-error', !!error);
  },

  /**
   * 验证Excel导入的一行数据
   */
  validateRow(rowData, rowIndex) {
    var errors = [];
    var warnings = [];
    var rowLabel = '第' + (rowIndex + 1) + '行: ';

    // 必填字段验证
    if (!rowData.childName) errors.push(rowLabel + '缺少儿童姓名');
    if (!rowData.gender) errors.push(rowLabel + '缺少性别');
    if (!rowData.birthDate) errors.push(rowLabel + '缺少出生日期');

    // 数值范围验证
    var height = parseFloat(rowData.height);
    if (isNaN(height)) {
      errors.push(rowLabel + '身高数据无效');
    } else if (height < 40 || height > 250) {
      errors.push(rowLabel + '身高应在40-250cm之间');
    }

    var weight = parseFloat(rowData.weight);
    if (isNaN(weight)) {
      errors.push(rowLabel + '体重数据无效');
    } else if (weight < 1 || weight > 150) {
      errors.push(rowLabel + '体重应在1-150kg之间');
    }

    var fh = parseFloat(rowData.fatherHeight);
    if (isNaN(fh)) {
      errors.push(rowLabel + '父亲身高数据无效');
    } else if (fh < 140 || fh > 220) {
      warnings.push(rowLabel + '父亲身高超出常见范围(140-220cm)');
    }

    var mh = parseFloat(rowData.motherHeight);
    if (isNaN(mh)) {
      errors.push(rowLabel + '母亲身高数据无效');
    } else if (mh < 130 || mh > 200) {
      warnings.push(rowLabel + '母亲身高超出常见范围(130-200cm)');
    }

    // 4D维度原始数据验证（检查是否有至少一个维度的数据）
    var has4DData = false;
    var d1Fields = ['d1_sleepDifficulty', 'd1_nightWaking', 'd1_earlyWaking', 'd1_dayEnergy'];
    var d2Fields = ['d2_pickyEating', 'd2_mealRegularity', 'd2_snackIntake', 'd2_breakfastHabit'];
    var d3Fields = ['d3_exerciseFrequency', 'd3_verticalSportRatio', 'd3_duration', 'd3_intensity'];
    var d4Fields = ['d4_anxiety', 'd4_sleepQuality', 'd4_appetiteChange', 'd4_socialWillingness', 'd4_familyAtmosphere', 'd4_parentExpectation', 'd4_academicPressure'];
    
    var all4DFields = d1Fields.concat(d2Fields, d3Fields, d4Fields);
    for (var i = 0; i < all4DFields.length; i++) {
      if (rowData[all4DFields[i]]) {
        has4DData = true;
        break;
      }
    }
    
    if (!has4DData) {
      warnings.push(rowLabel + '缺少4D评估维度数据，将使用默认值');
    }

    // 合并错误和警告
    var allIssues = errors.concat(warnings);

    return {
      valid: errors.length === 0,
      errors: allIssues,
      status: errors.length === 0 ? (warnings.length === 0 ? 'valid' : 'warning') : 'error'
    };
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataValidator;
}
