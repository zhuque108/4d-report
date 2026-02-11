# 🖼️ Release v1.4.0: GIF Splitter

## ✨ 新功能

### 🚀 GIF Splitter - GIF动图切分器

**一句话描述**：解决微信公众号"图片帧数超过300帧"上传限制问题。

#### 核心特性

- ✂️ **智能切分**：自动检测帧数，均匀拆分成多个文件
- 📊 **信息查看**：支持查看GIF帧数、大小、尺寸等详细信息
- 📁 **批量处理**：支持整个文件夹批量切分
- ⚙️ **灵活配置**：可自定义最大帧数（默认280帧）、输出目录
- 🔄 **保留帧率**：切分后保留原始动画速度

#### 工作原理

1. **读取GIF**：使用Pillow库读取所有帧和每帧持续时间
2. **计算分片**：根据总帧数和最大帧数限制，计算切分数量
3. **均匀分配**：将帧均匀分配，避免最后一个文件帧数过少
4. **保存输出**：保留原始帧率，启用GIF优化压缩

#### 使用示例

```bash
# 查看GIF信息
python3 scripts/split_gif.py "动图.gif" --info

# 切分单个文件
python3 scripts/split_gif.py "动图.gif"

# 切分整个文件夹
python3 scripts/split_gif.py ~/Desktop/gif文件夹/

# 自定义最大帧数
python3 scripts/split_gif.py "动图.gif" --max-frames 200
```

#### 输出示例

```
处理: 演示动画.gif (740 帧)
  将拆分为 3 个文件，每个约 247 帧
  ✓ 演示动画_第1部分.gif: 247 帧, 4.11 MB
  ✓ 演示动画_第2部分.gif: 247 帧, 3.11 MB
  ✓ 演示动画_第3部分.gif: 246 帧, 2.04 MB

✅ 完成！共处理 1 个文件，生成 3 个切分文件
```

---

## 📝 文档更新

- 📊 README新增gif-splitter技能介绍
- 📁 项目结构更新
- 🌐 中英文版本历史同步更新

---

## 📦 技能集合

本次release后，jiamu-skills共包含 **5个** 生产力技能：

| 技能 | 类别 | 描述 |
|-----|------|------|
| **gif-splitter** ⭐ NEW | 工具类 | GIF动图智能切分 |
| **sales-ai-assistant** | 销售赋能 | 25个销售场景自动化 |
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

### 使用GIF Splitter

```
用户：我的GIF上传微信公众号提示帧数超过300帧

Skill：
📊 检测GIF信息 → ✂️ 智能切分 → 💾 保存文件

输出目录：split_output/
```

---

## 📊 变更日志

### 新增
- ✨ gif-splitter skill
- 📄 split_gif.py 核心切分脚本
- 📖 gif-splitter SKILL.md 完整文档

### 优化
- 📝 README更新，新增gif-splitter介绍
- 📁 项目结构更新
- 📊 版本历史同步更新

### 文件变更
- 4 files changed
- gif-splitter/SKILL.md (新增)
- gif-splitter/scripts/split_gif.py (新增)
- README.md (更新)
- RELEASE_NOTES_v1.4.0.md (新增)

---

## 🔧 技术细节

- **依赖**：Pillow (PIL)
- **Python版本**：3.6+
- **支持格式**：GIF（动态/静态）
- **默认最大帧数**：280帧（微信公众号限制300帧）

---

## 🔗 相关链接

- 📖 [完整文档](https://github.com/isjiamu/jiamu-skills)
- 🖼️ [GIF Splitter详情](https://github.com/isjiamu/jiamu-skills/tree/main/gif-splitter)
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
