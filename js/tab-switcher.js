/**
 * Y-CAS 标签页切换控制
 */
const TabSwitcher = {
  currentTab: 'form',

  init() {
    var tabs = document.querySelectorAll('[data-tab]');
    var self = this;
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        self.switchTo(tab.dataset.tab);
      });
    });

    // 默认显示第一个标签页
    this.switchTo('form');
  },

  switchTo(tabName) {
    this.currentTab = tabName;

    // 更新标签按钮状态
    document.querySelectorAll('[data-tab]').forEach(function(tab) {
      if (tab.dataset.tab === tabName) {
        tab.classList.add('tab-active');
        tab.classList.remove('tab-inactive');
      } else {
        tab.classList.remove('tab-active');
        tab.classList.add('tab-inactive');
      }
    });

    // 切换面板
    document.querySelectorAll('[data-panel]').forEach(function(panel) {
      panel.style.display = panel.dataset.panel === tabName ? 'block' : 'none';
    });

    // 切换报告预览区域
    var reportContainer = document.getElementById('report-container');
    var inputPanel = document.getElementById('input-panel');

    if (tabName === 'preview') {
      if (reportContainer) reportContainer.style.display = 'block';
      if (inputPanel) inputPanel.style.display = 'none';
    } else {
      if (reportContainer) reportContainer.style.display = 'none';
      if (inputPanel) inputPanel.style.display = 'block';
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TabSwitcher;
}
