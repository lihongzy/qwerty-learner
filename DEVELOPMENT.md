# Qwerty Learner 开发文档

## 项目概述

Qwerty Learner 是一个为键盘工作者设计的英语打字练习工具，旨在提高用户的英语输入效率。项目使用现代前端技术栈构建，支持多种词典、复习模式和个性化配置。

## 技术栈

### 核心框架
- **React 19** - UI 框架
- **TypeScript** - 类型安全
- **Vite** - 构建工具

### 状态管理
- **Jotai** - 轻量级原子化状态管理
- **use-immer** - 不可变状态更新

### 数据获取
- **SWR** - 数据请求与缓存

### UI 与样式
- **Tailwind CSS 4** - 原子化 CSS 框架
- **Radix UI** - 无样式组件库
- **Headless UI** - React UI 组件库

### 其他
- **Dexie** - IndexedDB 封装，用于本地数据存储
- **React Router** - 路由管理
- **Tauri** - 桌面应用打包（可选）

## 项目结构

```
src/
├── components/              # 通用组件
│   ├── ui/                  # UI 基础组件（Alert 等）
│   ├── Header/              # 头部导航
│   ├── Footer/              # 页脚
│   ├── Layout/              # 布局组件
│   ├── Tooltip/             # 工具提示
│   ├── DonateCard/          # 捐赠卡片
│   ├── Loading/             # 加载组件
│   └── WordPronunciationIcon/ # 发音图标
├── pages/                   # 页面组件
│   ├── Typing/              # 打字练习页面（核心）
│   │   ├── components/      # 打字相关组件
│   │   │   ├── WordPanel/   # 单词面板
│   │   │   │   └── components/
│   │   │   │       ├── Word/          # 单词组件
│   │   │   │       ├── Letter.tsx     # 字母组件
│   │   │   │       ├── InputHandler/  # 输入处理
│   │   │   │       ├── KeyEventHandler/ # 键盘事件
│   │   │   │       ├── Phonetic/      # 音标显示
│   │   │   │       └── Translation/   # 翻译显示
│   │   │   ├── WordList/     # 单词列表
│   │   │   ├── Progress/     # 进度条
│   │   │   ├── Speed/        # 速度显示
│   │   │   ├── ResultScreen/ # 结果屏幕
│   │   │   └── ...
│   │   ├── hooks/           # 自定义 Hooks
│   │   │   ├── useWordList.ts   # 获取词列表
│   │   │   └── usePronunciation.ts # 发音功能
│   │   ├── store/           # 打字状态管理
│   │   │   ├── index.ts     # Reducer 和 Context
│   │   │   └── type.ts      # 类型定义
│   │   └── index.tsx        # 打字页面入口
│   ├── Gallery/             # 词库画廊
│   ├── Analysis/            # 数据分析
│   ├── ErrorBook/          # 错题本
│   ├── FriendLink/          # 友链
│   └── Mobile/              # 移动端页面
├── store/                   # 全局状态（Jotai Atoms）
│   ├── index.ts             # 主要 Atoms
│   ├── atomForConfig.ts     # 配置 Atom 工厂
│   └── reviewInfoAtom.ts    # 复习信息
├── resources/               # 静态资源
│   └── dictionary.ts         # 词典配置
├── utils/                   # 工具函数
│   ├── db/                  # IndexedDB 操作
│   └── wordListFetcher.ts   # 词列表获取
├── constants/               # 常量定义
├── typings/                 # 类型定义
│   ├── index.ts             # 主要类型
│   └── resource.ts          # 资源类型
├── App.tsx                  # 应用入口
├── App.css                  # 全局样式
└── main.tsx                 # 入口文件
```

## 核心概念

### 1. 打字状态管理（Typing Store）

使用 `useImmerReducer` + Context 实现，位置：`src/pages/Typing/store/index.ts`

```typescript
// 状态结构
interface TypingState {
  chapterData: {
    words: WordWithIndex[]
    index: number
    wordCount: number
    correctCount: number
    wrongCount: number
    userInputLogs: UserInputLog[]
  }
  timerData: {
    time: number
    accuracy: number
    wpm: number
  }
  isTyping: boolean
  isFinished: boolean
  isShowSkip: boolean
  isTransVisible: boolean
}
```

**主要 Action**：
- `SETUP_CHAPTER` - 初始化章节
- `SET_IS_TYPING` - 设置打字状态
- `NEXT_WORD` - 进入下一个单词
- `LOOP_CURRENT_WORD` - 循环当前单词
- `FINISH_CHAPTER` - 完成章节

