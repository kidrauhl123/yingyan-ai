# Open-source references

映言的产品结构和渲染代码为独立实现。设计阶段研究了以下开源项目：

- [AntV Infographic](https://github.com/antvis/Infographic)（MIT）：参考其“结构化内容 → 模板 → SVG”的声明式生成思路，以及让 AI 输出受约束视觉语法的做法。
- [Excalidraw](https://github.com/excalidraw/excalidraw)（MIT）：参考可编辑图形、开放数据格式和浏览器本地优先的产品原则。
- [Mermaid](https://github.com/mermaid-js/mermaid)（MIT）：参考文本描述与确定性渲染分离的架构。

当前版本没有复制上述项目的源代码。运行时图形由 `app/components/visual-canvas.tsx` 中的 React SVG 渲染器生成。依赖的完整许可证可在各 npm 包及其仓库中查看。
