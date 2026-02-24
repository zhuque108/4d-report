/**
* Y-CAS 报告渲染引擎 - 6页报告动态生成
*/
const ReportRenderer = {
  data: null,

  // 信任背书样式
  trustBadgeStyle: {
    main: 'background:linear-gradient(135deg,#f8fafc 0%,#f1f5f9 100%);border:1px solid #e2e8f0;border-left:4px solid #0c9af0;border-radius:12px;padding:16px 20px;margin:15px 0;font-size:12px;line-height:1.7;color:#475569;',
    title: 'font-weight:600;color:#0f172a;margin-bottom:8px;display:flex;align-items:center;gap:8px;font-size:13px;',
    small: 'background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px 14px;font-size:11px;line-height:1.6;color:#64748b;',
    inline: 'display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#e0effe 0%,#f0f7ff 100%);border:1px solid #bae0fd;border-radius:8px;padding:8px 14px;font-size:11px;color:#0367a9;margin-left:12px;'
  },

  /**
   * 初始化渲染
   */
  init(configData) {
    this.data = configData || USER_CONFIG;

    // 数据验证
    var validation = DataValidator.validateAll(this.data);
    if (!validation.valid) {
      this.showError(validation.errors);
      return false;
    }

    // 执行计算
    YCASCalculator.computeAll(this.data);

    // 渲染6页
    this.renderAll();

    // 初始化图表
    ChartConfig.initRadarChart('radarChart', this.data.scores4D);

    return true;
  },

  /**
   * 显示错误
   */
  showError(errors) {
    var container = document.getElementById('error-container');
    if (container) {
      container.innerHTML = '<div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:20px 0;">' +
        '<div style="font-weight:600;color:#dc2626;margin-bottom:8px;">数据验证失败</div>' +
        '<ul style="margin:0;padding-left:20px;color:#7f1d1d;font-size:13px;">' +
        errors.map(function(e) { return '<li>' + e + '</li>'; }).join('') +
        '</ul></div>';
      container.style.display = 'block';
    }
  },

  /**
   * 渲染全部页面
   */
  renderAll() {
    this.renderCover();
    this.renderBasicInfo();
    this.render4DAssessment();
    this.renderPrediction();
    this.renderIntervention();
    this.renderConclusion();
  },

  /**
   * 第1页：封面
   */
  renderCover() {
    var d = this.data;
    var el = document.querySelector('[data-page="1"]');
    if (!el) return;

    el.innerHTML =
      '<div class="cover-logo"><img src="assets/logo.png" alt="益康顺Logo" style="width:100%;height:100%;object-fit:contain;border-radius:20px;"></div>' +
      '<div class="cover-title">儿童身高管理评估报告</div>' +
      '<div class="cover-subtitle">Y-CAS\u2122 多维度动态评估系统</div>' +
      '<div class="cover-divider"></div>' +
      '<div class="cover-info">' +
        '<div class="cover-info-row"><span class="cover-info-label">评估编号</span><span class="cover-info-value">' + (d.report.id || '') + '</span></div>' +
        '<div class="cover-info-row"><span class="cover-info-label">评估对象</span><span class="cover-info-value">' + (d.child.name || '') + '</span></div>' +
        '<div class="cover-info-row"><span class="cover-info-label">评估日期</span><span class="cover-info-value">' + (d.report.date || '') + '</span></div>' +
      '</div>' +
      '<div style="margin-top:40px;background:rgba(255,255,255,0.12);border-radius:12px;padding:20px 30px;border:1px solid rgba(255,255,255,0.2);">' +
        '<p style="font-size:13px;margin-bottom:8px;opacity:0.95;"><strong>西南儿童医院"医育结合"战略合作伙伴</strong></p>' +
        '<p style="font-size:11px;opacity:0.8;line-height:1.6;">本评估基于Y-CAS\u2122多维度动态评估系统，由益康顺与西南儿童医院联合开发，确保评估逻辑的科学性与严谨性。</p>' +
      '</div>' +
      '<div class="cover-footer">' + ((d.institution && d.institution.slogan) || '医育结合 · 4D科学 · 5S品质') + '</div>';
  },

  /**
   * 第2页：基础档案
   */
  renderBasicInfo() {
    var d = this.data;
    var m = d.measurements;
    var g = d.genetics;
    var el = document.querySelector('[data-page="2"]');
    if (!el) return;

    var percentileColor = m.heightLevel === 'normal' ? 'var(--success)' :
      (m.heightLevel === 'low' || m.heightLevel === 'high') ? 'var(--warning)' : 'var(--danger)';

    var boneAgeHtml = '';
    if (d.boneAge && d.boneAge.hasXRay) {
      boneAgeHtml =
        '<div class="section-title">骨龄信息</div>' +
        '<div class="info-card">' +
          '<div class="info-grid cols-3">' +
            '<div class="info-item"><span class="info-label">骨龄</span><span class="info-value">' + d.boneAge.age + '</span></div>' +
            '<div class="info-item"><span class="info-label">骨龄状态</span><span class="info-value">' +
              (d.boneAge.status === 'advanced' ? '超前' : d.boneAge.status === 'delayed' ? '落后' : '正常') +
            '</span></div>' +
            '<div class="info-item"><span class="info-label">骨骺闭合预估</span><span class="info-value">' + (d.boneAge.closureEstimate || '-') + '</span></div>' +
          '</div>' +
        '</div>';
    }

    el.innerHTML =
      '<div class="page-header">' +
        '<div class="header-icon"><i class="fas fa-child"></i></div>' +
        '<div class="header-title">基础健康档案</div>' +
        '<div class="header-sub">Basic Health Profile</div>' +
      '</div>' +

      '<div class="section-title">儿童信息</div>' +
      '<div class="info-card">' +
        '<div class="info-grid cols-4">' +
          '<div class="info-item"><span class="info-label">姓名</span><span class="info-value">' + d.child.name + '</span></div>' +
          '<div class="info-item"><span class="info-label">性别</span><span class="info-value">' + YCASUtils.genderText(d.child.gender) + '</span></div>' +
          '<div class="info-item"><span class="info-label">出生日期</span><span class="info-value">' + d.child.birthDate + '</span></div>' +
          '<div class="info-item"><span class="info-label">年龄</span><span class="info-value">' + (d.child.age || '') + '</span></div>' +
        '</div>' +
      '</div>' +

      '<div class="section-title">测量数据</div>' +
      '<div class="info-card highlight">' +
        '<div class="info-grid cols-4">' +
          '<div class="info-item"><span class="info-label">身高</span><span class="info-value">' + m.height + '<span class="info-unit">cm</span></span></div>' +
          '<div class="info-item"><span class="info-label">体重</span><span class="info-value">' + m.weight + '<span class="info-unit">kg</span></span></div>' +
          '<div class="info-item"><span class="info-label">BMI</span><span class="info-value">' + (m.bmi || '-') + ' <span class="info-unit">' + (m.bmiLabel || '') + '</span></span></div>' +
          '<div class="info-item"><span class="info-label">年增长速率</span><span class="info-value">' + (m.growthRate || '-') + '<span class="info-unit">cm/年</span></span></div>' +
        '</div>' +
        '<div style="margin-top:12px;">' +
          '<div class="info-grid cols-2">' +
            '<div class="info-item"><span class="info-label">身高百分位</span><span class="info-value" style="color:' + percentileColor + '">' + (m.heightPercentile || '-') + ' (' + (m.heightLabel || '') + ')</span></div>' +
            '<div class="info-item"><span class="info-label">测量日期</span><span class="info-value">' + (m.date || '') + '</span></div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="section-title">遗传背景</div>' +
      '<div class="info-card">' +
        '<div class="info-grid cols-4">' +
          '<div class="info-item"><span class="info-label">父亲身高</span><span class="info-value">' + g.fatherHeight + '<span class="info-unit">cm</span></span></div>' +
          '<div class="info-item"><span class="info-label">母亲身高</span><span class="info-value">' + g.motherHeight + '<span class="info-unit">cm</span></span></div>' +
          '<div class="info-item"><span class="info-label">遗传靶身高</span><span class="info-value" style="color:var(--primary);font-weight:700">' + g.targetHeight + '<span class="info-unit">cm</span></span></div>' +
          '<div class="info-item"><span class="info-label">靶身高范围</span><span class="info-value">' + g.targetHeightRange[0] + '-' + g.targetHeightRange[1] + '<span class="info-unit">cm</span></span></div>' +
        '</div>' +
      '</div>' +

      boneAgeHtml +

      '<div style="' + this.trustBadgeStyle.main + '">' +
        '<div style="' + this.trustBadgeStyle.title + '">📋 数据保障承诺</div>' +
        '<p>所有测量数据均采用<strong>医疗级标准</strong>采集，身高体重测量误差±0.1cm/0.1kg。遗传靶身高计算依据Tanner-Whitehouse改良公式，符合国际儿科内分泌学会共识。</p>' +
      '</div>' +

      '<div class="page-footer">' +
        '<span>' + ((d.institution && d.institution.name) || 'Y-CAS评估系统') + '</span>' +
        '<span>第 2 / 5 页</span>' +
      '</div>';
  },

  /**
   * 第3页：4D评估
   */
  render4DAssessment() {
    var d = this.data;
    var s = d.scores4D;
    var totalScore = d.totalScore || 0;
    var rating = d.rating || YCASCalculator.getRating(totalScore);
    var details = d.details4D || {};

    var d1r = YCASCalculator.getDimensionRating(s.d1_sleep);
    var d2r = YCASCalculator.getDimensionRating(s.d2_nutrition);
    var d3r = YCASCalculator.getDimensionRating(s.d3_sport);
    var d4r = YCASCalculator.getDimensionRating(s.d4_mood);

    var el = document.querySelector('[data-page="3"]');
    if (!el) return;

    el.innerHTML =
      '<div class="page-header">' +
        '<div class="header-icon"><i class="fas fa-chart-radar"></i></div>' +
        '<div class="header-title">4D多维度评估</div>' +
        '<div class="header-sub">4D Multi-Dimensional Assessment</div>' +
      '</div>' +

      '<div style="display:flex;align-items:center;justify-content:center;margin-bottom:16px;">' +
        '<div class="total-score-display">' +
          '<span class="total-score-number" style="color:' + rating.color + '">' + totalScore + '</span>' +
          '<span class="total-score-unit">分</span>' +
        '</div>' +
        '<div style="margin-left:20px;text-align:center;">' +
          '<div style="font-size:14px;color:var(--gray-400)">综合评级</div>' +
          '<div style="font-size:20px;font-weight:700;color:' + rating.color + ';margin-top:4px;">' + rating.label + '</div>' +
        '</div>' +
        '<span style="' + this.trustBadgeStyle.inline + '"><i class="fas fa-hospital"></i>评估依据：基于西南儿童医院临床生长发育学共识 | 由持证健康管理师执行评估</span>' +
      '</div>' +

      '<div class="score-cards">' +
        this._renderScoreCard('D1 深度睡眠', s.d1_sleep, d1r, 'd1', 'fa-moon') +
        this._renderScoreCard('D2 精准营养', s.d2_nutrition, d2r, 'd2', 'fa-utensils') +
        this._renderScoreCard('D3 纵向运动', s.d3_sport, d3r, 'd3', 'fa-running') +
        this._renderScoreCard('D4 情绪习惯', s.d4_mood, d4r, 'd4', 'fa-heart') +
      '</div>' +

      '<div class="chart-container"><canvas id="radarChart"></canvas></div>' +

      '<div style="' + this.trustBadgeStyle.main + '">' +
        '<div style="' + this.trustBadgeStyle.title + '">🔍 为什么评估这4个维度？</div>' +
        '<p>身高发育是睡眠、营养、运动、情绪多因素协同作用的结果。益康顺摒弃碎片化经验，依托与<strong>西南儿童医院</strong>的战略合作，将临床生长发育共识转化为家庭可执行的评估体系。</p>' +
      '</div>' +

      '<div style="margin-top:16px;">' +
        this._renderDetailSummary('D1 睡眠', details.d1) +
        this._renderDetailSummary('D2 营养', details.d2) +
        this._renderDetailSummary('D3 运动', details.d3) +
        this._renderDetailSummary('D4 情绪', details.d4) +
      '</div>' +

      '<div class="page-footer">' +
        '<span>' + ((d.institution && d.institution.name) || 'Y-CAS评估系统') + '</span>' +
        '<span>第 3 / 5 页</span>' +
      '</div>';
  },

  _renderScoreCard(name, score, rating, cls, icon) {
    return '<div class="score-card">' +
      '<div class="score-icon ' + cls + '"><i class="fas ' + icon + '"></i></div>' +
      '<div class="score-info">' +
        '<div class="score-name">' + name + '</div>' +
        '<div><span class="score-value" style="color:' + rating.color + '">' + score + '</span>' +
        '<span class="score-rating" style="color:' + rating.color + '">' + rating.label + '</span></div>' +
      '</div></div>';
  },

  _renderDetailSummary(label, detail) {
    if (!detail || !detail.summary) return '';
    return '<div style="font-size:12px;color:var(--gray-500);padding:3px 0;">' +
      '<strong>' + label + '：</strong>' + detail.summary + '</div>';
  },

  /**
   * 第4页：生长预测 + 干预方案
   */
  renderPrediction() {
    var d = this.data;
    var p = d.predictions || {};
    var m = d.measurements;
    var intv = d.interventions || {};
    var el = document.querySelector('[data-page="4"]');
    if (!el) return;

    // 预测身高条的百分比（以200cm为基准）
    var maxH = 200;
    var geneticPct = ((p.genetic || 0) / maxH * 100).toFixed(1);
    var currentPct = ((p.currentTrajectory || 0) / maxH * 100).toFixed(1);
    var optimizedPct = ((p.optimized4D || 0) / maxH * 100).toFixed(1);

    var percentileValue = 50;
    if (m.height && d._ageYears !== undefined && d.child) {
      percentileValue = Math.round(YCASCalculator.getHeightPercentileValue(m.height, d._ageYears, d.child.gender));
    }

    // 构建4D维度干预建议卡片（每行2个）
    var dimensions = [
      { key: 'd1', label: 'D1 深度睡眠', icon: 'fa-moon', color: '#0c9af0' },
      { key: 'd2', label: 'D2 精准营养', icon: 'fa-utensils', color: '#10b981' },
      { key: 'd3', label: 'D3 纵向运动', icon: 'fa-running', color: '#f59e0b' },
      { key: 'd4', label: 'D4 情绪习惯', icon: 'fa-heart', color: '#ef4444' }
    ];

    var interventionCards = dimensions.map(function(dim) {
      var item = intv[dim.key];
      if (!item) return '';
      var priorityColor = item.priority === 'urgent' ? '#ef4444' : item.priority === 'improve' ? '#f59e0b' : '#10b981';
      var priorityBg = item.priority === 'urgent' ? '#fef2f2' : item.priority === 'improve' ? '#fffbeb' : '#f0fdf4';
      return '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:10px;padding:12px;box-shadow:0 1px 3px rgba(0,0,0,0.05);">' +
        '<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;border-bottom:1px solid #f1f5f9;padding-bottom:8px;">' +
          '<div style="width:32px;height:32px;border-radius:8px;background:' + dim.color + ';display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;">' +
            '<i class="fas ' + dim.icon + '"></i></div>' +
          '<div style="flex:1;">' +
            '<div style="font-size:13px;font-weight:600;color:#1e293b;">' + dim.label + '</div>' +
            '<div style="font-size:11px;color:#64748b;">' + (item.problem || '') + '</div>' +
          '</div>' +
          '<span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;background:' + priorityBg + ';color:' + priorityColor + ';">' + YCASUtils.priorityText(item.priority) + '</span>' +
        '</div>' +
        '<div style="margin-bottom:8px;">' +
          '<div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">改善重点</div>' +
          '<div style="font-size:12px;color:#334155;line-height:1.5;">' + (item.focus || '') + '</div>' +
        '</div>' +
        '<div>' +
          '<div style="font-size:11px;color:#94a3b8;margin-bottom:4px;">具体措施</div>' +
          (item.actions ? '<ul style="margin:0;padding-left:14px;font-size:11px;color:#475569;line-height:1.6;">' +
            item.actions.slice(0, 3).map(function(a) { return '<li>' + a + '</li>'; }).join('') +
          '</ul>' : '<div style="font-size:11px;color:#94a3b8;">-</div>') +
        '</div>' +
        (item.duration ? '<div style="margin-top:8px;padding-top:8px;border-top:1px solid #f1f5f9;font-size:11px;color:#64748b;"><i class="far fa-clock" style="margin-right:4px;"></i>' + item.duration + '</div>' : '') +
      '</div>';
    }).join('');

    el.innerHTML =
      '<div class="page-header">' +
        '<div class="header-icon"><i class="fas fa-chart-line"></i></div>' +
        '<div class="header-title">生长潜力预测</div>' +
        '<div class="header-sub">Growth Potential Prediction</div>' +
      '</div>' +

      '<div style="display:flex;gap:12px;">' +
        '<div style="flex:1;">' +
          '<div class="section-title" style="margin-top:0;">当前生长状态</div>' +
          '<div class="info-card highlight" style="padding:12px;">' +
            '<div class="info-grid cols-3" style="gap:8px;">' +
              '<div class="info-item"><span class="info-label">当前身高</span><span class="info-value" style="font-size:18px;color:var(--primary)">' + m.height + '<span class="info-unit">cm</span></span></div>' +
              '<div class="info-item"><span class="info-label">同龄百分位</span><span class="info-value">' + (m.heightPercentile || '-') + '</span></div>' +
              '<div class="info-item"><span class="info-label">年增长速率</span><span class="info-value">' + (m.growthRate || '-') + '<span class="info-unit">cm/年</span></span></div>' +
            '</div>' +
            '<div style="margin-top:8px;">' +
              '<div style="font-size:11px;color:var(--gray-400);margin-bottom:4px;">身高在同龄人中的位置</div>' +
              '<div class="progress-bar-container">' +
                '<div class="progress-bar-fill" style="width:' + percentileValue + '%"></div>' +
              '</div>' +
              '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--gray-400)">' +
                '<span>P3 偏矮</span><span>P50 中等</span><span>P97 偏高</span>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="flex:1;">' +
          '<div class="section-title" style="margin-top:0;">成年身高预测</div>' +
          '<div class="info-card" style="padding:12px;">' +
            '<div class="prediction-bars">' +
              '<div class="prediction-item" style="margin-bottom:8px;">' +
                '<span class="pred-label" style="font-size:11px;">遗传靶身高</span>' +
                '<div class="pred-bar"><div class="pred-fill genetic" style="width:' + geneticPct + '%">' + (p.genetic || '-') + ' cm</div></div>' +
              '</div>' +
              '<div class="prediction-item" style="margin-bottom:8px;">' +
                '<span class="pred-label" style="font-size:11px;">当前趋势</span>' +
                '<div class="pred-bar"><div class="pred-fill current" style="width:' + currentPct + '%">' + (p.currentTrajectory || '-') + ' cm</div></div>' +
              '</div>' +
              '<div class="prediction-item" style="margin-bottom:0;">' +
                '<span class="pred-label" style="font-size:11px;">4D优化后</span>' +
                '<div class="pred-bar"><div class="pred-fill optimized" style="width:' + optimizedPct + '%">' + (p.optimized4D || '-') + ' cm</div></div>' +
              '</div>' +
            '</div>' +
            (p.improvement ? '<div style="text-align:center;margin-top:8px;padding:8px;background:var(--accent-light);border-radius:8px;">' +
              '<span style="font-size:12px;color:var(--accent);">预期可获得 <strong>' + p.improvement + ' cm</strong> 额外增长</span>' +
            '</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="section-title" style="margin-top:12px;margin-bottom:8px;">风险评估</div>' +
      '<div class="info-card" style="padding:12px;margin-bottom:12px;">' +
        this._renderRisks(d.risks) +
      '</div>' +

      '<div class="section-title" style="margin-top:12px;margin-bottom:8px;">个性化干预方案</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">' +
        interventionCards +
      '</div>' +

      '<div class="page-footer">' +
        '<span>' + ((d.institution && d.institution.name) || 'Y-CAS评估系统') + '</span>' +
        '<span>第 4 / 5 页</span>' +
      '</div>';
  },

  _renderRisks(risks) {
    if (!risks) return '';
    var items = [
      { key: 'growthDelay', label: '生长迟缓' },
      { key: 'earlyPuberty', label: '早发育' },
      { key: 'malnutrition', label: '营养不良' },
      { key: 'psychological', label: '心理健康' }
    ];

    return '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
      items.map(function(item) {
        var r = risks[item.key];
        if (!r) return '';
        return '<div style="display:flex;align-items:center;gap:10px;">' +
          '<span style="font-size:13px;color:var(--gray-600);width:70px;">' + item.label + '</span>' +
          '<span class="risk-badge ' + r.level + '">' + YCASUtils.riskText(r.level) + '</span>' +
          '<span style="font-size:12px;color:var(--gray-400)">' + r.description + '</span>' +
        '</div>';
      }).join('') +
    '</div>';
  },

  /**
   * 第5页：干预方案（内容已合并至第4页，此页保留用于打印分页控制）
   */
  renderIntervention() {
    var d = this.data;
    var el = document.querySelector('[data-page="5"]');
    if (!el) return;

    // 第5页内容已整合到第4页，此处仅渲染空白页用于打印分页
    // 或者可以渲染一个简洁的过渡页
    el.innerHTML = '';
    el.style.display = 'none';
  },

  /**
   * 第6页：报告结论
   */
  renderConclusion() {
    var d = this.data;
    var advisor = d.advisor || {};
    var rating = d.rating || {};
    var predictions = d.predictions || {};
    var el = document.querySelector('[data-page="6"]');
    if (!el) return;

    // 同步健康师寄语中的额外增长空间数值与预测数据保持一致
    var message = advisor.message || '';
    var improvement = predictions.improvement;
    if (improvement && message) {
      // 替换占位符 {{improvement}}
      message = message.replace(/\{\{improvement\}\}/g, improvement);
      // 替换各种格式的数值（如：4cm、4厘米、4 cm、4.5cm等）
      message = message.replace(/\d+(?:\.\d+)?\s*(?:cm|厘米)/g, improvement + 'cm');
    }

    // 生成行动清单
    var actionItems = [];
    var intv = d.interventions || {};
    var dims = ['d1', 'd2', 'd3', 'd4'];
    for (var i = 0; i < dims.length; i++) {
      var item = intv[dims[i]];
      if (item && item.priority === 'urgent') {
        actionItems.push('<strong>[紧急]</strong> ' + item.focus);
      }
    }
    for (var j = 0; j < dims.length; j++) {
      var item2 = intv[dims[j]];
      if (item2 && item2.priority === 'improve') {
        actionItems.push(item2.focus);
      }
    }
    if (d.followUp && d.followUp.nextDate) {
      actionItems.push('下次随访时间: ' + d.followUp.nextDate);
    }

    el.innerHTML =
      '<div class="page-header">' +
        '<div class="header-icon"><i class="fas fa-file-medical"></i></div>' +
        '<div class="header-title">评估报告结论</div>' +
        '<div class="header-sub">Assessment Conclusion</div>' +
      '</div>' +

      '<div class="conclusion-box">' +
        '<div style="text-align:center;margin-bottom:20px;">' +
          '<div style="font-size:14px;color:var(--gray-500);">综合评估等级</div>' +
          '<div style="font-size:48px;font-weight:800;color:' + rating.color + ';margin:8px 0;">' + (d.totalScore || 0) + '<span style="font-size:16px;color:var(--gray-400)">分</span></div>' +
          '<div style="display:inline-block;padding:4px 16px;border-radius:20px;font-size:14px;font-weight:600;color:white;background:' + rating.color + ';">' + (rating.label || '') + '</div>' +
        '</div>' +
      '</div>' +

      '<div class="section-title">近期行动清单</div>' +
      '<div class="info-card">' +
        '<ul class="action-list">' +
          actionItems.map(function(item) { return '<li>' + item + '</li>'; }).join('') +
        '</ul>' +
      '</div>' +

      '<div class="section-title">健康师寄语</div>' +
      '<div class="advisor-message">' +
        message +
      '</div>' +


      '<div style="background:linear-gradient(135deg,#f0f7ff 0%,#e0effe 100%);border-left:4px solid #0c9af0;border-radius:12px;padding:16px 20px;margin:20px 0 8px 0;">' +
        '<div style="font-weight:600;color:#0f172a;margin-bottom:12px;display:flex;align-items:center;gap:8px;font-size:13px;">🛡️ 益康顺5S全链严选承诺</div>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin-top:10px;">' +
          '<div style="font-size:11px;"><strong style="color:#0c9af0;">Safety安全底线：</strong>成分\'负面清单\'，剔除非必要添加剂</div>' +
          '<div style="font-size:11px;"><strong style="color:#0c9af0;">Source原料甄选：</strong>优选北欧/澳洲/新西兰核心产区</div>' +
          '<div style="font-size:11px;"><strong style="color:#0c9af0;">Science科学依据：</strong>核心成分必须有文献支持</div>' +
          '<div style="font-size:11px;"><strong style="color:#0c9af0;">Standard品质对标：</strong>优先合作GMP/ISO认证品牌</div>' +
          '<div style="font-size:11px;"><strong style="color:#0c9af0;">System动态反馈：</strong>每月随访，方案适时校准</div>' +
        '</div>' +
      '</div>' +
      '<div style="text-align:center;font-size:11px;color:#0367a9;margin-bottom:20px;">' +
        '西南儿童医院战略合作企业 | 专注家庭场景的儿童健康管理' +
      '</div>' +

      '<div class="page-footer">' +
        '<span>' + ((d.institution && d.institution.name) || 'Y-CAS评估系统') + '</span>' +
        '<span>第 5 / 5 页</span>' +
      '</div>';
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReportRenderer;
}
