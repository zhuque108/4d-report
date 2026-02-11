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

    // 滑块联动数字显示
    document.querySelectorAll('input[type="range"]').forEach(function(range) {
      var display = document.getElementById(range.id + '-display');
      if (display) {
        range.addEventListener('input', function() {
          display.textContent = range.value;
        });
      }
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
      scores4D: {
        d1_sleep: YCASUtils.safeParseInt(fd.get('d1Score')),
        d2_nutrition: YCASUtils.safeParseInt(fd.get('d2Score')),
        d3_sport: YCASUtils.safeParseInt(fd.get('d3Score')),
        d4_mood: YCASUtils.safeParseInt(fd.get('d4Score'))
      },
      details4D: USER_CONFIG.details4D || {},
      risks: USER_CONFIG.risks || {},
      predictions: {},
      interventions: USER_CONFIG.interventions || {},
      followUp: USER_CONFIG.followUp || {},
      advisor: USER_CONFIG.advisor || {},
      institution: USER_CONFIG.institution || {}
    };
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
