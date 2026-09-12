# 映言

映言是一款独立的 AI 图解产品：输入一段文字，用 DeepSeek 提炼结构，并生成三种可以切换、编辑和导出的视觉表达。

## 已实现

- 同一份内容生成“路径、摘要、焦点”三种图解
- 针对管理者、客户、学习者和社交媒体调整表达
- 点击图形节点，高亮对应的原文依据
- 直接编辑节点标题、描述和数字
- 用自然语言修改整张图或单个节点
- 五套主题色
- PNG（2 倍分辨率）与 SVG 导出
- 浏览器本地自动保存与最近 12 个 AI 版本
- 桌面和移动端响应式界面

## 本地运行

需要 Node.js 20 或更高版本。

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开 <http://localhost:3000>。

`.env.local` 配置：

```env
DEEPSEEK_API_KEY=your-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

API Key 只在服务端的 `/api/generate` 和 `/api/refine` 路由读取，不会发送到浏览器。`.env.local` 已被 Git 忽略。

## 生产构建

```bash
npm run lint
npm run build
npm start
```

## 结构

- `app/components/visual-studio.tsx`：产品工作台与交互状态
- `app/components/visual-canvas.tsx`：独立实现的 SVG 图形渲染器
- `app/api/generate/route.ts`：DeepSeek 内容提炼接口
- `app/api/refine/route.ts`：整图和局部修改接口
- `lib/schema.ts`：服务端与前端共享的数据约束
- `lib/prompts.ts`：受众策略、来源约束和修改指令
- `OPEN_SOURCE_NOTES.md`：开源参考及实现边界

当前版本将项目数据保存在浏览器本地。公开部署前应增加账号、数据库、速率限制和服务端额度控制。
