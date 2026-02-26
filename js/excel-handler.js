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
      '年增长速率': 'growthRate',
      '年增长速率(cm/年)': 'growthRate',
      '父亲身高': 'fatherHeight',
      '母亲身高': 'motherHeight',
      '评估日期': 'reportDate',
      // D1 深度睡眠
      'D1-入睡困难': 'd1_sleepDifficulty',
      'D1-夜间觉醒': 'd1_nightWaking',
      'D1-早醒情况': 'd1_earlyWaking',
      'D1-日间精神': 'd1_dayEnergy',
      'D1-入睡时间': 'd1_sleepTime',
      'D1-起床时间': 'd1_wakeTime',
      'D1-睡眠时长': 'd1_sleepDuration',
      'D1-睡眠时长(小时)': 'd1_sleepDuration',
      // D2 精准营养
      'D2-挑食偏食': 'd2_pickyEating',
      'D2-进餐时间': 'd2_mealRegularity',
      'D2-零食饮料': 'd2_snackIntake',
      'D2-早餐习惯': 'd2_breakfastHabit',
      'D2-牛奶摄入(ml)': 'd2_milkIntake',
      'D2-补钙补充': 'd2_calciumSupplement',
      // D3 纵向运动
      'D3-运动频率': 'd3_exerciseFrequency',
      'D3-纵向运动占比': 'd3_verticalSportRatio',
      'D3-单次运动时长': 'd3_duration',
      'D3-运动强度': 'd3_intensity',
      'D3-主要运动项目': 'd3_mainSports',
      // D4 情绪与习惯
      'D4-焦虑情绪': 'd4_anxiety',
      'D4-睡眠质量': 'd4_sleepQuality',
      'D4-食欲变化': 'd4_appetiteChange',
      'D4-社交意愿': 'd4_socialWillingness',
      'D4-家庭氛围': 'd4_familyAtmosphere',
      'D4-父母期望': 'd4_parentExpectation',
      'D4-学业压力': 'd4_academicPressure'
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

    // 处理4D维度原始数据
    var details4D = this.process4DDetails(item);
    var scores4D = this.calculateScores4D(details4D);

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
        growthRate: YCASUtils.safeParseFloat(item.growthRate) || 0
      },
      genetics: {
        fatherHeight: YCASUtils.safeParseFloat(item.fatherHeight),
        motherHeight: YCASUtils.safeParseFloat(item.motherHeight),
        targetHeight: 0,
        targetHeightRange: [0, 0]
      },
      boneAge: { hasXRay: false, age: '', ageDiff: 0, status: '', closureEstimate: '' },
      scores4D: scores4D,
      details4D: details4D,
      risks: USER_CONFIG.risks || {},
      predictions: {},
      interventions: USER_CONFIG.interventions || {},
      followUp: USER_CONFIG.followUp || {},
      advisor: USER_CONFIG.advisor || {},
      institution: USER_CONFIG.institution || {}
    };
  },

  process4DDetails(item) {
    // 映射Excel输入值到系统内部值
    var mapping = {
      // D1 映射
      d1_sleepDifficulty: {
        '无': 'none',
        '偶尔': 'occasional',
        '经常': 'often'
      },
      d1_nightWaking: {
        '0次': '0',
        '1-2次': '1-2',
        '3次以上': '3+'
      },
      d1_earlyWaking: {
        '无': 'none',
        '偶尔': 'occasional',
        '经常': 'often'
      },
      d1_dayEnergy: {
        '充沛': 'energetic',
        '一般': 'normal',
        '疲倦': 'tired'
      },
      // D2 映射
      d2_pickyEating: {
        '无': 'none',
        '轻度': 'mild',
        '中度': 'moderate',
        '重度': 'severe'
      },
      d2_mealRegularity: {
        '规律': 'regular',
        '不规律': 'irregular'
      },
      d2_snackIntake: {
        '很少': 'rarely',
        '偶尔': 'sometimes',
        '经常': 'often'
      },
      d2_breakfastHabit: {
        '每天吃': 'daily',
        '偶尔不吃': 'occasional',
        '经常不吃': 'rarely'
      },
      // D3 映射
      d3_exerciseFrequency: {
        '<=2次/周': '<=2',
        '3-4次/周': '3-4',
        '>=5次/周': '>=5'
      },
      d3_verticalSportRatio: {
        '<40%': '<40',
        '40-60%': '40-60',
        '>=60%': '>=60'
      },
      d3_duration: {
        '<30分钟': '<30',
        '30-45分钟': '30-45',
        '>=45分钟': '>=45'
      },
      d3_intensity: {
        '轻度': 'light',
        '中等': 'moderate',
        '剧烈': 'vigorous'
      },
      // D4 映射
      d4_anxiety: {
        '无': 'none',
        '偶尔': 'occasional',
        '经常': 'frequent'
      },
      d4_sleepQuality: {
        '好': 'good',
        '一般': 'fair',
        '差': 'poor'
      },
      d4_appetiteChange: {
        '无变化': 'none',
        '减少': 'decreased',
        '增加': 'increased'
      },
      d4_socialWillingness: {
        '高': 'high',
        '中': 'medium',
        '低': 'low'
      },
      d4_familyAtmosphere: {
        '和谐': 'harmonious',
        '紧张': 'tense',
        '冲突': 'conflict'
      },
      d4_parentExpectation: {
        '合理': 'reasonable',
        '较高': 'high',
        '过高': 'excessive'
      },
      d4_academicPressure: {
        '低': 'low',
        '中': 'medium',
        '高': 'high'
      }
    };

    // 处理D1
    var d1 = {
      sleepTime: item.d1_sleepTime || '21:30',
      wakeTime: item.d1_wakeTime || '07:00',
      sleepDuration: YCASUtils.safeParseFloat(item.d1_sleepDuration) || 9.5,
      sleepDifficulty: mapping.d1_sleepDifficulty[item.d1_sleepDifficulty] || 'none',
      nightWaking: mapping.d1_nightWaking[item.d1_nightWaking] || '0',
      earlyWaking: mapping.d1_earlyWaking[item.d1_earlyWaking] || 'none',
      dayEnergy: mapping.d1_dayEnergy[item.d1_dayEnergy] || 'energetic',
      summary: ''
    };

    // 处理D2
    var d2 = {
      pickyEating: mapping.d2_pickyEating[item.d2_pickyEating] || 'moderate',
      mealRegularity: mapping.d2_mealRegularity[item.d2_mealRegularity] || 'irregular',
      snackIntake: mapping.d2_snackIntake[item.d2_snackIntake] || 'often',
      breakfastHabit: mapping.d2_breakfastHabit[item.d2_breakfastHabit] || 'occasional',
      milkIntake: YCASUtils.safeParseInt(item.d2_milkIntake) || 500,
      calciumSupplement: item.d2_calciumSupplement === '是' || item.d2_calciumSupplement === 'true' || item.d2_calciumSupplement === true,
      summary: ''
    };

    // 处理D3
    var d3 = {
      exerciseFrequency: mapping.d3_exerciseFrequency[item.d3_exerciseFrequency] || '3-4',
      verticalSportRatio: mapping.d3_verticalSportRatio[item.d3_verticalSportRatio] || '<40',
      duration: mapping.d3_duration[item.d3_duration] || '<30',
      intensity: mapping.d3_intensity[item.d3_intensity] || 'moderate',
      mainSports: (item.d3_mainSports || '跳绳, 跑步').split(',').map(s => s.trim()),
      summary: ''
    };

    // 处理D4
    var d4 = {
      anxiety: mapping.d4_anxiety[item.d4_anxiety] || 'occasional',
      sleepQuality: mapping.d4_sleepQuality[item.d4_sleepQuality] || 'good',
      appetiteChange: mapping.d4_appetiteChange[item.d4_appetiteChange] || 'none',
      socialWillingness: mapping.d4_socialWillingness[item.d4_socialWillingness] || 'high',
      familyAtmosphere: mapping.d4_familyAtmosphere[item.d4_familyAtmosphere] || 'harmonious',
      parentExpectation: mapping.d4_parentExpectation[item.d4_parentExpectation] || 'reasonable',
      academicPressure: mapping.d4_academicPressure[item.d4_academicPressure] || 'low',
      summary: ''
    };

    // 生成总结
    this.generateSummaries({ d1, d2, d3, d4 }, this.calculateScores4D({ d1, d2, d3, d4 }));

    return { d1, d2, d3, d4 };
  },

  calculateScores4D(details4D) {
    // 评分配置
    const scoreConfig = {
      d1: {
        sleepDifficulty: {
          'none': 25,
          'occasional': 15,
          'often': 5
        },
        nightWaking: {
          '0': 25,
          '1-2': 15,
          '3+': 5
        },
        earlyWaking: {
          'none': 25,
          'occasional': 15,
          'often': 5
        },
        dayEnergy: {
          'energetic': 25,
          'normal': 15,
          'tired': 5
        }
      },
      d2: {
        pickyEating: {
          'none': 25,
          'mild': 20,
          'moderate': 10,
          'severe': 5
        },
        mealRegularity: {
          'regular': 25,
          'irregular': 10
        },
        snackIntake: {
          'rarely': 25,
          'sometimes': 20,
          'often': 10
        },
        breakfastHabit: {
          'daily': 25,
          'occasional': 15,
          'rarely': 5
        }
      },
      d3: {
        exerciseFrequency: {
          '<=2': 10,
          '3-4': 20,
          '>=5': 25
        },
        verticalSportRatio: {
          '<40': 10,
          '40-60': 15,
          '>=60': 25
        },
        duration: {
          '<30': 10,
          '30-45': 15,
          '>=45': 25
        },
        intensity: {
          'light': 15,
          'moderate': 25,
          'vigorous': 20
        }
      },
      d4: {
        anxiety: {
          'none': 25,
          'occasional': 20,
          'frequent': 10
        },
        sleepQuality: {
          'good': 25,
          'fair': 15,
          'poor': 10
        },
        appetiteChange: {
          'none': 25,
          'decreased': 15,
          'increased': 15
        },
        socialWillingness: {
          'high': 25,
          'medium': 15,
          'low': 10
        },
        familyAtmosphere: {
          'harmonious': 25,
          'tense': 10,
          'conflict': 5
        },
        parentExpectation: {
          'reasonable': 25,
          'high': 15,
          'excessive': 5
        },
        academicPressure: {
          'low': 25,
          'medium': 15,
          'high': 10
        }
      }
    };

    // 计算D1评分
    const d1Score = Math.round((
      scoreConfig.d1.sleepDifficulty[details4D.d1.sleepDifficulty] +
      scoreConfig.d1.nightWaking[details4D.d1.nightWaking] +
      scoreConfig.d1.earlyWaking[details4D.d1.earlyWaking] +
      scoreConfig.d1.dayEnergy[details4D.d1.dayEnergy]
    ) / 4);

    // 计算D2评分
    const d2Score = Math.round((
      scoreConfig.d2.pickyEating[details4D.d2.pickyEating] +
      scoreConfig.d2.mealRegularity[details4D.d2.mealRegularity] +
      scoreConfig.d2.snackIntake[details4D.d2.snackIntake] +
      scoreConfig.d2.breakfastHabit[details4D.d2.breakfastHabit]
    ) / 4);

    // 计算D3评分
    const d3Score = Math.round((
      scoreConfig.d3.exerciseFrequency[details4D.d3.exerciseFrequency] +
      scoreConfig.d3.verticalSportRatio[details4D.d3.verticalSportRatio] +
      scoreConfig.d3.duration[details4D.d3.duration] +
      scoreConfig.d3.intensity[details4D.d3.intensity]
    ) / 4);

    // 计算D4评分
    const d4Score = Math.round((
      scoreConfig.d4.anxiety[details4D.d4.anxiety] +
      scoreConfig.d4.sleepQuality[details4D.d4.sleepQuality] +
      scoreConfig.d4.appetiteChange[details4D.d4.appetiteChange] +
      scoreConfig.d4.socialWillingness[details4D.d4.socialWillingness] +
      scoreConfig.d4.familyAtmosphere[details4D.d4.familyAtmosphere] +
      scoreConfig.d4.parentExpectation[details4D.d4.parentExpectation] +
      scoreConfig.d4.academicPressure[details4D.d4.academicPressure]
    ) / 7);

    return {
      d1_sleep: d1Score,
      d2_nutrition: d2Score,
      d3_sport: d3Score,
      d4_mood: d4Score
    };
  },

  generateSummaries(details4D, scores4D) {
    // D1 总结
    if (scores4D.d1_sleep >= 80) {
      details4D.d1.summary = '睡眠质量良好，入睡快，夜间无觉醒';
    } else if (scores4D.d1_sleep >= 60) {
      details4D.d1.summary = '睡眠质量一般，存在入睡困难或夜间觉醒情况';
    } else {
      details4D.d1.summary = '睡眠质量较差，需要改善睡眠环境和作息习惯';
    }

    // D2 总结
    if (scores4D.d2_nutrition >= 80) {
      details4D.d2.summary = '饮食规律，营养均衡，无挑食偏食现象';
    } else if (scores4D.d2_nutrition >= 60) {
      details4D.d2.summary = '挑食偏食较严重，早餐不规律，零食摄入偏多';
    } else {
      details4D.d2.summary = '饮食结构不合理，营养摄入严重不足，需要专业指导';
    }

    // D3 总结
    if (scores4D.d3_sport >= 80) {
      details4D.d3.summary = '运动频率充足，纵向运动占比高，时长和强度适宜';
    } else if (scores4D.d3_sport >= 60) {
      details4D.d3.summary = '运动频率尚可，但纵向运动占比偏低，时长不足';
    } else {
      details4D.d3.summary = '运动量严重不足，需要增加运动频率和纵向运动比例';
    }

    // D4 总结
    if (scores4D.d4_mood >= 80) {
      details4D.d4.summary = '情绪稳定，家庭氛围和谐，社交意愿高';
    } else if (scores4D.d4_mood >= 60) {
      details4D.d4.summary = '情绪整体稳定，家庭氛围和谐，偶有焦虑情绪';
    } else {
      details4D.d4.summary = '情绪波动较大，家庭氛围紧张，需要心理疏导';
    }
  },

  renderPreview() {
    var container = document.getElementById('import-preview');
    if (!container) return;

    var self = this;
    var rows = this.importedData.map(function(item) {
      var statusIcon = item._valid ? '<span style="color:#10b981">&#10003; 正常</span>' :
        (item._status === 'warning' ? '<span style="color:#f59e0b">&#9888; 警告</span>' :
        '<span style="color:#ef4444">&#10007; 错误</span>');

      // 根据状态决定按钮是否可用
      var exportBtn = item._valid ?
        '<button class="btn btn-sm btn-primary" onclick="ExcelHandler.exportSingle(' + item._index + ')" style="padding:4px 12px;font-size:12px;"><i class="fas fa-print"></i> 打印</button>' :
        '<button class="btn btn-sm" disabled style="padding:4px 12px;font-size:12px;opacity:0.5;cursor:not-allowed;">数据有误</button>';

      return '<tr>' +
        '<td><input type="checkbox" class="row-check" data-index="' + item._index + '" ' + (item._valid ? 'checked' : '') + '></td>' +
        '<td>' + item._index + '</td>' +
        '<td>' + (item.childName || '-') + '</td>' +
        '<td>' + (item.gender || '-') + '</td>' +
        '<td>' + (item.height || '-') + '</td>' +
        '<td>' + (item.weight || '-') + '</td>' +
        '<td>' + statusIcon + '</td>' +
        '<td>' + exportBtn + '</td>' +
      '</tr>';
    }).join('');

    container.innerHTML =
      '<div style="margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">' +
        '<span style="font-size:14px;font-weight:600;">数据预览</span>' +
        '<div>' +
          '<button class="btn btn-default" onclick="ExcelHandler.selectAll()" style="margin-right:8px;">全选</button>' +
          '<button class="btn btn-primary" onclick="ExcelHandler.exportSelected()" style="margin-right:8px;"><i class="fas fa-print"></i> 打印选中</button>' +
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
          '<th style="padding:8px;text-align:left;">操作</th>' +
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

  /**
   * 单条打印导出
   */
  async exportSingle(index) {
    var item = this.importedData.find(function(d) { return d._index === index; });
    if (!item || !item._config) {
      alert('数据不存在或配置无效');
      return;
    }

    // 显示加载提示
    var btn = document.querySelector('button[onclick="ExcelHandler.exportSingle(' + index + ')"]');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 准备打印...';
    }

    try {
      // 使用深拷贝避免污染全局配置
      var configCopy = YCASUtils.deepClone(item._config);
      ReportRenderer.init(configCopy);

      // 动态等待图表渲染完成
      await this.waitForChartRender();

      // 调用浏览器打印
      PDFExporter.export(item._config.child.name, item._config.report.id);
    } catch (err) {
      console.error('打印失败:', err);
      alert('打印失败: ' + err.message);
    } finally {
      // 恢复按钮状态
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-print"></i> 打印';
      }
    }
  },

  async exportSelected() {
    var indices = this.getSelectedIndices();
    if (indices.length === 0) {
      alert('请至少选择一条记录');
      return;
    }

    var item = this.importedData.find(function(d) { return d._index === indices[0]; });
    if (!item || !item._config) return;

    // 使用深拷贝避免污染全局配置
    var configCopy = YCASUtils.deepClone(item._config);
    ReportRenderer.init(configCopy);

    // 动态等待图表渲染完成
    await this.waitForChartRender();

    PDFExporter.export(item._config.child.name, item._config.report.id);
  },

  /**
   * 动态等待图表渲染完成
   * 图表动画时间为800ms，需要确保动画完成后再导出
   */
  async waitForChartRender() {
    // 等待图表动画完成（动画时间800ms + 缓冲）
    await new Promise(function(r) { setTimeout(r, 1000); });

    // 额外检查图表实例是否存在
    var maxWait = 2000;
    var elapsed = 0;

    while (elapsed < maxWait) {
      var canvas = document.getElementById('radarChart');
      var hasChart = typeof ChartConfig !== 'undefined' && ChartConfig.radarChart !== null;

      if (canvas && canvas.width > 0 && canvas.height > 0 && hasChart) {
        return;
      }
      await new Promise(function(r) { setTimeout(r, 100); });
      elapsed += 100;
    }

    console.warn('图表渲染检查超时，继续导出');
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
    var successCount = 0;
    var failCount = 0;
    var failedItems = [];

    for (var i = 0; i < indices.length; i++) {
      var item = this.importedData.find(function(d) { return d._index === indices[i]; });
      if (!item || !item._config) continue;

      this.updateProgress((i / indices.length) * 100);

      try {
        // 使用深拷贝避免污染全局配置
        var configCopy = YCASUtils.deepClone(item._config);
        ReportRenderer.init(configCopy);

        // 动态等待图表渲染
        await this.waitForChartRender();

        // 生成PDF Blob
        var pdfBlob = await PDFExporter.generateBlob();
        if (pdfBlob) {
          folder.file(item._config.child.name + '-评估报告.pdf', pdfBlob);
          successCount++;
        } else {
          throw new Error('PDF生成失败');
        }
      } catch (err) {
        failCount++;
        failedItems.push(item._config.child.name || '记录' + item._index);
        console.error('生成报告失败 [' + item._config.child.name + ']:', err);
      }
    }

    this.updateProgress(100);

    try {
      if (successCount > 0) {
        var zipBlob = await zip.generateAsync({ type: 'blob' });
        YCASUtils.downloadFile(zipBlob, 'Y-CAS批量报告-' + YCASUtils.formatDate(new Date()) + '.zip');

        // 显示导出结果
        if (failCount > 0) {
          alert('批量导出完成！\n成功: ' + successCount + ' 份\n失败: ' + failCount + ' 份\n\n失败项：' + failedItems.join(', '));
        }
      } else {
        alert('所有报告生成失败，请检查数据后重试');
      }
    } catch (err) {
      console.error('ZIP打包失败:', err);
      alert('ZIP打包失败: ' + err.message);
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
    ['评估编号', '儿童姓名', '性别', '出生日期', '身高(cm)', '体重(kg)', '年增长速率(cm/年)',
     '父亲身高', '母亲身高', '评估日期',
     // D1 深度睡眠
     'D1-入睡困难', 'D1-夜间觉醒', 'D1-早醒情况', 'D1-日间精神', 'D1-入睡时间', 'D1-起床时间', 'D1-睡眠时长(小时)',
     // D2 精准营养
     'D2-挑食偏食', 'D2-进餐时间', 'D2-零食饮料', 'D2-早餐习惯', 'D2-牛奶摄入(ml)', 'D2-补钙补充',
     // D3 纵向运动
     'D3-运动频率', 'D3-纵向运动占比', 'D3-单次运动时长', 'D3-运动强度', 'D3-主要运动项目',
     // D4 情绪与习惯
     'D4-焦虑情绪', 'D4-睡眠质量', 'D4-食欲变化', 'D4-社交意愿', 'D4-家庭氛围', 'D4-父母期望', 'D4-学业压力'],
    ['YCAS-2025-001', '张小萌', '女', '2016-03-15', 128.5, 26.8, 5.5,
     175, 162, '2025-02-11',
     '无', '0次', '无', '充沛', '21:30', '07:00', 9.5,
     '中度', '不规律', '经常', '偶尔不吃', 500, '否',
     '3-4次/周', '40-60%', '30-45分钟', '中等', '跳绳, 跑步',
     '偶尔', '好', '无变化', '高', '和谐', '合理', '低'],
    ['YCAS-2025-002', '王小明', '男', '2015-08-20', 135.0, 30.2, 6.0,
     178, 165, '2025-02-11',
     '偶尔', '1-2次', '偶尔', '一般', '22:00', '07:00', 9,
     '轻度', '规律', '偶尔', '每天吃', 600, '是',
     '>=5次/周', '>=60%', '>=45分钟', '剧烈', '篮球, 摸高',
     '无', '好', '无变化', '高', '和谐', '合理', '中']
  ];

  var ws = XLSX.utils.aoa_to_sheet(template);
  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '用户数据');

  ws['!cols'] = [
    { wch: 16 }, { wch: 10 }, { wch: 6 }, { wch: 12 },
    { wch: 10 }, { wch: 10 }, { wch: 14 },
    { wch: 10 }, { wch: 10 }, { wch: 12 },
    // D1
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
    // D2
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 10 },
    // D3
    { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 15 },
    // D4
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }
  ];

  XLSX.writeFile(wb, 'Y-CAS数据导入模板.xlsx');
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExcelHandler: ExcelHandler, downloadTemplate: downloadTemplate };
}
