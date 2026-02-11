/**
 * Y-CAS 报告渲染引擎 - 6页报告动态生成
 */
const ReportRenderer = {
  data: null,

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
      '<div class="cover-logo">益</div>' +
      '<div class="cover-title">儿童身高管理评估报告</div>' +
      '<div class="cover-subtitle">Y-CAS\u2122 多维度动态评估系统</div>' +
      '<div class="cover-divider"></div>' +
      '<div class="cover-info">' +
        '<div class="cover-info-row"><span class="cover-info-label">评估编号</span><span class="cover-info-value">' + (d.report.id || '') + '</span></div>' +
        '<div class="cover-info-row"><span class="cover-info-label">评估对象</span><span class="cover-info-value">' + (d.child.name || '') + '</span></div>' +
        '<div class="cover-info-row"><span class="cover-info-label">评估日期</span><span class="cover-info-value">' + (d.report.date || '') + '</span></div>' +
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

      '<div class="page-footer">' +
        '<span>' + ((d.institution && d.institution.name) || 'Y-CAS评估系统') + '</span>' +
        '<span>第 2 / 6 页</span>' +
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
      '</div>' +

      '<div class="score-cards">' +
        this._renderScoreCard('D1 深度睡眠', s.d1_sleep, d1r, 'd1', 'fa-moon') +
        this._renderScoreCard('D2 精准营养', s.d2_nutrition, d2r, 'd2', 'fa-utensils') +
        this._renderScoreCard('D3 纵向运动', s.d3_sport, d3r, 'd3', 'fa-running') +
        this._renderScoreCard('D4 情绪习惯', s.d4_mood, d4r, 'd4', 'fa-heart') +
      '</div>' +

      '<div class="chart-container"><canvas id="radarChart"></canvas></div>' +

      '<div style="margin-top:16px;">' +
        this._renderDetailSummary('D1 睡眠', details.d1) +
        this._renderDetailSummary('D2 营养', details.d2) +
        this._renderDetailSummary('D3 运动', details.d3) +
        this._renderDetailSummary('D4 情绪', details.d4) +
      '</div>' +

      '<div class="page-footer">' +
        '<span>' + ((d.institution && d.institution.name) || 'Y-CAS评估系统') + '</span>' +
        '<span>第 3 / 6 页</span>' +
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
   * 第4页：生长预测
   */
  renderPrediction() {
    var d = this.data;
    var p = d.predictions || {};
    var m = d.measurements;
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

    el.innerHTML =
      '<div class="page-header">' +
        '<div class="header-icon"><i class="fas fa-chart-line"></i></div>' +
        '<div class="header-title">生长潜力预测</div>' +
        '<div class="header-sub">Growth Potential Prediction</div>' +
      '</div>' +

      '<div class="section-title">当前生长状态</div>' +
      '<div class="info-card highlight">' +
        '<div class="info-grid cols-3">' +
          '<div class="info-item"><span class="info-label">当前身高</span><span class="info-value" style="font-size:24px;color:var(--primary)">' + m.height + '<span class="info-unit">cm</span></span></div>' +
          '<div class="info-item"><span class="info-label">同龄百分位</span><span class="info-value">' + (m.heightPercentile || '-') + '</span></div>' +
          '<div class="info-item"><span class="info-label">年增长速率</span><span class="info-value">' + (m.growthRate || '-') + '<span class="info-unit">cm/年</span></span></div>' +
        '</div>' +
        '<div style="margin-top:12px;">' +
          '<div style="font-size:12px;color:var(--gray-400);margin-bottom:4px;">身高在同龄人中的位置</div>' +
          '<div class="progress-bar-container">' +
            '<div class="progress-bar-fill" style="width:' + percentileValue + '%"></div>' +
          '</div>' +
          '<div style="display:flex;justify-content:space-between;font-size:10px;color:var(--gray-400)">' +
            '<span>P3 偏矮</span><span>P50 中等</span><span>P97 偏高</span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="section-title">成年身高预测</div>' +
      '<div class="info-card">' +
        '<div class="prediction-bars">' +
          '<div class="prediction-item">' +
            '<span class="pred-label">遗传靶身高</span>' +
            '<div class="pred-bar"><div class="pred-fill genetic" style="width:' + geneticPct + '%">' + (p.genetic || '-') + ' cm</div></div>' +
          '</div>' +
          '<div class="prediction-item">' +
            '<span class="pred-label">当前趋势</span>' +
            '<div class="pred-bar"><div class="pred-fill current" style="width:' + currentPct + '%">' + (p.currentTrajectory || '-') + ' cm</div></div>' +
          '</div>' +
          '<div class="prediction-item">' +
            '<span class="pred-label">4D优化后</span>' +
            '<div class="pred-bar"><div class="pred-fill optimized" style="width:' + optimizedPct + '%">' + (p.optimized4D || '-') + ' cm</div></div>' +
          '</div>' +
        '</div>' +
        (p.improvement ? '<div style="text-align:center;margin-top:12px;padding:10px;background:var(--accent-light);border-radius:8px;">' +
          '<span style="font-size:13px;color:var(--accent);">通过4D优化管理，预期可获得 <strong style="font-size:18px;">' + p.improvement + ' cm</strong> 的额外增长空间</span>' +
        '</div>' : '') +
      '</div>' +

      '<div class="section-title">风险评估</div>' +
      '<div class="info-card">' +
        this._renderRisks(d.risks) +
      '</div>' +

      '<div class="page-footer">' +
        '<span>' + ((d.institution && d.institution.name) || 'Y-CAS评估系统') + '</span>' +
        '<span>第 4 / 6 页</span>' +
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
   * 第5页：干预方案
   */
  renderIntervention() {
    var d = this.data;
    var intv = d.interventions || {};
    var el = document.querySelector('[data-page="5"]');
    if (!el) return;

    var dimensions = [
      { key: 'd1', label: 'D1 深度睡眠', icon: 'fa-moon' },
      { key: 'd2', label: 'D2 精准营养', icon: 'fa-utensils' },
      { key: 'd3', label: 'D3 纵向运动', icon: 'fa-running' },
      { key: 'd4', label: 'D4 情绪习惯', icon: 'fa-heart' }
    ];

    var tableRows = dimensions.map(function(dim) {
      var item = intv[dim.key];
      if (!item) return '';
      return '<tr>' +
        '<td><strong>' + dim.label + '</strong></td>' +
        '<td>' + (item.problem || '') + '</td>' +
        '<td>' + (item.focus || '') + '</td>' +
        '<td>' +
          (item.actions ? '<ul style="margin:0;padding-left:16px;font-size:12px;">' +
            item.actions.map(function(a) { return '<li>' + a + '</li>'; }).join('') +
          '</ul>' : '') +
        '</td>' +
        '<td>' + (item.duration || '') + '</td>' +
        '<td><span class="priority-tag ' + (item.priority || '') + '">' + YCASUtils.priorityText(item.priority) + '</span></td>' +
      '</tr>';
    }).join('');

    var followUpHtml = '';
    if (d.followUp) {
      followUpHtml =
        '<div class="section-title">随访计划</div>' +
        '<div class="info-card accent">' +
          '<div class="info-grid cols-2">' +
            '<div class="info-item"><span class="info-label">下次随访日期</span><span class="info-value">' + (d.followUp.nextDate || '') + '</span></div>' +
            '<div class="info-item"><span class="info-label">随访频率</span><span class="info-value">' + (d.followUp.frequency || '') + '</span></div>' +
          '</div>' +
          (d.followUp.items ? '<div style="margin-top:12px;"><ul class="action-list">' +
            d.followUp.items.map(function(item) { return '<li>' + item + '</li>'; }).join('') +
          '</ul></div>' : '') +
        '</div>';
    }

    el.innerHTML =
      '<div class="page-header">' +
        '<div class="header-icon"><i class="fas fa-clipboard-list"></i></div>' +
        '<div class="header-title">个性化干预方案</div>' +
        '<div class="header-sub">Personalized Intervention Plan</div>' +
      '</div>' +

      '<div class="section-title">4D维度干预建议</div>' +
      '<table class="intervention-table">' +
        '<thead><tr>' +
          '<th>维度</th><th>现状问题</th><th>改善重点</th><th>具体措施</th><th>周期</th><th>优先级</th>' +
        '</tr></thead>' +
        '<tbody>' + tableRows + '</tbody>' +
      '</table>' +

      followUpHtml +

      '<div class="page-footer">' +
        '<span>' + ((d.institution && d.institution.name) || 'Y-CAS评估系统') + '</span>' +
        '<span>第 5 / 6 页</span>' +
      '</div>';
  },

  /**
   * 第6页：报告结论
   */
  renderConclusion() {
    var d = this.data;
    var advisor = d.advisor || {};
    var rating = d.rating || {};
    var el = document.querySelector('[data-page="6"]');
    if (!el) return;

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
        (advisor.message || '') +
      '</div>' +
      '<div class="advisor-sign">' +
        '<span>' + (advisor.title || '') + '</span>' +
        '<span class="sign-name">' + (advisor.name || '') + '</span>' +
      '</div>' +

      (advisor.phone ? '<div style="margin-top:20px;text-align:center;font-size:13px;color:var(--gray-400);">' +
        '<i class="fas fa-phone" style="margin-right:6px;"></i>咨询热线: ' + advisor.phone +
      '</div>' : '') +

      '<div class="page-footer">' +
        '<span>' + ((d.institution && d.institution.name) || 'Y-CAS评估系统') + '</span>' +
        '<span>第 6 / 6 页</span>' +
      '</div>';
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ReportRenderer;
}
