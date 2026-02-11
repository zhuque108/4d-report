# 🎯 Release v1.3.0: Sales AI Assistant

## ✨ 新功能

### 🚀 Sales AI Assistant - 销售AI助手

**一句话描述**：不会写Prompt？没关系，描述场景就能生成专业销售内容。

#### 核心特性

- ✅ **智能场景识别**：自动匹配25个销售场景
- ✅ **信息自动提取**：从描述中提取关键信息，一次性收集缺失内容
- ✅ **双重输出**：生成可直接使用的内容 + 优化提示词（供学习）
- ✅ **快捷调整**：支持"更正式"、"简短点"、"加数据"等快捷指令

#### 25个销售场景覆盖

**对外联络（5个）**
- 撰写个性化陌生开发邮件
- 演示后续邮件
- 为重要客户拟定续约方案
- 创建代表活动摘要
- 关于管道状态的执行官最新进展草案

**销售策略（5个）**
- 制定战略客户计划
- 设计区域规划框架
- 利用公司概况数据确定账户优先级
- 利用加权评分发现高潜力账户
- 区域市场进入规划

**竞争情报（5个）**
- 为竞争对手制作对战卡
- 竞争定位分析
- 创建一份销售赋能单页文件
- 准备销售异议反驳策略
- 在公共领域寻找客户证明点

**数据分析（5个）**
- 按阶段分析管道转化率
- 按成交率识别业绩最佳的销售代表
- 可视化各季度的交易速度
- 总结营销活动对已成交交易的归因
- 生成性能对比图表

**视觉素材（5个）**
- 在漏斗视图中可视化销售流程
- 可视化B2B销售漏斗
- 绘制关键销售人物图
- 创建区域覆盖范围图
- 设计一个团队庆祝图形

---

## 📝 文档优化

### README全面升级
- 📊 新增详细的技能列表表格（包含类别和场景）
- 🌟 每个skill的核心特色详细介绍
- 📥 三种安装方式说明（marketplace、手动、.skill文件）
- 🚀 详细的使用示例和工作流程
- 📁 清晰的项目结构展示
- 🌐 完整的双语文档（中文+英文）
- 🎨 视觉优化：badges、图标、排版

---

## 📦 技能集合

本次release后，jiamu-skills共包含4个生产力技能：

| 技能 | 类别 | 描述 |
|-----|------|------|
| **sales-ai-assistant** ⭐ NEW | 销售赋能 | 25个销售场景自动化 |
| **magazine-layout** | 内容设计 | 12种杂志风格排版 |
| **peers-advisory-group** | 决策咨询 | 4位商业大师顾问 |
| **video-downloader** | 工具类 | 1000+网站视频下载 |

---

## 🚀 快速开始

### 安装

**方式1：通过Claude Code插件市场**
```bash
claude plugin marketplace add isjiamu/jiamu-skills
```

**方式2：手动安装**
```bash
git clone https://github.com/isjiamu/jiamu-skills.git ~/.claude/skills/jiamu-skills
```

### 使用Sales AI Assistant

**示例1：陌生开发邮件**
```
用户：我要给字节跳动的产品VP发封邮件介绍我们的AI产品

Skill：
✅ 识别场景：陌生开发邮件
📋 收集信息：产品价值主张
💬 生成邮件 + 优化提示词
```

**示例2：销售数据分析**
```
用户：分析一下我们销售团队的转化率

Skill：
✅ 识别场景：管道转化率分析
📊 生成分析报告：各阶段转化率、流失点、改进建议
💡 展示使用的提示词
```

---

## 📊 变更日志

### 新增
- ✨ sales-ai-assistant skill（25个销售场景）
- 📄 完整的场景模板库（5个类别，references目录）
- 🎯 场景关键词匹配配置（scenario-keywords.json）
- 📖 sales-ai-assistant详细文档

### 优化
- 📝 README全面重写，双语支持
- 🎨 视觉优化：badges、表格、图标
- 📋 新增技能对比表格
- 🚀 详细的使用示例和安装指南
- 📁 项目结构说明
- 🤝 贡献指南
- 📊 版本历史记录

### 文件变更
- 9 files changed
- 2275 insertions(+)
- 57 deletions(-)

---

## 🔗 相关链接

- 📖 [完整文档](https://github.com/isjiamu/jiamu-skills)
- 🎯 [Sales AI Assistant详情](https://github.com/isjiamu/jiamu-skills/tree/main/sales-ai-assistant)
- 🌐 [Claude Code官网](https://claude.ai/code)

---

## 💡 使用反馈

如果你在使用过程中遇到问题或有建议，欢迎：
- 提交 [Issue](https://github.com/isjiamu/jiamu-skills/issues)
- 提交 [Pull Request](https://github.com/isjiamu/jiamu-skills/pulls)

---

<div align="center">

**⭐ 如果这些skills对你有帮助，请给个Star支持！⭐**

Made with ❤️ by jiamu

</div>
