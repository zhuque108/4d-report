/**
 * Y-CAS Chart.js 4D雷达图配置模块
 */
const ChartConfig = {
  radarChart: null,

  /**
   * 初始化雷达图
   */
  initRadarChart(canvasId, scores4D) {
    var ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    // 销毁已有实例
    if (this.radarChart) {
      this.radarChart.destroy();
      this.radarChart = null;
    }

    var data = {
      labels: ['D1 深度睡眠', 'D2 精准营养', 'D3 纵向运动', 'D4 情绪与习惯'],
      datasets: [
        {
          label: '当前得分',
          data: [
            scores4D.d1_sleep || 0,
            scores4D.d2_nutrition || 0,
            scores4D.d3_sport || 0,
            scores4D.d4_mood || 0
          ],
          backgroundColor: 'rgba(12, 154, 240, 0.2)',
          borderColor: 'rgba(12, 154, 240, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(12, 154, 240, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: '目标得分',
          data: [90, 85, 85, 85],
          backgroundColor: 'rgba(20, 184, 166, 0.08)',
          borderColor: 'rgba(20, 184, 166, 0.5)',
          borderWidth: 2,
          borderDash: [6, 4],
          pointBackgroundColor: 'rgba(20, 184, 166, 0.5)',
          pointBorderColor: '#fff',
          pointBorderWidth: 1,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    };

    var options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { size: 12, family: '"Noto Sans SC", sans-serif' },
            padding: 20,
            usePointStyle: true,
            pointStyleWidth: 10
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + context.raw + '分';
            }
          }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          min: 0,
          ticks: {
            stepSize: 20,
            font: { size: 10 },
            backdropColor: 'transparent',
            color: '#9ca3af'
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.06)',
            circular: true
          },
          angleLines: {
            color: 'rgba(0, 0, 0, 0.08)'
          },
          pointLabels: {
            font: {
              size: 13,
              family: '"Noto Sans SC", sans-serif',
              weight: '500'
            },
            color: '#374151',
            padding: 15
          }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    };

    this.radarChart = new Chart(ctx.getContext('2d'), {
      type: 'radar',
      data: data,
      options: options
    });

    return this.radarChart;
  },

  /**
   * 更新雷达图数据
   */
  updateRadarChart(scores4D) {
    if (!this.radarChart) return;
    this.radarChart.data.datasets[0].data = [
      scores4D.d1_sleep || 0,
      scores4D.d2_nutrition || 0,
      scores4D.d3_sport || 0,
      scores4D.d4_mood || 0
    ];
    this.radarChart.update();
  },

  /**
   * 将雷达图转为图片用于PDF导出
   */
  getRadarChartImage() {
    if (!this.radarChart) return '';
    return this.radarChart.toBase64Image('image/png', 1.0);
  },

  /**
   * 销毁图表实例
   */
  destroy() {
    if (this.radarChart) {
      this.radarChart.destroy();
      this.radarChart = null;
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChartConfig;
}
