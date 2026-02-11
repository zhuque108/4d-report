# AI Draw.io

AI-powered draw.io diagram generator for Claude Code. Generate flowcharts, architecture diagrams, mind maps, and technical illustrations from natural language descriptions with browser preview.

## Features

- **Natural Language to Diagram**: Describe what you want, get a professional diagram
- **Browser Preview**: Automatically renders diagrams using diagrams.net viewer
- **Multiple Diagram Types**:
  - Flowcharts & Process diagrams
  - AWS/GCP/Azure architecture diagrams
  - Mind maps
  - Entity relationship diagrams
  - Sequence diagrams
  - Technical illustrations
- **Rich Styling**: Colors, shapes, connectors, animations
- **Real-time Editing**: Modify existing diagrams through conversation

## Installation

### As Claude Code Plugin

```bash
# Clone the repository
git clone https://github.com/GBSOSS/ai-drawio.git

# Create symlink to Claude Code plugins directory
ln -s "$(pwd)/ai-drawio" ~/.claude/plugins/ai-drawio
```

Or manually add to your Claude Code settings (`~/.claude/settings.json`):
```json
{
  "plugins": [
    "/path/to/ai-drawio"
  ]
}
```

## Usage

Simply describe the diagram you want:

```
Draw a user login flowchart
```

```
Create an AWS architecture diagram with EC2, S3, RDS and Lambda
```

```
Generate a mind map about machine learning concepts
```

The skill will:
1. Generate valid draw.io XML
2. Create an HTML file with the embedded diagram
3. Start a local server and open browser to render
4. Take a screenshot to show the result

## Triggers

The skill responds to these keywords:
- `draw`, `diagram`, `flowchart`, `architecture`, `mindmap`
- Chinese: `画图`, `流程图`, `架构图`

## Example Output

### Simple Flowchart
```
Users → Cloudflare → Load Balancer → API Gateway → Microservices
```

### Complex Architecture
- 20+ nodes with multiple shapes (ellipse, rectangle, cylinder)
- Multiple connection types (solid, dashed, colored)
- Grouping/containers (Service Mesh border)
- Color-coded components

## How It Works

1. **XML Generation**: Creates draw.io compatible mxGraph XML
2. **HTML Embedding**: Wraps XML in HTML with diagrams.net viewer iframe
3. **Local Server**: Starts Python HTTP server to serve the file
4. **Browser Automation**: Opens Chrome and navigates to the diagram

## Requirements

- Claude Code with browser automation (Claude in Chrome MCP)
- Python 3.x (for local HTTP server)
- Internet connection (for diagrams.net viewer)

## File Structure

```
ai-drawio/
├── .claude-plugin/
│   └── plugin.json          # Plugin configuration
├── skills/
│   └── diagram-generator/
│       └── SKILL.md         # Core skill instructions
├── README.md
└── LICENSE
```

## Supported Shapes

### Basic Shapes
- Rectangle (Process): `rounded=1;whiteSpace=wrap;html=1;`
- Diamond (Decision): `rhombus;whiteSpace=wrap;html=1;`
- Ellipse (Start/End): `ellipse;whiteSpace=wrap;html=1;`
- Cylinder (Database): `shape=cylinder3;`

### AWS Shapes
```
shape=mxgraph.aws4.ec2
shape=mxgraph.aws4.s3
shape=mxgraph.aws4.rds
shape=mxgraph.aws4.lambda
shape=mxgraph.aws4.api_gateway
```

## Color Palette

| Purpose | Fill Color | Stroke Color |
|---------|-----------|--------------|
| Start/Success | #d5e8d4 | #82b366 |
| Process/Info | #dae8fc | #6c8ebf |
| Decision/Warning | #fff2cc | #d6b656 |
| Error/Stop | #f8cecc | #b85450 |

## Credits

Inspired by [next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io) by Dayuan Jiang.

## License

MIT License - see [LICENSE](LICENSE) file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Related Projects

- [next-ai-draw-io](https://github.com/DayuanJiang/next-ai-draw-io) - Original web-based implementation
