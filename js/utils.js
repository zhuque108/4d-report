/**
 * Y-CAS 工具函数模块
 */
const YCASUtils = {
  /**
   * 计算年龄（返回 {years, months, text}）
   */
  calculateAge(birthDate, referenceDate) {
    const birth = new Date(birthDate);
    const ref = referenceDate ? new Date(referenceDate) : new Date();

    let years = ref.getFullYear() - birth.getFullYear();
    let months = ref.getMonth() - birth.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }
    if (ref.getDate() < birth.getDate()) {
      months--;
      if (months < 0) {
        years--;
        months += 12;
      }
    }

    return {
      years: years,
      months: months,
      totalMonths: years * 12 + months,
      text: months > 0 ? years + '岁' + months + '个月' : years + '岁'
    };
  },

  /**
   * 获取整岁年龄（用于查表）
   */
  getAgeInYears(birthDate, referenceDate) {
    const age = this.calculateAge(birthDate, referenceDate);
    return age.years;
  },

  /**
   * 格式化日期为 YYYY-MM-DD
   */
  formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  },

  /**
   * 格式化日期为中文 YYYY年MM月DD日
   */
  formatDateCN(date) {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' + d.getDate() + '日';
  },

  /**
   * 根据路径获取对象值，如 'child.name'
   */
  getValueByPath(obj, path) {
    if (!obj || !path) return undefined;
    return path.split('.').reduce(function(o, p) {
      return o && o[p] !== undefined ? o[p] : undefined;
    }, obj);
  },

  /**
   * 根据路径设置对象值
   */
  setValueByPath(obj, path, value) {
    if (!obj || !path) return;
    var parts = path.split('.');
    var current = obj;
    for (var i = 0; i < parts.length - 1; i++) {
      if (current[parts[i]] === undefined) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
  },

  /**
   * 生成报告编号 YCAS-YYYY-NNN
   */
  generateReportId(index) {
    var now = new Date();
    var year = now.getFullYear();
    var num = String(index || 1).padStart(3, '0');
    return 'YCAS-' + year + '-' + num;
  },

  /**
   * 获取当前日期时间字符串
   */
  getNow() {
    var now = new Date();
    return this.formatDate(now) + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');
  },

  /**
   * 深拷贝对象
   */
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * 性别文本转换
   */
  genderText(gender) {
    return gender === 'male' ? '男' : gender === 'female' ? '女' : '';
  },

  /**
   * 性别代码转换（中文→英文）
   */
  genderCode(text) {
    if (text === '男') return 'male';
    if (text === '女') return 'female';
    return text;
  },

  /**
   * 数值范围限制
   */
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },

  /**
   * 安全解析浮点数
   */
  safeParseFloat(value, defaultValue) {
    var result = parseFloat(value);
    return isNaN(result) ? (defaultValue || 0) : result;
  },

  /**
   * 安全解析整数
   */
  safeParseInt(value, defaultValue) {
    var result = parseInt(value, 10);
    return isNaN(result) ? (defaultValue || 0) : result;
  },

  /**
   * 风险等级颜色
   */
  riskColor(level) {
    var colors = {
      low: '#10b981',
      medium: '#f59e0b',
      high: '#ef4444'
    };
    return colors[level] || '#6b7280';
  },

  /**
   * 风险等级文本
   */
  riskText(level) {
    var texts = {
      low: '低风险',
      medium: '中风险',
      high: '高风险'
    };
    return texts[level] || '未评估';
  },

  /**
   * 优先级文本
   */
  priorityText(priority) {
    var texts = {
      urgent: '紧急改善',
      improve: '需要改善',
      maintain: '保持即可'
    };
    return texts[priority] || '';
  },

  /**
   * 优先级颜色
   */
  priorityColor(priority) {
    var colors = {
      urgent: '#ef4444',
      improve: '#f59e0b',
      maintain: '#10b981'
    };
    return colors[priority] || '#6b7280';
  },

  /**
   * 下载文件
   */
  downloadFile(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = YCASUtils;
}
