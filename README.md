# Qwerty Learner

Qwerty Learner 是一个面向键盘工作者的单词打字训练应用。它把词典学习、英文输入训练、错词复习和本地记录结合在一起，重点提升的是“输入熟练度”和“拼写肌肉记忆”，而不只是背单词。

## 功能概览

- 按章节练习内置词典
- 支持多种词典分类与语言类型
- 记录速度、准确率、错词和章节成绩
- 基于本地数据做复习模式与错题训练
- 支持发音、听写、随机顺序、字体和显示偏好配置
- 支持桌面端打包（Tauri）

## 技术栈

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Radix UI
- Jotai
- Dexie
- SWR
- React Router 7
- Tauri

## 快速启动

### 环境要求

- Node.js 18+
- npm
- 如果要运行桌面端，还需要 Tauri / Rust 环境

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 类型检查

```bash
npx tsc --noEmit
```

### 编码检查

```bash
npm run check:encoding
```

### Tauri 桌面端

```bash
npm run tauri
```

## 推荐开发环境

- [VS Code](https://code.visualstudio.com/)
- [Tauri VS Code Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 项目结构

当前仓库使用的是三层结构，而不是旧版 `src/pages` / `src/components`：

```text
src/
├── app/        # 应用入口、路由、布局、provider、应用级状态
├── features/   # 按业务域组织的功能模块
├── shared/     # 跨 feature 共享的类型、状态、资源、db、UI
├── assets/     # 静态资源
├── App.css     # 全局样式
└── main.tsx    # 启动入口
```

## 开发文档

更详细的开发说明见：

- [DEVELOPMENT.md](./DEVELOPMENT.md)

这份文档重点包含：

- 当前真实目录结构
- TypingState、ChapterData、UserInputLog 等核心数据结构
- Jotai atoms 的分层和职责
- Dexie / IndexedDB 的记录模型
- 词典资源与 `useWordList` 的数据流
- 常见开发任务和修改建议

## 开发建议

- 新增功能时优先放进对应的 `feature`
- 只有跨 feature 复用时再放到 `shared`
- 新 UI 优先使用 Tailwind + Radix
- 对持久化配置新增字段时优先复用 `atomForConfig`
- 修改 IndexedDB 结构时同步考虑 Dexie version migration

## 说明

- 终端里如果看到中文乱码，不一定是文件编码损坏，PowerShell 显示可能不正确
- 最终以 `npm run check:encoding` 结果为准
