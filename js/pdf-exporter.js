/**
 * Y-CAS PDF导出模块
 * 使用浏览器打印功能导出PDF
 */
const PDFExporter = {
  /**
   * 导出单份PDF - 使用浏览器打印
   */
  async export(childName, reportId) {
    var btn = document.querySelector('[data-action="export-pdf"]');
    var originalText = '';
    if (btn) {
      originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:6px;"></i>准备打印...';
      btn.disabled = true;
    }

    // 保存原始显示状态
    var toolbar = document.getElementById('toolbar');
    var inputPanel = document.getElementById('input-panel');
    var reportContainer = document.getElementById('report-container');

    var toolbarDisplay = toolbar ? toolbar.style.display : '';
    var inputPanelDisplay = inputPanel ? inputPanel.style.display : '';
    var reportContainerDisplay = reportContainer ? reportContainer.style.display : '';

    try {
      // 隐藏工具栏和输入面板
      if (toolbar) toolbar.style.display = 'none';
      if (inputPanel) inputPanel.style.display = 'none';

      // 显示报告容器
      if (reportContainer) reportContainer.style.display = 'block';

      // 等待渲染完成
      await new Promise(function(r) { setTimeout(r, 300); });

      // 调用浏览器打印
      window.print();

    } catch (error) {
      console.error('打印导出失败:', error);
      alert('打印导出失败: ' + error.message);
    } finally {
      // 恢复显示状态
      if (toolbar) toolbar.style.display = toolbarDisplay;
      if (inputPanel) inputPanel.style.display = inputPanelDisplay;
      if (reportContainer) reportContainer.style.display = reportContainerDisplay;

      if (btn) {
        btn.innerHTML = originalText;
        btn.disabled = false;
      }
    }
  },

  /**
   * 生成PDF Blob（用于批量导出）
   * 注意：批量导出仍使用 html2pdf.js
   */
  async generateBlob() {
    var element = document.getElementById('report-container');
    if (!element) return null;

    // 隐藏工具栏和输入面板，显示报告容器
    var toolbar = document.getElementById('toolbar');
    var inputPanel = document.getElementById('input-panel');

    var toolbarDisplay = toolbar ? toolbar.style.display : '';
    var inputPanelDisplay = inputPanel ? inputPanel.style.display : '';
    var elementDisplay = element.style.display;

    if (toolbar) toolbar.style.display = 'none';
    if (inputPanel) inputPanel.style.display = 'none';
    element.style.display = 'block';

    var originalPaddingTop = element.style.paddingTop;
    element.style.paddingTop = '0';

    var config = {
      margin: 0,
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
    };

    try {
      var blob = await html2pdf()
        .set(config)
        .from(element)
        .output('blob');

      element.style.paddingTop = originalPaddingTop;
      element.style.display = elementDisplay;
      if (toolbar) toolbar.style.display = toolbarDisplay;
      if (inputPanel) inputPanel.style.display = inputPanelDisplay;
      return blob;
    } catch (error) {
      element.style.paddingTop = originalPaddingTop;
      element.style.display = elementDisplay;
      if (toolbar) toolbar.style.display = toolbarDisplay;
      if (inputPanel) inputPanel.style.display = inputPanelDisplay;
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
