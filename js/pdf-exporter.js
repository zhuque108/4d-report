/**
 * Y-CAS PDF导出模块
 */
const PDFExporter = {
  config: {
    margin: 0,
    filename: 'Y-CAS儿童身高管理评估报告.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['css', 'legacy'],
      before: '.page'
    }
  },

  /**
   * 导出单份PDF
   */
  async export(childName, reportId) {
    var element = document.getElementById('report-container');
    if (!element) return;

    var btn = document.querySelector('[data-action="export-pdf"]');
    var originalText = '';
    if (btn) {
      originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i>生成中...';
      btn.disabled = true;
    }

    try {
      // 隐藏工具栏和输入面板
      var toolbar = document.getElementById('toolbar');
      var inputPanel = document.getElementById('input-panel');
      if (toolbar) toolbar.style.display = 'none';
      if (inputPanel) inputPanel.style.display = 'none';

      // 临时移除容器上边距
      var originalPaddingTop = element.style.paddingTop;
      element.style.paddingTop = '0';

      // 构建PDF配置
      var exportConfig = Object.assign({}, this.config);
      exportConfig.filename = this.generateFilename(childName, reportId);

      await html2pdf().set(exportConfig).from(element).save();

      // 恢复
      element.style.paddingTop = originalPaddingTop;
      if (toolbar) toolbar.style.display = '';
      if (inputPanel) inputPanel.style.display = '';
    } catch (error) {
      console.error('PDF导出失败:', error);
      alert('PDF导出失败，请重试。错误信息: ' + error.message);
    } finally {
      if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  },

  /**
   * 生成PDF Blob（用于批量导出）
   */
  async generateBlob() {
    var element = document.getElementById('report-container');
    if (!element) return null;

    var originalPaddingTop = element.style.paddingTop;
    element.style.paddingTop = '0';

    try {
      var blob = await html2pdf()
        .set(this.config)
        .from(element)
        .output('blob');

      element.style.paddingTop = originalPaddingTop;
      return blob;
    } catch (error) {
      element.style.paddingTop = originalPaddingTop;
      console.error('PDF Blob生成失败:', error);
      return null;
    }
  },

  /**
   * 生成文件名
   */
  generateFilename(childName, reportId) {
    var date = YCASUtils.formatDate(new Date());
    var name = childName || '未知';
    return 'Y-CAS报告-' + name + '-' + date + '.pdf';
  }
};

// 全局快捷函数
function exportPDF() {
  var data = USER_CONFIG;
  PDFExporter.export(
    data.child ? data.child.name : '',
    data.report ? data.report.id : ''
  );
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PDFExporter;
}
