# Jiamu Skills

<div align="center">

**A curated collection of Claude Code skills for daily productivity workflows**

甲木常用的 Claude Code Skills 集合 - 专注于提升销售、内容创作和日常工作效率

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Skills-blue)](https://claude.ai/code)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/isjiamu/jiamu-skills/pulls)

[English](#english) | [中文](#中文)

</div>

---

## 中文

### 📦 技能列表

| 技能 | 类别 | 描述 | 场景 |
|-----|------|------|------|
| [**sales-ai-assistant**](./sales-ai-assistant/) | 🎯 销售赋能 | 销售AI助手 - 将业务场景转化为AI提示词，自动生成销售内容 | 25个销售场景：邮件、方案、分析、竞品对比等 |
| [**magazine-layout**](./magazine-layout/) | 🎨 内容设计 | 杂志排版工具 - 将文本转换为精美的杂志风格HTML页面 | 12种视觉风格，支持PDF导出 |
| [**peers-advisory-group**](./peers-advisory-group/) | 💡 决策咨询 | 私董会专家助手 - 通过4位顶级商业领袖的视角分析问题 | 商业决策、战略规划、问题诊断 |
| [**video-downloader**](./video-downloader/) | 📹 工具类 | 通用视频下载器 - 支持1000+网站的视频下载 | YouTube、Bilibili、Twitter、TikTok等 |
| [**gif-splitter**](./gif-splitter/) | 🖼️ 工具类 | GIF动图切分器 - 将超限GIF智能拆分成多个小文件 | 微信公众号上传、帧数限制、批量处理 |

### 🌟 核心特色

#### 🎯 Sales AI Assistant - 销售AI助手

**一句话描述**：不会写Prompt？没关系，描述场景就能生成专业销售内容。

**核心价值**：
- ✅ **场景识别**：智能匹配25个销售场景（陌生开发、演示跟进、客户计划、竞品分析等）
- ✅ **信息收集**：自动提取关键信息，一次性收集缺失内容
- ✅ **双重输出**：生成可直接使用的内容 + 优化提示词（供学习）
- ✅ **快捷调整**：支持"更正式"、"简短点"、"加数据"等快捷指令

**使用示例**：
```
用户：我要给腾讯CTO发封邮件介绍我们的AI产品
↓
Skill：识别场景 → 收集信息 → 生成邮件 + 提示词
```

**支持场景**：
- 对外联络（5个）：陌生开发邮件、演示后续、续约方案、活动摘要、管道汇报
- 销售策略（5个）：客户计划、区域规划、账户优先级、评分模型、市场进入
- 竞争情报（5个）：对战卡、竞品分析、单页文件、异议反驳、客户证明
- 数据分析（5个）：转化率、业绩排名、交易速度、营销归因、性能对比
- 视觉素材（5个）：销售漏斗、人物角色、区域地图、庆祝图形等

---

#### 🎨 Magazine Layout - 杂志排版工具

**一句话描述**：把文字内容秒变高颜值杂志页面。

**核心价值**：
- 📱 12种精选视觉风格（经典、现代、科技、自然等）
- 🎯 Tailwind CSS响应式设计，完美适配各种设备
- 📄 支持多引擎PDF导出（WeasyPrint、wkhtmltopdf、Playwright）
- 🎨 自动排版：标题、引言、正文、图片布局

**适用场景**：
- 文章发布、报告制作、营销材料、个人博客

---

#### 💡 Peers Advisory Group - 私董会专家助手

**一句话描述**：4位商业大师（巴菲特、盖茨、马斯克、乔布斯）组团帮你分析问题。

**核心价值**：
- 👥 多角度分析：投资、技术、创新、产品四大视角
- 🔄 深度提问：每位顾问3轮提问，层层深入问题本质
- 📊 结构化输出：问题诊断 → 多维分析 → 可执行建议
- 📝 可选生成杂志风格HTML报告

**适用场景**：
- 重大商业决策、战略规划、创业方向选择、职业发展

---

#### 📹 Video Downloader - 通用视频下载器

**一句话描述**：一个skill下载全网视频。

**核心价值**：
- 🌍 支持1000+网站（YouTube、Bilibili、Twitter/X、TikTok、Vimeo等）
- 🎬 多种质量选择（360p到4K）
- 🎵 音频提取（MP3格式）
- 📝 字幕下载
- 🔄 WebM自动转MP4

---

#### 🖼️ GIF Splitter - GIF动图切分器

**一句话描述**：解决微信公众号"帧数超过300帧"上传限制。

**核心价值**：
- ✂️ **智能切分**：自动检测帧数，均匀拆分成多个文件
- 📊 **信息查看**：支持查看GIF帧数、大小、尺寸等信息
- 📁 **批量处理**：支持整个文件夹批量切分
- ⚙️ **灵活配置**：可自定义最大帧数、输出目录

**适用场景**：
- 微信公众号上传GIF提示"帧数超过300帧"
- 需要将长GIF拆分成多个短GIF
- 批量处理多个超限GIF文件

---

### 📥 安装方式

#### 方式1：通过Claude Code插件市场（推荐）

```bash
claude plugin marketplace add isjiamu/jiamu-skills
```

#### 方式2：手动安装

```bash
# 克隆到Claude Code skills目录
git clone https://github.com/isjiamu/jiamu-skills.git ~/.claude/skills/jiamu-skills

# 或者创建符号链接
ln -s /path/to/jiamu-skills/sales-ai-assistant ~/.claude/skills/sales-ai-assistant
ln -s /path/to/jiamu-skills/magazine-layout ~/.claude/skills/magazine-layout
# ... 其他skills
```

#### 方式3：从.skill文件安装

每个skill都提供了打包的.skill文件（zip格式），可以直接解压到skills目录。

---

### 🚀 使用方法

#### Sales AI Assistant

**触发方式**：
- 直接描述需求：`"我要给客户发封邮件"`
- 或调用：`/sales-ai-assistant`

**示例对话**：
```
用户：我要分析一下我们销售团队的成交率

Skill：
✅ 识别场景：分析管道转化率
📋 需要提供：销售流程数据（CSV或文本）

[用户提供数据]

Skill：
📊 生成分析报告：
- 各阶段转化率表格
- 流失点识别
- 改进建议

💡 使用的提示词：
[完整提示词展示]
```

---

#### Magazine Layout

**触发方式**：
- `"把这篇文章做成杂志风格"`
- `"杂志排版"`、`"magazine layout"`

**示例**：
```
用户：把我的博客文章做成现代风格的杂志页面

Skill：
🎨 选择风格 → 🖼️ 生成HTML → 📄 可选导出PDF
```

---

#### Peers Advisory Group

**触发方式**：
- `"开始私董会"`、`"peers advisory"`

**示例**：
```
用户：我在考虑是否要转型做SaaS产品

Skill：
第1轮 - 巴菲特：关于市场和财务的3个问题
第2轮 - 盖茨：关于技术和团队的3个问题
第3轮 - 马斯克：关于创新和执行的3个问题
第4轮 - 乔布斯：关于产品和用户的3个问题

[收集所有回答]

最终报告：
- 问题诊断
- 多维度分析
- 决策建议
```

---

#### Video Downloader

**触发方式**：
- 直接发送视频链接
- `"下载这个视频"`、`"download video"`

**示例**：
```
用户：https://www.youtube.com/watch?v=xxxxx

Skill：
🎬 检测视频信息 → 📊 显示可用格式 → 💾 下载视频
```

---

#### GIF Splitter

**触发方式**：
- `"GIF帧数超限"`、`"切分GIF"`、`"gif splitter"`

**示例**：
```
用户：我的GIF上传微信公众号提示帧数超过300帧

Skill：
📊 检测帧数 → ✂️ 智能切分 → 💾 保存文件

输出：
  ✓ 动画_第1部分.gif: 247 帧, 2.11 MB
  ✓ 动画_第2部分.gif: 247 帧, 1.89 MB
```

---

### 📁 项目结构

```
jiamu-skills/
├── sales-ai-assistant/          # 销售AI助手
│   ├── SKILL.md                 # 核心指令
│   ├── README.md                # 详细文档
│   ├── references/              # 25个场景模板
│   │   ├── outreach.md          # 对外联络（5个）
│   │   ├── strategy.md          # 销售策略（5个）
│   │   ├── competitive.md       # 竞争情报（5个）
│   │   ├── analytics.md         # 数据分析（5个）
│   │   └── visuals.md           # 视觉素材（5个）
│   └── assets/
│       └── scenario-keywords.json  # 场景匹配配置
├── magazine-layout/             # 杂志排版工具
│   ├── SKILL.md
│   ├── references/
│   │   └── styles.md            # 12种风格模板
│   └── scripts/
│       └── html_to_pdf.py       # PDF转换脚本
├── peers-advisory-group/        # 私董会助手
│   ├── SKILL.md
│   └── references/
│       ├── default-advisors.md
│       ├── feedback-template.md
│       ├── reflect-template.md
│       └── report-template.md
├── video-downloader/            # 视频下载器
│   ├── SKILL.md
│   ├── scripts/
│   │   └── download.py          # 下载脚本
│   └── references/
│       └── platform-tips.md
├── gif-splitter/                # GIF动图切分器
│   ├── SKILL.md                 # 核心指令
│   └── scripts/
│       └── split_gif.py         # 切分脚本
├── LICENSE
└── README.md
```

---

### 🤝 贡献指南

欢迎提交Issue和Pull Request！

**贡献新Skill**：
1. Fork本仓库
2. 创建新的skill目录
3. 确保包含：`SKILL.md`（核心指令）、`README.md`（使用说明）
4. 提交PR并说明skill的用途和使用场景

---

### 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE)

---

### 👤 作者

**jiamu** ([@isjiamu](https://github.com/isjiamu))

专注于AI工具和生产力提升的实践者

---

### 🔗 相关链接

- [Claude Code 官网](https://claude.ai/code)
- [Claude Code Skills 文档](https://docs.anthropic.com/claude-code)
- [我的其他项目](https://github.com/isjiamu?tab=repositories)

---

### 📊 版本历史

- **v1.4.0** (2026-01-26) - 新增 gif-splitter（GIF动图切分器）
- **v1.3.0** (2026-01-23) - 新增 sales-ai-assistant（25个销售场景）
- **v1.2.0** - 新增 video-downloader
- **v1.1.0** - 新增 magazine-layout 和 peers-advisory-group
- **v1.0.0** - 初始版本

---

<div align="center">

**⭐ 如果这些skills对你有帮助，请给个Star支持！⭐**

Made with ❤️ by jiamu

</div>

---

## English

### 📦 Skills Overview

| Skill | Category | Description | Use Cases |
|-------|----------|-------------|-----------|
| [**sales-ai-assistant**](./sales-ai-assistant/) | 🎯 Sales Enablement | Transform business scenarios into AI prompts and auto-generate sales content | 25 scenarios: emails, proposals, analysis, competitive intelligence |
| [**magazine-layout**](./magazine-layout/) | 🎨 Content Design | Transform text into beautiful magazine-style HTML pages | 12 visual styles with PDF export |
| [**peers-advisory-group**](./peers-advisory-group/) | 💡 Decision Making | Virtual advisory board with 4 business legends | Strategic decisions, problem analysis |
| [**video-downloader**](./video-downloader/) | 📹 Utility | Universal video downloader supporting 1000+ websites | YouTube, Bilibili, Twitter, TikTok, etc. |
| [**gif-splitter**](./gif-splitter/) | 🖼️ Utility | GIF splitter for frame limit issues | WeChat upload, batch processing |

### 🌟 Key Features

#### 🎯 Sales AI Assistant

**One-liner**: Can't write prompts? Just describe your scenario and get professional sales content.

**Core Value**:
- ✅ **Scenario Recognition**: Intelligently matches 25 sales scenarios
- ✅ **Info Collection**: Auto-extracts key info, collects missing data once
- ✅ **Dual Output**: Ready-to-use content + optimized prompt (for learning)
- ✅ **Quick Adjustments**: "More formal", "Shorter", "Add data" commands

**Supported Scenarios**:
- Outreach (5): Cold emails, demo follow-ups, renewal proposals, activity summaries, pipeline reports
- Strategy (5): Account plans, territory planning, prioritization, scoring, market entry
- Competitive (5): Battle cards, competitive analysis, one-pagers, objection handling, social proof
- Analytics (5): Conversion rates, rep performance, deal velocity, attribution, comparisons
- Visuals (5): Sales funnels, personas, coverage maps, celebration graphics

---

#### 🎨 Magazine Layout

**One-liner**: Turn plain text into stunning magazine pages in seconds.

**Core Value**:
- 📱 12 curated visual styles
- 🎯 Tailwind CSS responsive design
- 📄 Multi-engine PDF export support
- 🎨 Auto-layout: titles, intros, body, images

---

#### 💡 Peers Advisory Group

**One-liner**: 4 business legends (Buffett, Gates, Musk, Jobs) help analyze your problems.

**Core Value**:
- 👥 Multi-perspective analysis: Investment, Tech, Innovation, Product
- 🔄 Deep questioning: 3 rounds per advisor
- 📊 Structured output: Diagnosis → Analysis → Recommendations
- 📝 Optional magazine-style HTML report

---

#### 📹 Video Downloader

**One-liner**: One skill to download videos from anywhere.

**Core Value**:
- 🌍 Supports 1000+ websites
- 🎬 Quality options (360p to 4K)
- 🎵 Audio extraction (MP3)
- 📝 Subtitle download
- 🔄 Auto WebM to MP4 conversion

---

### 📥 Installation

#### Option 1: Via Claude Code Plugin Marketplace (Recommended)

```bash
claude plugin marketplace add isjiamu/jiamu-skills
```

#### Option 2: Manual Installation

```bash
# Clone to Claude Code skills directory
git clone https://github.com/isjiamu/jiamu-skills.git ~/.claude/skills/jiamu-skills

# Or create symbolic links
ln -s /path/to/jiamu-skills/sales-ai-assistant ~/.claude/skills/sales-ai-assistant
ln -s /path/to/jiamu-skills/magazine-layout ~/.claude/skills/magazine-layout
# ... other skills
```

#### Option 3: From .skill Files

Each skill provides a packaged .skill file (zip format) that can be extracted to the skills directory.

---

### 🚀 Usage

See the Chinese section above for detailed usage examples.

---

### 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

### 👤 Author

**jiamu** ([@isjiamu](https://github.com/isjiamu))

AI tools and productivity enthusiast

---

### 📊 Version History

- **v1.4.0** (2026-01-26) - Added gif-splitter (GIF frame splitter)
- **v1.3.0** (2026-01-23) - Added sales-ai-assistant (25 sales scenarios)
- **v1.2.0** - Added video-downloader
- **v1.1.0** - Added magazine-layout and peers-advisory-group
- **v1.0.0** - Initial release

---

<div align="center">

**⭐ If these skills help you, please give a Star! ⭐**

Made with ❤️ by jiamu

</div>
