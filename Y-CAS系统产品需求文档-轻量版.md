# Y-CAS儿童身高管理评估报告系统（轻量版）
## 产品功能开发文档（PRD）

---

**文档版本**：v1.0 - 轻量版  
**编写日期**：2025年2月11日  
**产品定位**：MVP最小可行产品，纯前端实现  
**目标用户**：健康师/评估人员（内部使用）  
**部署方式**：静态HTML文件，本地或OSS托管

---

## 目录

1. [轻量版定位与范围](#1-轻量版定位与范围)
2. [技术架构方案](#2-技术架构方案)
3. [功能模块设计](#3-功能模块设计)
4. [数据输入规范](#4-数据输入规范)
5. [报告模板结构](#5-报告模板结构)
6. [使用流程](#6-使用流程)
7. [文件清单与交付物](#7-文件清单与交付物)
8. [后续扩展规划](#8-后续扩展规划)

---

## 1. 轻量版定位与范围

### 1.1 版本定位

轻量版是Y-CAS系统的 **MVP（最小可行产品）**，核心目标是：
- ✅ 快速验证报告模板设计效果
- ✅ 支持健康师手动录入数据生成报告
- ✅ 实现高质量PDF导出功能
- ✅ 无需后端开发和数据库部署

### 1.2 功能范围

**包含功能（In Scope）**：
| 功能 | 说明 |
|------|------|
| 数据配置 | 通过修改JSON配置文件输入用户数据 |
| **单用户表单录入** | **在线表单填写单个用户资料** |
| **批量Excel导入** | **上传Excel文件批量导入用户数据** |
| 报告生成 | 自动生成完整6页评估报告 |
| 4D雷达图 | Chart.js动态渲染雷达图 |
| PDF导出 | html2pdf.js一键导出PDF |
| 批量PDF导出 | 支持多个用户报告批量生成下载 |
| 打印优化 | 支持浏览器直接打印 |

**排除功能（Out of Scope）**：
| 功能 | 排除原因 | 后续版本规划 |
|------|----------|--------------|
| 用户登录/注册 | 无后端支持 | V2版本增加 |
| 数据库持久化 | 纯前端实现，数据仅保存在内存 | V2版本增加 |
| ~~数据录入界面~~ | ~~已支持表单和Excel~~ | - |
| 多用户管理 | 无后端存储 | V2版本增加 |
| 随访管理 | 复杂度较高 | V3版本增加 |
| 数据可视化大屏 | 非核心需求 | V3版本增加 |

### 1.3 使用场景

```
场景1：单个用户 - 表单录入
    ↓
打开 report-generator.html 文件
    ↓
切换到"单用户录入"标签
    ↓
填写在线表单（基础信息 + 4D评估）
    ↓
实时预览报告
    ↓
点击"导出PDF"生成报告
    ↓
发送PDF给家长

场景2：单个用户 - 配置文件方式
    ↓
修改 data/config.js 中的用户数据
    ↓
刷新页面预览报告
    ↓
点击"导出PDF"生成报告文件

场景3：批量用户 - Excel导入
    ↓
下载Excel模板文件
    ↓
填写多个用户数据
    ↓
切换到"批量导入"标签
    ↓
上传Excel文件
    ↓
系统自动解析并生成报告列表
    ↓
选择导出方式（单个/打包下载）
    ↓
批量下载PDF报告
```

---

## 2. 技术架构方案

### 2.1 架构图

```
┌─────────────────────────────────────────────────────────┐
│                   轻量版纯前端架构                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              数据层 (Data Layer)                 │   │
│  │  ┌─────────────┐  ┌─────────────────────────┐  │   │
│  │  │ data/config.js│  │ assets/templates/       │  │   │
│  │  │ (用户数据配置)│  │ (报告模板片段)          │  │   │
│  │  └─────────────┘  └─────────────────────────┘  │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              逻辑层 (Logic Layer)                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────┐ │   │
│  │  │ js/calculator│  │ js/chart-config│  │ js/pdf  │ │   │
│  │  │ (评分计算)   │  │ (图表配置)    │  │ (导出)  │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
│                         │                               │
│                         ▼                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │              表现层 (View Layer)                 │   │
│  │         report-generator.html (单页应用)          │   │
│  │  ┌─────────────────────────────────────────┐     │   │
│  │  │  6页报告内容 (封面/档案/4D/预测/干预/结论) │     │   │
│  │  └─────────────────────────────────────────┘     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 技术栈

| 层级 | 技术 | 用途 | CDN链接 |
|------|------|------|---------|
| **样式** | Tailwind CSS | 原子化CSS样式 | jsDelivr CDN |
| **图表** | Chart.js 4.x | 4D雷达图渲染 | jsDelivr CDN |
| **图标** | Font Awesome 6 | 图标字体 | cdnjs |
| **字体** | Noto Sans SC | 中文字体 | Google Fonts |
| **PDF导出** | html2pdf.js | PDF生成 | jsDelivr CDN |
| **构建** | 无需构建工具 | 原生HTML/CSS/JS | - |

### 2.3 目录结构

```
ycas-report-lite/
├── index.html                    # 入口页面（数据配置向导）
├── report-generator.html         # 报告生成器主页面
├── report-template.html          # 报告模板（可单独使用）
├── data/
│   ├── config.js                 # 用户数据配置文件
│   └── sample-data.js            # 示例数据
├── js/
│   ├── calculator.js             # 4D评分计算逻辑
│   ├── chart-config.js           # 雷达图配置
│   ├── pdf-exporter.js           # PDF导出功能
│   └── utils.js                  # 工具函数
├── css/
│   ├── report-styles.css         # 报告专用样式
│   └── print-styles.css          # 打印优化样式
├── assets/
│   ├── logo.png                  # Logo图片
│   └── fonts/                    # 本地字体（可选）
└── README.md                     # 使用说明
```

---

## 3. 功能模块设计

### 3.1 数据输入模块

轻量版支持 **三种数据输入方式**：
1. **单用户表单录入** - 在线填写表单，支持4D维度原始数据录入
2. **批量Excel导入** - 上传Excel文件，支持批量导入4D维度原始数据
3. **配置文件编辑** - 直接修改JS文件（保留，用于高级用户）

---

#### 3.1.1 单用户表单录入

##### 界面设计

```
┌─────────────────────────────────────────────────────────┐
│  [单用户录入] [批量导入] [配置编辑]                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 基础信息                                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ 儿童姓名 *  │ │ 性别 *  ○男 ●女│ │ 出生日期 *  │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │
│  │ 当前身高 *  │ │ 当前体重 *  │ │ 测量日期    │       │
│  └─────────────┘ └─────────────┘ └─────────────┘       │
│                                                         │
│  👨‍👩‍👧 遗传背景                                            │
│  ┌─────────────┐ ┌─────────────┐                       │
│  │ 父亲身高 *  │ │ 母亲身高 *  │                       │
│  └─────────────┘ └─────────────┘                       │
│                                                         │
│  📊 4D维度详细评估                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🛌 D1 深度睡眠                                  │   │
│  ├─────────────┬─────────────┬─────────────┬────────┘   │
│  │ 入睡困难：  │ 夜间觉醒：  │ 早醒情况：  │ 日间精神： │
│  │ ●无 ○偶尔 ○经常 │ ●0次 ○1-2次 ○3+次 │ ●无 ○偶尔 ○经常 │ ●充沛 ○一般 ○疲倦 │
│  │ 入睡时间：  │ 起床时间：  │ 睡眠时长：  │          │
│  │ [21:30]     │ [07:00]     │ [9.5]小时    │          │
│  └─────────────┴─────────────┴─────────────┴───────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🥗 D2 精准营养                                  │   │
│  ├─────────────┬─────────────┬─────────────┬────────┘   │
│  │ 挑食偏食：  │ 进餐时间：  │ 零食饮料：  │ 早餐习惯： │
│  │ ●无 ○轻度 ○中度 ○重度 │ ●规律 ○不规律 │ ●很少 ○偶尔 ○经常 │ ●每天吃 ○偶尔不吃 ○经常不吃 │
│  │ 牛奶摄入：  │ 补钙补充：  │            │          │
│  │ [500]ml     │ ●是 ○否     │            │          │
│  └─────────────┴─────────────┴─────────────┴───────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🏃 D3 纵向运动                                  │   │
│  ├─────────────┬─────────────┬─────────────┬────────┘   │
│  │ 运动频率：  │ 纵向运动占比： │ 单次运动时长： │ 运动强度： │
│  │ ●<=2次 ○3-4次 ○>=5次 │ ●<40% ○40-60% ○>=60% │ ●<30分钟 ○30-45分钟 ○>=45分钟 │ ●轻度 ○中等 ○剧烈 │
│  │ 主要运动项目：                                    │   │
│  │ [跳绳, 跑步]                                       │   │
│  └─────────────┴─────────────┴─────────────┴───────────┘ │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 😊 D4 情绪与习惯                                 │   │
│  ├─────────────┬─────────────┬─────────────┬────────┘   │
│  │ 焦虑情绪：  │ 睡眠质量：  │ 食欲变化：  │ 社交意愿： │
│  │ ●无 ○偶尔 ○经常 │ ●好 ○一般 ○差 │ ●无变化 ○减少 ○增加 │ ●高 ○中 ○低 │
│  │ 家庭氛围：  │ 父母期望：  │ 学业压力：  │          │
│  │ ●和谐 ○紧张 ○冲突 │ ●合理 ○较高 ○过高 │ ●低 ○中 ○高 │          │
│  └─────────────┴─────────────┴─────────────┴───────────┘ │
│                                                         │
│  [加载示例数据] [生成并预览报告]                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

##### 表单字段清单

| 分组 | 字段 | 类型 | 必填 | 验证规则 |
|------|------|------|------|----------|
| **基础信息** | childName | text | ✓ | 2-20字符 |
| | gender | radio | ✓ | male/female |
| | birthDate | date | ✓ | 不晚于今天 |
| | height | number | ✓ | 40-250cm |
| | weight | number | ✓ | 1-150kg |
| | measureDate | date | - | 默认为今天 |
| **遗传背景** | fatherHeight | number | ✓ | 140-220cm |
| | motherHeight | number | ✓ | 130-200cm |
| **D1 深度睡眠** | d1_sleepDifficulty | radio | ✓ | none/occasional/often |
| | d1_nightWaking | radio | ✓ | 0/1-2/3+ |
| | d1_earlyWaking | radio | ✓ | none/occasional/often |
| | d1_dayEnergy | radio | ✓ | energetic/normal/tired |
| | d1_sleepTime | time | - | 默认为21:30 |
| | d1_wakeTime | time | - | 默认为07:00 |
| | d1_sleepDuration | number | - | 0.5-16小时 |
| **D2 精准营养** | d2_pickyEating | radio | ✓ | none/mild/moderate/severe |
| | d2_mealRegularity | radio | ✓ | regular/irregular |
| | d2_snackIntake | radio | ✓ | rarely/sometimes/often |
| | d2_breakfastHabit | radio | ✓ | daily/occasional/rarely |
| | d2_milkIntake | number | - | 0-2000ml |
| | d2_calciumSupplement | radio | - | true/false |
| **D3 纵向运动** | d3_exerciseFrequency | radio | ✓ | <=2/3-4/>=5 |
| | d3_verticalSportRatio | radio | ✓ | <40/40-60/>=60 |
| | d3_duration | radio | ✓ | <30/30-45/>=45 |
| | d3_intensity | radio | ✓ | light/moderate/vigorous |
| | d3_mainSports | text | - | 运动项目列表 |
| **D4 情绪与习惯** | d4_anxiety | radio | ✓ | none/occasional/frequent |
| | d4_sleepQuality | radio | ✓ | good/fair/poor |
| | d4_appetiteChange | radio | ✓ | none/decreased/increased |
| | d4_socialWillingness | radio | ✓ | high/medium/low |
| | d4_familyAtmosphere | radio | ✓ | harmonious/tense/conflict |
| | d4_parentExpectation | radio | ✓ | reasonable/high/excessive |
| | d4_academicPressure | radio | ✓ | low/medium/high |

##### 实现代码

```javascript
// js/form-handler.js
const FormHandler = {
  // 表单数据存储
  formData: {},
  
  // 初始化表单
  init() {
    this.bindEvents();
    this.loadDefaultValues();
  },
  
  // 绑定事件
  bindEvents() {
    // 实时验证
    document.querySelectorAll('input[data-validate]').forEach(input => {
      input.addEventListener('blur', (e) => this.validateField(e.target));
      input.addEventListener('input', (e) => this.updatePreview(e.target));
    });
    
    // 表单提交
    document.getElementById('report-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },
  
  // 验证单个字段
  validateField(field) {
    const rules = JSON.parse(field.dataset.validate || '{}');
    const value = field.value;
    let error = null;
    
    if (rules.required && !value) {
      error = '此字段必填';
    } else if (rules.min && value < rules.min) {
      error = `最小值为 ${rules.min}`;
    } else if (rules.max && value > rules.max) {
      error = `最大值为 ${rules.max}`;
    }
    
    // 显示错误
    const errorEl = field.parentElement.querySelector('.error-msg');
    if (errorEl) {
      errorEl.textContent = error || '';
      errorEl.style.display = error ? 'block' : 'none';
    }
    
    field.classList.toggle('error', !!error);
    return !error;
  },
  
  // 收集表单数据
  collectData() {
    const form = document.getElementById('report-form');
    const formData = new FormData(form);
    
    return {
      child: {
        name: formData.get('childName'),
        gender: formData.get('gender'),
        birthDate: formData.get('birthDate')
      },
      measurements: {
        height: parseFloat(formData.get('height')),
        weight: parseFloat(formData.get('weight')),
        date: formData.get('measureDate')
      },
      genetics: {
        fatherHeight: parseFloat(formData.get('fatherHeight')),
        motherHeight: parseFloat(formData.get('motherHeight'))
      },
      scores4D: {
        d1_sleep: parseInt(formData.get('d1Score')),
        d2_nutrition: parseInt(formData.get('d2Score')),
        d3_sport: parseInt(formData.get('d3Score')),
        d4_mood: parseInt(formData.get('d4Score'))
      }
    };
  },
  
  // 提交处理
  handleSubmit() {
    const isValid = this.validateAll();
    if (!isValid) {
      alert('请检查表单填写是否正确');
      return;
    }
    
    const data = this.collectData();
    
    // 合并到全局配置
    Object.assign(USER_CONFIG, data);
    
    // 触发报告渲染
    ReportRenderer.init();
    
    // 切换到预览标签
    TabSwitcher.switchTo('preview');
  }
};
```

---

#### 3.1.2 批量Excel导入

##### Excel模板结构

**Sheet: 用户数据 (users)**

| 列名 | 字段名 | 类型 | 必填 | 示例 |
|------|--------|------|------|------|
| A | 评估编号 | reportId | - | YCAS-2025-001 |
| B | 儿童姓名 | childName | ✓ | 张小萌 |
| C | 性别 | gender | ✓ | 女 |
| D | 出生日期 | birthDate | ✓ | 2016-03-15 |
| E | 身高(cm) | height | ✓ | 128.5 |
| F | 体重(kg) | weight | ✓ | 26.8 |
| G | 父亲身高 | fatherHeight | ✓ | 175 |
| H | 母亲身高 | motherHeight | ✓ | 162 |
| I | 评估日期 | reportDate | - | 2025-02-11 |
| J | D1-入睡困难 | d1_sleepDifficulty | ✓ | 无 |
| K | D1-夜间觉醒 | d1_nightWaking | ✓ | 0次 |
| L | D1-早醒情况 | d1_earlyWaking | ✓ | 无 |
| M | D1-日间精神 | d1_dayEnergy | ✓ | 充沛 |
| N | D2-挑食偏食 | d2_pickyEating | ✓ | 中度 |
| O | D2-进餐时间 | d2_mealRegularity | ✓ | 不规律 |
| P | D2-零食饮料 | d2_snackIntake | ✓ | 经常 |
| Q | D2-早餐习惯 | d2_breakfastHabit | ✓ | 偶尔不吃 |
| R | D2-牛奶摄入(ml) | d2_milkIntake | - | 500 |
| S | D3-运动频率 | d3_exerciseFrequency | ✓ | 3-4次/周 |
| T | D3-纵向运动占比 | d3_verticalSportRatio | ✓ | 40-60% |
| U | D3-单次运动时长 | d3_duration | ✓ | 30-45分钟 |
| V | D3-运动强度 | d3_intensity | ✓ | 中等 |
| W | D3-主要运动项目 | d3_mainSports | - | 跳绳, 跑步 |
| X | D4-焦虑情绪 | d4_anxiety | ✓ | 偶尔 |
| Y | D4-睡眠质量 | d4_sleepQuality | ✓ | 好 |
| Z | D4-食欲变化 | d4_appetiteChange | ✓ | 无变化 |
| AA | D4-社交意愿 | d4_socialWillingness | ✓ | 高 |
| AB | D4-家庭氛围 | d4_familyAtmosphere | ✓ | 和谐 |
| AC | D4-父母期望 | d4_parentExpectation | ✓ | 合理 |
| AD | D4-学业压力 | d4_academicPressure | ✓ | 低 |

##### 界面设计

```
┌─────────────────────────────────────────────────────────┐
│  [单用户录入] [批量导入] [配置编辑]                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📥 批量导入                                            │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  │     📄 点击或拖拽Excel文件到此处                 │   │
│  │                                                 │   │
│  │     支持 .xlsx, .xls 格式                        │   │
│  │     单次最多导入 50 条记录                       │   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📋 使用步骤：                                          │
│  1. 下载 Excel 模板文件                                 │
│  2. 按模板格式填写用户数据                              │
│  3. 上传填写好的Excel文件                               │
│  4. 预览并批量导出PDF                                   │
│                                                         │
│  [下载模板]                                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**上传后界面**：

```
┌─────────────────────────────────────────────────────────┐
│  ✅ 成功导入 15 条记录                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📋 数据预览                                            │
│  ┌────┬────────┬──────┬────────┬────────┬────────┐    │
│  │ 序号│ 姓名   │ 性别 │ 身高   │ 体重   │ 状态   │    │
│  ├────┼────────┼──────┼────────┼────────┼────────┤    │
│  │ 1  │ 张小萌 │ 女   │ 128.5  │ 26.8   │ ✓ 正常 │    │
│  │ 2  │ 王小明 │ 男   │ 135.0  │ 30.2   │ ✓ 正常 │    │
│  │ 3  │ 李小红 │ 女   │ 125.0  │ 24.5   │ ⚠ 警告 │    │
│  └────┴────────┴──────┴────────┴────────┴────────┘    │
│                                                         │
│  [全选] [导出选中PDF] [打包下载ZIP]                     │
│                                                         │
│  📊 导出进度: [████████░░░░░░░░░░] 50%                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

##### 技术实现

```javascript
// js/excel-handler.js
const ExcelHandler = {
  // 使用 SheetJS (xlsx.js) 库
  // CDN: https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js
  
  importedData: [],
  
  // 初始化
  init() {
    this.bindDragDrop();
    this.bindFileInput();
  },
  
  // 绑定拖拽上传
  bindDragDrop() {
    const dropZone = document.getElementById('drop-zone');
    
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFile(files[0]);
      }
    });
  },
  
  // 处理文件
  async handleFile(file) {
    // 验证文件类型
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!validTypes.includes(file.type)) {
      alert('请上传 Excel 文件 (.xlsx 或 .xls)');
      return;
    }
    
    // 验证文件大小 (最大 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过 5MB');
      return;
    }
    
    try {
      const data = await this.parseExcel(file);
      this.importedData = this.transformData(data);
      this.renderPreview();
    } catch (error) {
      console.error('Excel解析失败:', error);
      alert('Excel文件解析失败，请检查文件格式');
    }
  },
  
  // 解析Excel
  parseExcel(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // 读取第一个工作表
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          resolve(jsonData);
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  },
  
  // 转换数据格式
  transformData(rawData) {
    // 第一行是表头
    const headers = rawData[0];
    const rows = rawData.slice(1);
    
    // 表头映射
    const headerMap = {
      '评估编号': 'reportId',
      '儿童姓名': 'childName',
      '性别': 'gender',
      '出生日期': 'birthDate',
      '身高': 'height',
      '体重': 'weight',
      '父亲身高': 'fatherHeight',
      '母亲身高': 'motherHeight',
      'D1睡眠评分': 'd1Score',
      'D2营养评分': 'd2Score',
      'D3运动评分': 'd3Score',
      'D4情绪评分': 'd4Score',
      '评估日期': 'reportDate'
    };
    
    return rows.map((row, index) => {
      const item = { id: index + 1 };
      
      headers.forEach((header, i) => {
        const key = headerMap[header];
        if (key) {
          item[key] = row[i];
        }
      });
      
      // 转换为USER_CONFIG格式
      return this.convertToConfig(item);
    });
  },
  
  // 转换为配置格式
  convertToConfig(item) {
    return {
      report: {
        id: item.reportId || `YCAS-${Date.now()}-${item.id}`,
        date: item.reportDate || new Date().toISOString().split('T')[0]
      },
      child: {
        name: item.childName,
        gender: item.gender === '男' ? 'male' : 'female',
        birthDate: item.birthDate
      },
      measurements: {
        height: parseFloat(item.height),
        weight: parseFloat(item.weight)
      },
      genetics: {
        fatherHeight: parseFloat(item.fatherHeight),
        motherHeight: parseFloat(item.motherHeight)
      },
      scores4D: {
        d1_sleep: parseInt(item.d1Score),
        d2_nutrition: parseInt(item.d2Score),
        d3_sport: parseInt(item.d3Score),
        d4_mood: parseInt(item.d4Score)
      }
    };
  },
  
  // 批量导出PDF
  async batchExport(selectedIds) {
    const selected = this.importedData.filter(item => 
      selectedIds.includes(item.id)
    );
    
    const zip = new JSZip();
    const folder = zip.folder('Y-CAS报告');
    
    for (let i = 0; i < selected.length; i++) {
      const config = selected[i];
      
      // 更新进度
      this.updateProgress((i + 1) / selected.length * 100);
      
      // 渲染报告
      Object.assign(USER_CONFIG, config);
      ReportRenderer.init();
      
      // 生成PDF
      const pdfBlob = await this.generatePDFBlob();
      
      // 添加到ZIP
      folder.file(`${config.child.name}-评估报告.pdf`, pdfBlob);
      
      // 延迟，避免浏览器卡顿
      await new Promise(r => setTimeout(r, 500);
    }
    
    // 下载ZIP
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    this.downloadFile(zipBlob, `Y-CAS批量报告-${new Date().toISOString().split('T')[0]}.zip`);
  },
  
  // 生成PDF Blob
  async generatePDFBlob() {
    const element = document.getElementById('report-container');
    
    const opt = {
      margin: 0,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    return await html2pdf().set(opt).from(element).output('blob');
  }
};
```

##### Excel模板下载

```javascript
// 生成并下载Excel模板
function downloadTemplate() {
  const template = [
    ['评估编号', '儿童姓名', '性别', '出生日期', '身高(cm)', '体重(kg)',
     '父亲身高', '母亲身高', '评估日期',
     // D1 深度睡眠
     'D1-入睡困难', 'D1-夜间觉醒', 'D1-早醒情况', 'D1-日间精神',
     // D2 精准营养
     'D2-挑食偏食', 'D2-进餐时间', 'D2-零食饮料', 'D2-早餐习惯', 'D2-牛奶摄入(ml)',
     // D3 纵向运动
     'D3-运动频率', 'D3-纵向运动占比', 'D3-单次运动时长', 'D3-运动强度', 'D3-主要运动项目',
     // D4 情绪与习惯
     'D4-焦虑情绪', 'D4-睡眠质量', 'D4-食欲变化', 'D4-社交意愿', 'D4-家庭氛围', 'D4-父母期望', 'D4-学业压力'],
    ['YCAS-2025-001', '张小萌', '女', '2016-03-15', 128.5, 26.8,
     175, 162, '2025-02-11',
     '无', '0次', '无', '充沛',
     '中度', '不规律', '经常', '偶尔不吃', 500,
     '3-4次/周', '40-60%', '30-45分钟', '中等', '跳绳, 跑步',
     '偶尔', '好', '无变化', '高', '和谐', '合理', '低'],
    ['YCAS-2025-002', '王小明', '男', '2015-08-20', 135.0, 30.2,
     178, 165, '2025-02-11',
     '偶尔', '1-2次', '偶尔', '一般',
     '轻度', '规律', '偶尔', '每天吃', 600,
     '>=5次/周', '>=60%', '>=45分钟', '剧烈', '篮球, 摸高',
     '无', '好', '无变化', '高', '和谐', '合理', '中']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '用户数据');
  
  // 设置列宽
  ws['!cols'] = [
    { wch: 16 }, { wch: 10 }, { wch: 6 }, { wch: 12 },
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
    // D1
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 },
    // D2
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
    // D3
    { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 15 },
    // D4
    { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 10 }
  ];
  
  XLSX.writeFile(wb, 'Y-CAS数据导入模板.xlsx');
}
```

---

#### 3.1.3 配置文件结构（保留）

对于高级用户或自动化场景，仍支持直接编辑配置文件：

```javascript
// data/config.js
const USER_CONFIG = {
  // 报告信息
  report: {
    id: 'YCAS-2025-001',
    date: '2025-02-11',
    generatedAt: '2025-02-11 14:30:00'
  },
  
  // 儿童基本信息
  child: {
    name: '张小萌',
    gender: 'female', // male / female
    birthDate: '2016-03-15',
    age: '8岁11个月', // 自动计算或手动填写
    avatar: null // 可选
  },
  
  // 测量数据
  measurements: {
    date: '2025-02-11',
    height: 128.5, // cm
    weight: 26.8,  // kg
    heightPercentile: 'P50', // P3/P10/P25/P50/P75/P90/P97
    bmi: 16.2,
    bmiStatus: 'normal', // underweight / normal / overweight
    growthRate: 5.5 // cm/year
  },
  
  // 遗传背景
  genetics: {
    fatherHeight: 175,
    motherHeight: 162,
    targetHeight: 162.0, // 自动计算
    targetHeightRange: [157, 167]
  },
  
  // 骨龄数据（可选）
  boneAge: {
    hasXRay: true,
    age: '9岁2个月',
    ageDiff: 3, // 月，正数超前
    status: 'advanced', // normal / advanced / delayed
    closureEstimate: '14-15岁'
  },
  
  // 4D维度评分（0-100）
  scores4D: {
    d1_sleep: 85,
    d2_nutrition: 68,
    d3_sport: 72,
    d4_mood: 78
  },
  
  // 4D详细评估数据
  details4D: {
    d1: {
      sleepDifficulty: 'none', // none / occasional / often
      nightWaking: '0', // 0 / 1-2 / 3+
      earlyWaking: 'none',
      dayEnergy: 'energetic'
    },
    d2: {
      pickyEating: 'moderate', // none / mild / moderate / severe
      mealRegularity: 'irregular',
      snackIntake: 'often',
      breakfastHabit: 'occasional'
    },
    d3: {
      exerciseFrequency: '3-4', // <=2 / 3-4 / >=5
      verticalSportRatio: 40, // %
      duration: 30, // minutes
      intensity: 'moderate'
    },
    d4: {
      anxiety: 'occasional',
      sleepQuality: 'good',
      appetiteChange: 'none',
      socialWillingness: 'high',
      familyAtmosphere: 'harmonious',
      parentExpectation: 'reasonable'
    }
  },
  
  // 风险评估
  risks: {
    growthDelay: { level: 'low', description: '年增长速率正常' },
    earlyPuberty: { level: 'low', description: '骨龄正常' },
    malnutrition: { level: 'medium', description: '挑食偏食较严重' },
    psychological: { level: 'low', description: '情绪稳定' }
  },
  
  // 身高预测
  predictions: {
    genetic: 162,
    currentTrajectory: 160,
    optimized4D: 166,
    improvement: 4
  },
  
  // 干预建议
  interventions: {
    d1: { problem: '睡眠质量良好', focus: '保持规律作息', duration: '1个月' },
    d2: { problem: '挑食偏食较严重', focus: '营养搭配指导', duration: '3个月' },
    d3: { problem: '运动量不足', focus: '增加纵向运动', duration: '2个月' },
    d4: { problem: '偶发焦虑情绪', focus: '心理疏导', duration: '1个月' }
  },
  
  // 健康师信息
  advisor: {
    name: '李医生',
    title: '高级儿童健康管理师',
    phone: '138-0000-0000',
    message: '小萌目前的生长发育状况整体良好...'
  },
  
  // 机构信息
  institution: {
    name: '益康顺儿童健康管理',
    slogan: '医育结合 · 4D科学 · 5S品质',
    logo: 'assets/logo.png'
  }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
  module.exports = USER_CONFIG;
}
```

#### 3.1.2 数据验证

```javascript
// js/validator.js
const DataValidator = {
  // 验证必填字段
  validateRequired(data) {
    const required = [
      'child.name',
      'child.gender', 
      'child.birthDate',
      'measurements.height',
      'measurements.weight',
      'genetics.fatherHeight',
      'genetics.motherHeight'
    ];
    
    const missing = [];
    required.forEach(path => {
      if (!this.getValueByPath(data, path)) {
        missing.push(path);
      }
    });
    
    return {
      valid: missing.length === 0,
      missing
    };
  },
  
  // 验证数值范围
  validateRanges(data) {
    const ranges = [
      { path: 'measurements.height', min: 40, max: 250 },
      { path: 'measurements.weight', min: 1, max: 150 },
      { path: 'genetics.fatherHeight', min: 140, max: 220 },
      { path: 'genetics.motherHeight', min: 130, max: 200 }
    ];
    
    const errors = [];
    ranges.forEach(({ path, min, max }) => {
      const value = this.getValueByPath(data, path);
      if (value && (value < min || value > max)) {
        errors.push(`${path} 应在 ${min}-${max} 之间`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  },
  
  // 辅助方法：根据路径获取值
  getValueByPath(obj, path) {
    return path.split('.').reduce((o, p) => o && o[p], obj);
  }
};
```

### 3.2 评分计算模块

#### 3.2.1 身高百分位计算规则

**标准说明**：
根据《中华儿科杂志》2009年发布的《中国0~18岁儿童青少年身高、体重百分位数值表》，身高百分位采用 **7个标准百分位点**：
- **P3** - 偏矮（低于正常范围）
- **P10** - 正常偏矮
- **P25** - 正常
- **P50** - 中等
- **P75** - 正常偏高
- **P90** - 偏高
- **P97** - 偏高（高于正常范围）

**判定标准**：
| 百分位 | 等级 | 颜色标识 | 医学建议 |
|--------|------|----------|----------|
| < P3 | 偏矮（异常） | 🔴 红色 | 建议就医检查 |
| P3 - P10 | 正常偏矮 | 🟡 黄色 | 加强监测 |
| P10 - P25 | 正常 | 🟢 绿色 | 定期随访 |
| P25 - P75 | 中等 | 🟢 绿色 | 正常范围 |
| P75 - P90 | 正常偏高 | 🟢 绿色 | 定期随访 |
| P90 - P97 | 偏高 | 🟡 黄色 | 加强监测 |
| > P97 | 偏高（异常） | 🔴 红色 | 建议就医检查 |

**查询方式**：
1. 根据儿童性别选择对应表格（男/女）
2. 根据年龄找到对应行
3. 比较身高与表格中的7个百分位值
4. 确定所属的百分位等级

**示例**：
- 女童，8岁，身高128.5cm
- 查表：8岁女童P50=128.5cm
- 结果：P50（中等）

#### 3.2.2 自动计算逻辑

```javascript
// js/calculator.js
const YCASCalculator = {
  // 计算BMI
  calculateBMI(weight, height) {
    const heightM = height / 100;
    return (weight / (heightM * heightM)).toFixed(1);
  },
  
  // 计算遗传靶身高
  calculateGeneticHeight(fatherHeight, motherHeight, gender) {
    let target;
    if (gender === 'male') {
      target = (fatherHeight + motherHeight + 13) / 2;
    } else {
      target = (fatherHeight + motherHeight - 13) / 2;
    }
    return {
      target: target.toFixed(1),
      range: [(target - 5).toFixed(1), (target + 5).toFixed(1)]
    };
  },
  
  // 查询身高百分位（根据标准表格）
  getHeightPercentile(height, age, gender) {
    // 标准百分位数据（简化版，实际应使用完整表格）
    const percentileData = {
      male: {
        // 8岁男童标准值
        8: { P3: 119.9, P10: 123.1, P25: 126.3, P50: 130.0, P75: 133.7, P90: 137.1, P97: 140.4 }
        // ... 其他年龄段
      },
      female: {
        // 8岁女童标准值
        8: { P3: 118.5, P10: 121.6, P25: 124.9, P50: 128.5, P75: 132.1, P90: 135.4, P97: 138.7 }
        // ... 其他年龄段
      }
    };
    
    const data = percentileData[gender][age];
    if (!data) return null;
    
    // 比较确定百分位
    if (height < data.P3) return { percentile: '<P3', level: 'abnormal_low', label: '偏矮（异常）' };
    if (height < data.P10) return { percentile: 'P3', level: 'low', label: '正常偏矮' };
    if (height < data.P25) return { percentile: 'P10', level: 'normal', label: '正常' };
    if (height < data.P50) return { percentile: 'P25', level: 'normal', label: '正常' };
    if (height < data.P75) return { percentile: 'P50', level: 'normal', label: '中等' };
    if (height < data.P90) return { percentile: 'P75', level: 'normal', label: '正常' };
    if (height < data.P97) return { percentile: 'P90', level: 'high', label: '偏高' };
    return { percentile: 'P97', level: 'abnormal_high', label: '偏高（异常）' };
  },
  
  // 计算综合得分
  calculateTotalScore(scores4D) {
    const { d1_sleep, d2_nutrition, d3_sport, d4_mood } = scores4D;
    return ((d1_sleep + d2_nutrition + d3_sport + d4_mood) / 4).toFixed(1);
  },
  
  // 获取评级
  getRating(score) {
    if (score >= 90) return { level: 'excellent', label: '优秀', color: '#10b981' };
    if (score >= 80) return { level: 'good', label: '良好', color: '#0c9af0' };
    if (score >= 60) return { level: 'average', label: '一般', color: '#f59e0b' };
    return { level: 'poor', label: '较差', color: '#ef4444' };
  },
  
  // 计算4D优化预测身高
  calculateOptimizedHeight(currentPrediction, scores4D) {
    // 简化的预测模型
    const avgScore = (scores4D.d1_sleep + scores4D.d2_nutrition + 
                      scores4D.d3_sport + scores4D.d4_mood) / 4;
    const potential = Math.max(0, (85 - avgScore) / 85 * 6); // 最大提升6cm
    return {
      height: Math.round(currentPrediction + potential),
      improvement: Math.round(potential)
    };
  }
};
```

### 3.3 报告渲染模块

#### 3.3.1 页面结构

```html
<!-- report-generator.html -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Y-CAS评估报告生成器</title>
  <!-- CDN资源 -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- 本地资源 -->
  <link rel="stylesheet" href="css/report-styles.css">
  <link rel="stylesheet" href="css/print-styles.css">
</head>
<body>
  <!-- 工具栏 -->
  <div id="toolbar" class="fixed top-0 left-0 right-0 bg-white shadow-md z-50 p-4 no-print">
    <div class="max-w-6xl mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <h1 class="text-xl font-bold text-gray-800">Y-CAS报告生成器</h1>
        <span id="config-status" class="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700">
          配置已加载
        </span>
      </div>
      <div class="flex space-x-3">
        <button onclick="previewReport()" class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
          <i class="fas fa-eye mr-2"></i>预览
        </button>
        <button onclick="exportPDF()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          <i class="fas fa-file-pdf mr-2"></i>导出PDF
        </button>
        <button onclick="window.print()" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
          <i class="fas fa-print mr-2"></i>打印
        </button>
      </div>
    </div>
  </div>

  <!-- 报告内容容器 -->
  <div id="report-container" class="mt-20">
    <!-- 第1页：封面 -->
    <div class="page cover-page" data-page="1">
      <!-- 动态填充内容 -->
    </div>
    
    <!-- 第2页：基础档案 -->
    <div class="page content-page" data-page="2">
      <!-- 动态填充内容 -->
    </div>
    
    <!-- 第3页：4D评估 -->
    <div class="page content-page" data-page="3">
      <div class="chart-container">
        <canvas id="radarChart"></canvas>
      </div>
    </div>
    
    <!-- 第4页：生长预测 -->
    <div class="page content-page" data-page="4">
      <!-- 动态填充内容 -->
    </div>
    
    <!-- 第5页：干预方案 -->
    <div class="page content-page" data-page="5">
      <!-- 动态填充内容 -->
    </div>
    
    <!-- 第6页：结论 -->
    <div class="page content-page" data-page="6">
      <!-- 动态填充内容 -->
    </div>
  </div>

  <!-- 脚本 -->
  <script src="data/config.js"></script>
  <script src="js/calculator.js"></script>
  <script src="js/chart-config.js"></script>
  <script src="js/pdf-exporter.js"></script>
  <script src="js/renderer.js"></script>
</body>
</html>
```

#### 3.3.2 渲染逻辑

```javascript
// js/renderer.js
const ReportRenderer = {
  data: null,
  
  init() {
    // 加载配置
    this.data = USER_CONFIG;
    
    // 数据验证
    const validation = this.validateData();
    if (!validation.valid) {
      this.showError(validation.errors);
      return;
    }
    
    // 执行计算
    this.calculateData();
    
    // 渲染报告
    this.renderAll();
    
    // 初始化图表
    this.initCharts();
  },
  
  validateData() {
    // 调用验证器
    return DataValidator.validateRequired(this.data);
  },
  
  calculateData() {
    // 自动计算派生数据
    const { measurements, genetics, child, scores4D } = this.data;
    
    // 计算BMI
    measurements.bmi = YCASCalculator.calculateBMI(
      measurements.weight, 
      measurements.height
    );
    
    // 计算遗传靶身高
    const geneticResult = YCASCalculator.calculateGeneticHeight(
      genetics.fatherHeight,
      genetics.motherHeight,
      child.gender
    );
    genetics.targetHeight = geneticResult.target;
    genetics.targetHeightRange = geneticResult.range;
    
    // 计算综合得分
    this.data.totalScore = YCASCalculator.calculateTotalScore(scores4D);
    
    // 计算评级
    this.data.rating = YCASCalculator.getRating(this.data.totalScore);
    
    // 计算身高百分位（如果未手动设置）
    if (!measurements.heightPercentile) {
      const percentileResult = YCASCalculator.getHeightPercentile(
        measurements.height,
        this.getAgeInYears(child.birthDate),
        child.gender
      );
      if (percentileResult) {
        measurements.heightPercentile = percentileResult.percentile;
        measurements.heightLevel = percentileResult.level;
        measurements.heightLabel = percentileResult.label;
      }
    }
  },
  
  // 辅助方法：计算年龄
  getAgeInYears(birthDate) {
    const birth = new Date(birthDate);
    const now = new Date();
    return now.getFullYear() - birth.getFullYear();
  },
  
  renderAll() {
    this.renderCover();
    this.renderBasicInfo();
    this.render4DAssessment();
    this.renderPrediction();
    this.renderIntervention();
    this.renderConclusion();
  },
  
  renderCover() {
    const cover = document.querySelector('.cover-page');
    cover.innerHTML = `
      <div class="cover-content">
        <div class="logo">益</div>
        <h1 class="title">儿童身高管理评估报告</h1>
        <p class="subtitle">Y-CAS™ 多维度动态评估系统</p>
        <div class="info-box">
          <div class="info-row">
            <span>评估编号</span>
            <span>${this.data.report.id}</span>
          </div>
          <div class="info-row">
            <span>评估日期</span>
            <span>${this.data.report.date}</span>
          </div>
        </div>
      </div>
    `;
  },
  
  initCharts() {
    const ctx = document.getElementById('radarChart').getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['D1 深度睡眠', 'D2 精准营养', 'D3 纵向运动', 'D4 情绪与习惯'],
        datasets: [{
          label: '当前得分',
          data: [
            this.data.scores4D.d1_sleep,
            this.data.scores4D.d2_nutrition,
            this.data.scores4D.d3_sport,
            this.data.scores4D.d4_mood
          ],
          backgroundColor: 'rgba(12, 154, 240, 0.2)',
          borderColor: 'rgba(12, 154, 240, 1)',
          borderWidth: 2
        }, {
          label: '目标得分',
          data: [90, 85, 85, 85],
          backgroundColor: 'rgba(20, 184, 166, 0.1)',
          borderColor: 'rgba(20, 184, 166, 0.6)',
          borderWidth: 2,
          borderDash: [5, 5]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            min: 0,
            ticks: { stepSize: 20 }
          }
        }
      }
    });
  }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  ReportRenderer.init();
});
```

### 3.4 PDF导出模块

```javascript
// js/pdf-exporter.js
const PDFExporter = {
  // 导出配置
  config: {
    margin: 0,
    filename: 'Y-CAS儿童身高管理评估报告.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      logging: false
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    },
    pagebreak: { 
      mode: ['avoid-all', 'css', 'legacy'] 
    }
  },
  
  // 导出PDF
  async export() {
    const element = document.getElementById('report-container');
    const btn = document.querySelector('button[onclick="exportPDF()"]');
    
    // 显示加载状态
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>生成中...';
    btn.disabled = true;
    
    try {
      // 隐藏工具栏
      document.getElementById('toolbar').style.display = 'none';
      
      // 生成PDF
      await html2pdf()
        .set(this.config)
        .from(element)
        .save();
      
      // 恢复工具栏
      document.getElementById('toolbar').style.display = 'block';
      
      // 恢复按钮
      btn.innerHTML = originalText;
      btn.disabled = false;
      
    } catch (error) {
      console.error('PDF导出失败:', error);
      alert('PDF导出失败，请重试');
      
      document.getElementById('toolbar').style.display = 'block';
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  },
  
  // 生成文件名
  generateFilename(childName, reportId) {
    const date = new Date().toISOString().split('T')[0];
    return `Y-CAS报告-${childName}-${date}.pdf`;
  }
};

// 全局导出函数
function exportPDF() {
  PDFExporter.export();
}
```

---

## 4. 数据输入规范

### 4.1 数据收集流程说明

#### 4.1.1 4D维度数据收集流程

```
1. 准备评估资料
   ↓
2. 选择数据输入方式
   ├── 在线交互式表单系统
   │   ├── 填写基础信息
   │   ├── 填写4D维度详细评估
   │   ├── 实时预览报告
   │   └── 导出PDF
   └── Excel文件导入
       ├── 下载Excel模板
       ├── 按模板填写批量数据
       ├── 上传Excel文件
       ├── 预览数据列表
       └── 批量导出PDF
   ↓
3. 生成评估报告
   ↓
4. 发送报告给家长
   ↓
5. 建立随访计划
```

#### 4.1.2 单用户表单录入流程（推荐）

```
收到用户资料（微信/邮件/电话）
    ↓
打开 report-generator.html
    ↓
选择"单用户录入"标签
    ↓
填写基础信息（姓名、性别、出生日期、身高、体重）
    ↓
填写遗传背景（父亲身高、母亲身高）
    ↓
填写4D维度详细评估：
    ├── D1 深度睡眠（入睡困难、夜间觉醒、早醒情况、日间精神）
    ├── D2 精准营养（挑食偏食、进餐时间、零食饮料、早餐习惯）
    ├── D3 纵向运动（运动频率、纵向运动占比、单次运动时长、运动强度）
    └── D4 情绪与习惯（焦虑情绪、睡眠质量、食欲变化、社交意愿、家庭氛围）
    ↓
点击"生成并预览报告"
    ↓
检查报告内容是否正确
    ↓
点击"导出PDF"生成报告
    ↓
发送给家长
```

#### 4.1.3 批量Excel导入流程（推荐用于3人以上）

```
收到多个用户资料
    ↓
打开 report-generator.html
    ↓
选择"批量导入"标签
    ↓
点击"下载Excel模板"
    ↓
按模板格式填写多个用户数据
    ├── 基础信息
    ├── 遗传背景
    ├── 4D维度详细评估
    └── 评估日期
    ↓
保存Excel文件
    ↓
点击或拖拽Excel文件到上传区域
    ↓
系统自动解析并预览数据列表
    ↓
检查数据是否正确
    ↓
选择导出方式：
    ├── 导出选中PDF
    └── 打包下载ZIP
    ↓
批量生成报告
    ↓
分别发送给家长
```

#### 4.1.4 配置文件编辑流程（高级用户）

```
收到用户资料
    ↓
整理关键信息到 Excel/表格
    ↓
将数据填入 data/config.js
    ├── 基础信息
    ├── 遗传背景
    ├── 4D维度详细评估数据
    └── 其他配置项
    ↓
保存配置文件
    ↓
打开 report-generator.html 预览
    ↓
检查报告内容是否正确
    ↓
导出PDF
    ↓
发送给家长
```

### 4.2 数据字段说明

| 字段分类 | 字段名 | 类型 | 示例 | 必填 |
|----------|--------|------|------|------|
| 报告信息 | report.id | string | "YCAS-2025-001" | ✓ |
| | report.date | string | "2025-02-11" | ✓ |
| 儿童信息 | child.name | string | "张小萌" | ✓ |
| | child.gender | enum | "female" | ✓ |
| | child.birthDate | string | "2016-03-15" | ✓ |
| 测量数据 | measurements.height | number | 128.5 | ✓ |
| | measurements.weight | number | 26.8 | ✓ |
| | measurements.heightPercentile | string | 'P50' | P3/P10/P25/P50/P75/P90/P97 |
| 遗传背景 | genetics.fatherHeight | number | 175 | ✓ |
| | genetics.motherHeight | number | 162 | ✓ |
| **D1 深度睡眠** | details4D.d1.sleepDifficulty | enum | "none" | ✓ |
| | details4D.d1.nightWaking | enum | "0" | ✓ |
| | details4D.d1.earlyWaking | enum | "none" | ✓ |
| | details4D.d1.dayEnergy | enum | "energetic" | ✓ |
| | details4D.d1.sleepTime | string | "21:30" | - |
| | details4D.d1.wakeTime | string | "07:00" | - |
| | details4D.d1.sleepDuration | number | 9.5 | - |
| **D2 精准营养** | details4D.d2.pickyEating | enum | "moderate" | ✓ |
| | details4D.d2.mealRegularity | enum | "irregular" | ✓ |
| | details4D.d2.snackIntake | enum | "often" | ✓ |
| | details4D.d2.breakfastHabit | enum | "occasional" | ✓ |
| | details4D.d2.milkIntake | number | 500 | - |
| | details4D.d2.calciumSupplement | boolean | false | - |
| **D3 纵向运动** | details4D.d3.exerciseFrequency | enum | "3-4" | ✓ |
| | details4D.d3.verticalSportRatio | enum | "40-60" | ✓ |
| | details4D.d3.duration | enum | "30-45" | ✓ |
| | details4D.d3.intensity | enum | "moderate" | ✓ |
| | details4D.d3.mainSports | array | ["跳绳", "跑步"] | - |
| **D4 情绪与习惯** | details4D.d4.anxiety | enum | "occasional" | ✓ |
| | details4D.d4.sleepQuality | enum | "good" | ✓ |
| | details4D.d4.appetiteChange | enum | "none" | ✓ |
| | details4D.d4.socialWillingness | enum | "high" | ✓ |
| | details4D.d4.familyAtmosphere | enum | "harmonious" | ✓ |
| | details4D.d4.parentExpectation | enum | "reasonable" | ✓ |
| | details4D.d4.academicPressure | enum | "low" | ✓ |
| **4D评分** | scores4D.d1_sleep | number | 85 | ✓ |
| | scores4D.d2_nutrition | number | 68 | ✓ |
| | scores4D.d3_sport | number | 72 | ✓ |
| | scores4D.d4_mood | number | 78 | ✓ |

### 4.3 快速配置模板

```javascript
// 快速配置 - 复制此模板并修改值
const QUICK_CONFIG = {
  // 只需修改以下值
  childName: '【儿童姓名】',
  gender: 'female', // 或 'male'
  birthDate: '【YYYY-MM-DD】',
  height: 0, // cm
  weight: 0, // kg
  fatherHeight: 0, // cm
  motherHeight: 0, // cm
  
  // D1 深度睡眠
  d1_sleepDifficulty: 'none', // none/occasional/often
  d1_nightWaking: '0', // 0/1-2/3+
  d1_earlyWaking: 'none', // none/occasional/often
  d1_dayEnergy: 'energetic', // energetic/normal/tired
  
  // D2 精准营养
  d2_pickyEating: 'moderate', // none/mild/moderate/severe
  d2_mealRegularity: 'irregular', // regular/irregular
  d2_snackIntake: 'often', // rarely/sometimes/often
  d2_breakfastHabit: 'occasional', // daily/occasional/rarely
  
  // D3 纵向运动
  d3_exerciseFrequency: '3-4', // <=2/3-4/>=5
  d3_verticalSportRatio: '40-60', // <40/40-60/>=60
  d3_duration: '30-45', // <30/30-45/>=45
  d3_intensity: 'moderate', // light/moderate/vigorous
  
  // D4 情绪与习惯
  d4_anxiety: 'occasional', // none/occasional/frequent
  d4_sleepQuality: 'good', // good/fair/poor
  d4_appetiteChange: 'none', // none/decreased/increased
  d4_socialWillingness: 'high', // high/medium/low
  d4_familyAtmosphere: 'harmonious', // harmonious/tense/conflict
  d4_parentExpectation: 'reasonable', // reasonable/high/excessive
  d4_academicPressure: 'low', // low/medium/high
  
  // 可选修改
  reportDate: new Date().toISOString().split('T')[0],
  advisorName: '李医生'
};
```

---

## 5. 报告模板结构

### 5.1 页面内容清单

| 页码 | 页面名称 | 主要内容 | 动态数据 |
|------|----------|----------|----------|
| 1 | 封面 | Logo、标题、评估编号、日期 | report.id, report.date |
| 2 | 基础档案 | 儿童信息、测量数据、遗传背景、骨龄 | child, measurements, genetics, boneAge |
| 3 | 4D评估 | 4D得分卡片、雷达图、详细分析 | scores4D, details4D |
| 4 | 生长预测 | 当前状态、身高预测、进度条 | predictions, measurements |
| 5 | 干预方案 | 4D干预建议表、随访计划 | interventions |
| 6 | 报告结论 | 综合评估、行动清单、健康师寄语 | risks, advisor, totalScore |

### 5.2 样式规范

```css
/* css/report-styles.css */

/* A4页面设置 */
.page {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto 20px;
  background: white;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  position: relative;
  overflow: hidden;
  padding: 50px 45px;
}

/* 封面页特殊样式 */
.cover-page {
  background: linear-gradient(135deg, #0c486e 0%, #0367a9 50%, #0d9488 100%);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* 内容页样式 */
.content-page {
  padding: 50px 45px;
}

/* 打印优化 */
@media print {
  .page {
    box-shadow: none;
    margin: 0;
    page-break-after: always;
  }
  .no-print {
    display: none !important;
  }
}
```

---

## 6. 使用流程

### 6.1 首次使用

```bash
# 1. 克隆/下载项目
# 2. 进入项目目录
cd ycas-report-lite

# 3. 修改数据配置
# 用文本编辑器打开 data/config.js，填入实际数据

# 4. 打开报告生成器
# 直接用浏览器打开 report-generator.html
open report-generator.html

# 5. 点击"导出PDF"按钮生成报告
```

### 6.2 批量生成报告

#### 方式一：使用Excel导入功能（推荐）

```
1. 准备Excel文件（按模板格式填写多个用户）
2. 在浏览器中打开 report-generator.html
3. 切换到"批量导入"标签
4. 上传Excel文件
5. 预览数据列表，确认无误
6. 点击"打包下载ZIP"
7. 等待生成完成，自动下载包含所有PDF的ZIP文件
```

#### 方式二：使用Node.js脚本（高级用户）

```javascript
// 批量生成脚本示例（Node.js）
const fs = require('fs');
const puppeteer = require('puppeteer');

const users = [
  { name: '张小萌', gender: 'female', /* ... */ },
  { name: '王小明', gender: 'male', /* ... */ },
  // ...
];

async function generateReports() {
  const browser = await puppeteer.launch();
  
  for (const user of users) {
    // 修改配置文件
    fs.writeFileSync('data/config.js', generateConfig(user));
    
    // 生成PDF
    const page = await browser.newPage();
    await page.goto('file://' + __dirname + '/report-generator.html');
    await page.pdf({
      path: `reports/${user.name}-报告.pdf`,
      format: 'A4'
    });
  }
  
  await browser.close();
}
```

#### 方式三：使用JSZip纯前端批量导出

```javascript
// 已在 js/excel-handler.js 中实现
// 支持选择多条记录，打包成ZIP下载
```

---

## 7. 文件清单与交付物

### 7.1 项目文件结构

```
ycas-report-lite/
├── 📄 index.html                    # 入口页面
├── 📄 report-generator.html         # 报告生成器（主程序）
├── 📄 report-template.html          # 独立报告模板
├── 📁 data/
│   ├── 📄 config.js                 # 用户数据配置
│   └── 📄 sample-data.js            # 示例数据
├── 📁 js/
│   ├── 📄 calculator.js             # 评分计算
│   ├── 📄 chart-config.js           # 图表配置
│   ├── 📄 pdf-exporter.js           # PDF导出
│   ├── 📄 renderer.js               # 渲染引擎
│   └── 📄 validator.js              # 数据验证
├── 📁 css/
│   ├── 📄 report-styles.css         # 报告样式
│   └── 📄 print-styles.css          # 打印样式
├── 📁 assets/
│   └── 🖼️ logo.png                  # Logo图片
└── 📄 README.md                     # 使用说明
```

### 7.2 交付物清单

| 序号 | 交付物 | 说明 | 优先级 |
|------|--------|------|--------|
| 1 | report-generator.html | 报告生成器主程序（含表单+Excel导入） | P0 |
| 2 | data/config.js | 数据配置文件 | P0 |
| 3 | js/calculator.js | 评分计算逻辑 | P0 |
| 4 | js/pdf-exporter.js | PDF导出功能 | P0 |
| 5 | js/form-handler.js | 表单处理逻辑 | P0 |
| 6 | js/excel-handler.js | Excel导入处理 | P0 |
| 7 | css/report-styles.css | 报告样式 | P0 |
| 8 | css/form-styles.css | 表单样式 | P1 |
| 9 | README.md | 使用文档 | P1 |
| 10 | sample-data.js | 示例数据 | P1 |
| 11 | Y-CAS数据导入模板.xlsx | Excel模板文件 | P1 |
| 12 | index.html | 入口页面 | P2 |

---

## 8. 后续扩展规划

### 8.1 V2版本规划（带简单后端）

**新增功能**：
- 用户登录/注册
- 数据持久化（数据库）
- Web表单数据录入界面
- 报告历史管理
- 基础权限控制

**技术栈**：
- 前端：Vue 3 + Element Plus
- 后端：Node.js + Express + SQLite
- 部署：Vercel / 阿里云ECS

### 8.2 V3版本规划（完整SaaS）

**新增功能**：
- 多租户机构管理
- 完整的随访管理
- 小程序端
- 数据可视化大屏
- AI智能建议

**技术栈**：
- 前端：Vue 3 + NestJS
- 后端：微服务架构
- 数据库：MySQL + Redis
- 部署：Kubernetes

### 8.3 轻量版 → 完整版 迁移路径

```
轻量版 (纯前端)
    ↓
添加 Node.js 后端 + SQLite
    ↓
V2版本 (单应用)
    ↓
数据库迁移到 MySQL
    ↓
微服务拆分
    ↓
V3版本 (SaaS平台)
```

---

## 附录

### A. 常见问题

**Q1: 如何修改报告样式？**
> 编辑 `css/report-styles.css` 文件，修改对应的CSS类。

**Q2: 图表显示不正常怎么办？**
> 检查 `scores4D` 中的分数是否在 0-100 范围内。

**Q3: PDF导出不完整？**
> 可能是内容过多导致分页问题，调整 `pagebreak` 配置或精简内容。

**Q4: 如何添加机构Logo？**
> 替换 `assets/logo.png` 文件，保持相同文件名。

**Q5: Excel导入失败怎么办？**
> 1. 检查文件格式是否为 .xlsx 或 .xls
> 2. 确认表头与模板一致
> 3. 检查必填字段是否填写完整
> 4. 查看浏览器控制台错误信息

**Q6: 批量导出时浏览器卡顿？**
> 1. 建议单次导入不超过 50 条记录
> 2. 关闭其他占用内存的浏览器标签
> 3. 分批导出，每次 10-20 条

**Q7: 表单数据如何保存？**
> 轻量版数据仅保存在浏览器内存中，刷新页面会丢失。
> 如需保存，请导出PDF或复制配置到 config.js 文件。

**Q8: 支持哪些浏览器？**
> 推荐使用 Chrome 90+、Edge 90+、Firefox 88+。
> Safari 14+ 支持但PDF导出可能有问题。

### B. 浏览器兼容性

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | 90+ | ✅ 完全支持 |
| Edge | 90+ | ✅ 完全支持 |
| Firefox | 88+ | ✅ 完全支持 |
| Safari | 14+ | ⚠️ PDF导出可能有问题 |

### C. 性能建议

- 单份报告生成时间：约 3-5 秒
- 建议单次批量生成不超过 50 份
- 大图片建议压缩后再放入 assets 目录

---

**文档维护记录**：

| 版本 | 日期 | 修改人 | 修改内容 |
|------|------|--------|----------|
| v1.0 | 2025-02-11 | - | 轻量版初始文档 |
| v1.1 | 2025-02-11 | - | 新增单用户表单录入和批量Excel导入功能 |

---

*文档结束*
