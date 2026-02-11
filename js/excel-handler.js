/**
 * Y-CAS Excel批量导入处理模块
 * 依赖: SheetJS (xlsx.js), JSZip
 */
const ExcelHandler = {
  importedData: [],

  init() {
    this.bindDragDrop();
    this.bindFileInput();
  },

  bindDragDrop() {
    var dropZone = document.getElementById('drop-zone');
    if (!dropZone) return;
    var self = this;

    dropZone.addEventListener('dragover', function(e) {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', function() {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      var files = e.dataTransfer.files;
      if (files.length > 0) {
        self.handleFile(files[0]);
      }
    });
  },

  bindFileInput() {
    var fileInput = document.getElementById('excel-file-input');
    if (!fileInput) return;
    var self = this;

    fileInput.addEventListener('change', function() {
      if (fileInput.files.length > 0) {
        self.handleFile(fileInput.files[0]);
      }
    });
  },

  async handleFile(file) {
    var validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    var ext = file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(file.type) && ext !== 'xlsx' && ext !== 'xls') {
      alert('请上传 Excel 文件 (.xlsx 或 .xls)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过 5MB');
      return;
    }

    try {
      this.showStatus('解析中...');
      var rawData = await this.parseExcel(file);
      this.importedData = this.transformData(rawData);

      if (this.importedData.length === 0) {
        alert('未检测到有效数据行，请检查Excel格式');
        return;
      }

      if (this.importedData.length > 50) {
        alert('单次最多导入50条记录，当前检测到' + this.importedData.length + '条');
        this.importedData = this.importedData.slice(0, 50);
      }

      this.renderPreview();
      this.showStatus('成功导入 ' + this.importedData.length + ' 条记录');
    } catch (error) {
      console.error('Excel解析失败:', error);
      alert('Excel文件解析失败，请检查文件格式');
    }
  },

  parseExcel(file) {
    return new Promise(function(resolve, reject) {
      var reader = new FileReader();
      reader.onload = function(e) {
        try {
          var data = new Uint8Array(e.target.result);
          var workbook = XLSX.read(data, { type: 'array' });
          var firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          var jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  },

  transformData(rawData) {
    if (!rawData || rawData.length < 2) return [];

    var headers = rawData[0];
    var rows = rawData.slice(1);

    var headerMap = {
      '评估编号': 'reportId',
      '儿童姓名': 'childName',
      '姓名': 'childName',
      '性别': 'gender',
      '出生日期': 'birthDate',
      '身高': 'height',
      '身高(cm)': 'height',
      '体重': 'weight',
      '体重(kg)': 'weight',
      '父亲身高': 'fatherHeight',
      '母亲身高': 'motherHeight',
      'D1睡眠评分': 'd1Score',
      'D2营养评分': 'd2Score',
      'D3运动评分': 'd3Score',
      'D4情绪评分': 'd4Score',
      '评估日期': 'reportDate'
    };

    var self = this;
    return rows
      .filter(function(row) {
        // 过滤空行
        return row.some(function(cell) { return cell !== undefined && cell !== null && cell !== ''; });
      })
      .map(function(row, index) {
        var item = { _index: index + 1 };
        headers.forEach(function(header, i) {
          var cleanHeader = String(header).trim();
          var key = headerMap[cleanHeader];
          if (key) {
            item[key] = row[i];
          }
        });

        // 验证
        var validation = DataValidator.validateRow(item, index);
        item._valid = validation.valid;
        item._status = validation.status;
        item._errors = validation.errors;

        // 转为CONFIG格式
        item._config = self.convertToConfig(item);
        return item;
      });
  },

  convertToConfig(item) {
    var dateVal = item.reportDate;
    if (dateVal instanceof Date) {
      dateVal = YCASUtils.formatDate(dateVal);
    } else if (typeof dateVal === 'number') {
      // Excel日期序列号转换
      var d = new Date((dateVal - 25569) * 86400 * 1000);
      dateVal = YCASUtils.formatDate(d);
    }

    var birthVal = item.birthDate;
    if (birthVal instanceof Date) {
      birthVal = YCASUtils.formatDate(birthVal);
    } else if (typeof birthVal === 'number') {
      var bd = new Date((birthVal - 25569) * 86400 * 1000);
      birthVal = YCASUtils.formatDate(bd);
    }

    return {
      report: {
        id: item.reportId || YCASUtils.generateReportId(item._index),
        date: dateVal || YCASUtils.formatDate(new Date()),
        generatedAt: YCASUtils.getNow()
      },
      child: {
        name: item.childName || '',
        gender: YCASUtils.genderCode(item.gender),
        birthDate: birthVal || '',
        age: '',
        avatar: null
      },
      measurements: {
        date: dateVal || YCASUtils.formatDate(new Date()),
        height: YCASUtils.safeParseFloat(item.height),
        weight: YCASUtils.safeParseFloat(item.weight),
        heightPercentile: '',
        heightLevel: '',
        heightLabel: '',
        bmi: 0,
        bmiStatus: '',
        growthRate: 0
      },
      genetics: {
        fatherHeight: YCASUtils.safeParseFloat(item.fatherHeight),
        motherHeight: YCASUtils.safeParseFloat(item.motherHeight),
        targetHeight: 0,
        targetHeightRange: [0, 0]
      },
      boneAge: { hasXRay: false, age: '', ageDiff: 0, status: '', closureEstimate: '' },
      scores4D: {
        d1_sleep: YCASUtils.safeParseInt(item.d1Score),
        d2_nutrition: YCASUtils.safeParseInt(item.d2Score),
        d3_sport: YCASUtils.safeParseInt(item.d3Score),
        d4_mood: YCASUtils.safeParseInt(item.d4Score)
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

  renderPreview() {
    var container = document.getElementById('import-preview');
    if (!container) return;

    var rows = this.importedData.map(function(item) {
      var statusIcon = item._valid ? '<span style="color:#10b981">&#10003; 正常</span>' :
        (item._status === 'warning' ? '<span style="color:#f59e0b">&#9888; 警告</span>' :
        '<span style="color:#ef4444">&#10007; 错误</span>');

      return '<tr>' +
        '<td><input type="checkbox" class="row-check" data-index="' + item._index + '" ' + (item._valid ? 'checked' : '') + '></td>' +
        '<td>' + item._index + '</td>' +
        '<td>' + (item.childName || '-') + '</td>' +
        '<td>' + (item.gender || '-') + '</td>' +
        '<td>' + (item.height || '-') + '</td>' +
        '<td>' + (item.weight || '-') + '</td>' +
        '<td>' + statusIcon + '</td>' +
      '</tr>';
    }).join('');

    container.innerHTML =
      '<div style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">' +
        '<span style="font-size:14px;font-weight:600;">数据预览</span>' +
        '<div>' +
          '<button class="btn btn-default" onclick="ExcelHandler.selectAll()" style="margin-right:8px;">全选</button>' +
          '<button class="btn btn-primary" onclick="ExcelHandler.exportSelected()" style="margin-right:8px;"><i class="fas fa-file-pdf"></i> 导出选中PDF</button>' +
          '<button class="btn btn-success" onclick="ExcelHandler.batchExportZip()"><i class="fas fa-file-archive"></i> 打包下载ZIP</button>' +
        '</div>' +
      '</div>' +
      '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
        '<thead><tr style="background:#f9fafb;">' +
          '<th style="padding:8px;text-align:left;width:30px;"><input type="checkbox" id="check-all" onchange="ExcelHandler.toggleAll(this.checked)"></th>' +
          '<th style="padding:8px;text-align:left;">序号</th>' +
          '<th style="padding:8px;text-align:left;">姓名</th>' +
          '<th style="padding:8px;text-align:left;">性别</th>' +
          '<th style="padding:8px;text-align:left;">身高</th>' +
          '<th style="padding:8px;text-align:left;">体重</th>' +
          '<th style="padding:8px;text-align:left;">状态</th>' +
        '</tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
      '<div id="export-progress" style="display:none;margin-top:16px;">' +
        '<div style="font-size:13px;color:var(--gray-500);margin-bottom:4px;">导出进度</div>' +
        '<div class="progress-bar-container"><div class="progress-bar-fill" id="progress-fill" style="width:0%"></div></div>' +
        '<div id="progress-text" style="font-size:12px;color:var(--gray-400);text-align:center;">0%</div>' +
      '</div>';

    container.style.display = 'block';
  },

  selectAll() {
    document.querySelectorAll('.row-check').forEach(function(cb) { cb.checked = true; });
    var checkAll = document.getElementById('check-all');
    if (checkAll) checkAll.checked = true;
  },

  toggleAll(checked) {
    document.querySelectorAll('.row-check').forEach(function(cb) { cb.checked = checked; });
  },

  getSelectedIndices() {
    var indices = [];
    document.querySelectorAll('.row-check:checked').forEach(function(cb) {
      indices.push(parseInt(cb.dataset.index, 10));
    });
    return indices;
  },

  async exportSelected() {
    var indices = this.getSelectedIndices();
    if (indices.length === 0) {
      alert('请至少选择一条记录');
      return;
    }

    var item = this.importedData.find(function(d) { return d._index === indices[0]; });
    if (!item || !item._config) return;

    Object.assign(USER_CONFIG, item._config);
    ReportRenderer.init(USER_CONFIG);

    // 等待图表渲染
    await new Promise(function(r) { setTimeout(r, 500); });

    PDFExporter.export(item._config.child.name, item._config.report.id);
  },

  async batchExportZip() {
    var indices = this.getSelectedIndices();
    if (indices.length === 0) {
      alert('请至少选择一条记录');
      return;
    }

    if (typeof JSZip === 'undefined') {
      alert('JSZip库未加载，无法打包下载');
      return;
    }

    var progressEl = document.getElementById('export-progress');
    if (progressEl) progressEl.style.display = 'block';

    var zip = new JSZip();
    var folder = zip.folder('Y-CAS报告');
    var self = this;

    for (var i = 0; i < indices.length; i++) {
      var item = this.importedData.find(function(d) { return d._index === indices[i]; });
      if (!item || !item._config) continue;

      this.updateProgress((i / indices.length) * 100);

      // 渲染报告
      Object.assign(USER_CONFIG, item._config);
      ReportRenderer.init(USER_CONFIG);

      // 等待图表渲染
      await new Promise(function(r) { setTimeout(r, 600); });

      // 生成PDF Blob
      var pdfBlob = await PDFExporter.generateBlob();
      if (pdfBlob) {
        folder.file(item._config.child.name + '-评估报告.pdf', pdfBlob);
      }
    }

    this.updateProgress(100);

    try {
      var zipBlob = await zip.generateAsync({ type: 'blob' });
      YCASUtils.downloadFile(zipBlob, 'Y-CAS批量报告-' + YCASUtils.formatDate(new Date()) + '.zip');
    } catch (err) {
      console.error('ZIP打包失败:', err);
      alert('ZIP打包失败');
    }

    // 3秒后隐藏进度条
    setTimeout(function() {
      if (progressEl) progressEl.style.display = 'none';
    }, 3000);
  },

  updateProgress(percent) {
    var fill = document.getElementById('progress-fill');
    var text = document.getElementById('progress-text');
    if (fill) fill.style.width = Math.round(percent) + '%';
    if (text) text.textContent = Math.round(percent) + '%';
  },

  showStatus(msg) {
    var statusEl = document.getElementById('import-status');
    if (statusEl) {
      statusEl.textContent = msg;
      statusEl.style.display = 'block';
    }
  }
};

/**
 * 下载Excel模板
 */
function downloadTemplate() {
  if (typeof XLSX === 'undefined') {
    alert('SheetJS库未加载，无法生成模板');
    return;
  }

  var template = [
    ['评估编号', '儿童姓名', '性别', '出生日期', '身高(cm)', '体重(kg)',
     '父亲身高', '母亲身高', 'D1睡眠评分', 'D2营养评分', 'D3运动评分', 'D4情绪评分', '评估日期'],
    ['YCAS-2025-001', '张小萌', '女', '2016-03-15', 128.5, 26.8,
     175, 162, 85, 68, 72, 78, '2025-02-11'],
    ['YCAS-2025-002', '王小明', '男', '2015-08-20', 135.0, 30.2,
     178, 165, 75, 80, 85, 70, '2025-02-11']
  ];

  var ws = XLSX.utils.aoa_to_sheet(template);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '用户数据');

  ws['!cols'] = [
    { wch: 16 }, { wch: 10 }, { wch: 6 }, { wch: 12 },
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }
  ];

  XLSX.writeFile(wb, 'Y-CAS数据导入模板.xlsx');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExcelHandler: ExcelHandler, downloadTemplate: downloadTemplate };
}