### 2. 全局状态（Jotai Atoms）

位置：`src/store/index.ts`

**核心 Atoms**：
- `currentDictIdAtom` - 当前选中的词典 ID
- `currentDictInfoAtom` - 当前词典信息
- `currentChapterAtom` - 当前章节
- `reviewModeInfoAtom` - 复习模式信息
- `loopWordConfigAtom` - 循环练习配置
- `pronunciationConfigAtom` - 发音配置
- `phoneticConfigAtom` - 音标配置
- `wordDictationConfigAtom` - 听写配置
- `isOpenDarkModeAtom` - 暗黑模式

### 3. 词列表获取（useWordList Hook）

位置：`src/pages/Typing/hooks/useWordList.ts`

```typescript
// 返回结构
interface UseWordListResult {
  words: WordWithIndex[]
  isLoading: boolean
  error: Error | undefined
}
```

根据以下条件返回不同的词列表：
1. 第一个章节（cet4 第 0 章）- 使用内置默认词列表
2. 复习模式 - 使用复习记录中的单词
3. 普通模式 - 从词典 JSON 文件中切片获取

### 4. 词典配置

位置：`src/resources/dictionary.ts`

词典数据结构：
```typescript
interface Dictionary {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  url: string
  length: number
  language: string
  languageCategory: string
}
```

支持的词典分类：
- 中国考试（CET-4、CET-6 等）
- 出国考试（IELTS、TOEFL、GRE 等）
- 其他专业词典

## 页面路由

位置：`src/App.tsx`

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | TypingPage | 打字练习主页面 |
| `/gallery` | GalleryPage | 词库画廊 |
| `/analysis` | AnalysisPage | 数据分析 |
| `/error-book` | ErrorBookPage | 错题本 |
| `/friend-link` | FriendLinkPage | 友链页面 |
| `/mobile` | MobilePage | 移动端页面 |

## 主要组件说明

### WordPanel（单词面板）

位置：`src/pages/Typing/components/WordPanel/index.tsx`

核心组件，负责：
- 显示当前单词
- 显示音标（可选）
- 显示翻译（鼠标悬停或自动显示）
- 显示进度条

### WordComponent（单词组件）

位置：`src/pages/Typing/components/WordPanel/components/Word/index.tsx`

负责：
- 渲染单词的每个字母
- 处理用户输入
- 显示正确/错误状态
- 错误时的抖动动画效果

### Letter（字母组件）

位置：`src/pages/Typing/components/WordPanel/components/Word/Letter.tsx`

渲染单个字母，支持三种状态：
- `normal` - 正常显示
- `correct` - 正确（绿色）
- `wrong` - 错误（红色）

### InputHandler（输入处理）

位置：`src/pages/Typing/components/WordPanel/components/InputHandler/index.tsx`

负责：
- 捕获键盘输入
- 过滤有效输入字符
- 调用状态更新逻辑

## 自定义样式

全局样式位置：`src/App.css`

使用 Tailwind 的 `@layer components` 定义自定义类：

```css
@layer components {
  .my-btn-primary { ... }
  .word-wrong { animation: shake 0.82s ... }
  .word-sound { ... }
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  /* ... */
}
```

## 开发指南

### 添加新词典

1. 在 `src/resources/dictionary.ts` 中添加词典配置
2. 确保词典 JSON 文件存在于 `public/dicts/` 目录

```typescript
{
  id: 'new_dict',
  name: '新词典',
  description: '词典描述',
  category: '自定义',
  tags: ['标签'],
  url: '/dicts/new_dict.json',
  length: 1000,
  language: 'en',
  languageCategory: 'en',
}
```

### 添加新组件

1. 在对应目录下创建组件目录
2. 使用 TypeScript 编写组件
3. 添加 JSDoc 注释说明
4. 导出并使用

### 修改状态管理

1. **全局状态**：在 `src/store/index.ts` 中添加新 Atom
2. **打字状态**：在 `src/pages/Typing/store/index.ts` 中添加新 Action

## 运行命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 预览构建结果
npm run preview

# Tauri 桌面应用
npm run tauri
```

## 类型检查

```bash
npx tsc --noEmit
```

## 注意事项

1. **React 19** - 项目使用 React 19，`ref` 作为普通 prop 传递
2. **Tailwind CSS 4** - 使用最新的 Tailwind CSS v4，注意配置差异
3. **Jotai Atoms** - 使用 `atomWithStorage` 实现持久化状态
4. **Dexie** - 本地数据存储使用 IndexedDB
5. **SWR** - 词列表使用 SWR 进行数据获取和缓存
