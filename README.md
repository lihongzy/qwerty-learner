# Qwerty Learner

Qwerty Learner 是一个面向键盘工作者的单词输入训练工具。它把单词记忆、拼写巩固和键盘输入训练合成到同一套练习流程里，目标不是单纯“背单词”，而是让用户在真实输入中同时提升速度、准确率和拼写熟练度。

## 核心价值

Qwerty Learner 的核心价值是把“记住单词”和“打对单词”融合成一套低摩擦、可量化、可持续的日常训练系统。

- 把词汇学习和英文输入训练绑定在一起
- 用速度、正确率、错题和章节记录形成即时反馈闭环
- 让练习可以持续重复进入，而不是一次性内容消费
- 服务经常使用键盘输入英文的人，而不只是传统背词场景

一句话概括：

> 它不是词典，也不是打字游戏，而是一台把单词记忆、拼写巩固和键盘输入训练结合起来的练习器。

## 功能概览

- 按章节练习内置词库
- 支持多种词库分类与语言类型
- 记录速度、正确率、错词和章节成绩
- 基于本地数据进行复习模式与错题训练
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

## 快速开始

### 环境要求

- Node.js 18+
- npm
- 如果需要运行桌面端，还需要 Tauri / Rust 环境

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
npm run tauri dev
```

## 推荐开发环境

- [VS Code](https://code.visualstudio.com/)
- [Tauri VS Code Extension](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## 项目结构

当前仓库使用三层结构，而不是旧的 `src/pages` / `src/components`：

```text
src/
├─ app/        # 应用入口、路由、布局、provider、应用级状态
├─ features/   # 按业务域组织的功能模块
├─ shared/     # 跨 feature 共享的类型、状态、资源、db、UI
├─ assets/     # 静态资源
├─ App.css     # 全局样式与 token
└─ main.tsx    # 启动入口
```

## 开发文档

更详细的开发说明见：

- [DEVELOPMENT.md](./DEVELOPMENT.md)

其中包括：

- 当前真实目录结构
- TypingState、ChapterData、UserInputLog 等核心数据结构
- Jotai atoms 的分层和职责
- Dexie / IndexedDB 的记录模型
- 词典资源与 `useWordList` 的数据流
- 常见开发任务和修改建议

## 开发建议

- 新增功能时优先放进对应的 `feature`
- 只有跨 `feature` 复用时再放到 `shared`
- 新 UI 优先使用 Tailwind + Radix
- 对持久化配置新增字段时优先复用 `atomForConfig`
- 修改 IndexedDB 结构时同步考虑 Dexie version migration

## 说明

- 如果终端里看到中文乱码，不一定是文件编码损坏，PowerShell 显示本身可能不正确
- 最终以 `npm run check:encoding` 的结果为准
