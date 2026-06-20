# 开发文档

## 目录

- [项目架构](#项目架构)
- [技术栈](#技术栈)
- [目录结构](#目录结构)
- [路由与页面](#路由与页面)
- [核心数据模型](#核心数据模型)
  - [词典与单词](#1-词典与单词)
  - [训练会话状态](#2-训练会话状态-typingstate)
  - [应用级状态](#3-应用级状态-zustand)
  - [本地持久化](#4-本地持久化-dexie)
- [关键数据流](#关键数据流)
  - [词列表获取](#词列表获取)
  - [训练状态流转](#训练状态流转)
  - [记录写入](#记录写入)
- [UI 组织方式](#ui-组织方式)
- [常见开发任务](#常见开发任务)
- [命令速查](#命令速查)

---

## 项目架构

Qwerty Learner 采用三层模块划分：

```
src/
├── app/      应用入口、路由、布局、全局 Provider
├── pages/    按页面组织的业务模块，包含 UI、hooks、局部 store
├── shared/   跨页面共享的类型、store、资源、工具函数、数据库、基础 UI
```

所有业务逻辑从 `pages` 开始，只有**多页面复用**时才提升到 `shared`。

## 技术栈

| 分类     | 技术                                         |
| -------- | -------------------------------------------- |
| 核心     | React 19、TypeScript、Vite 7                 |
| 路由     | React Router 7                               |
| 状态管理 | Zustand（持久化配置）、use-immer（会话状态） |
| 数据缓存 | SWR（词典 JSON）                             |
| 本地存储 | Dexie + IndexedDB（训练记录）                |
| 样式     | Tailwind CSS 4、Radix UI、shadcn/ui          |
| 桌面端   | Tauri 2                                      |

## 目录结构

```text
src/
├── app/
│   ├── app.tsx              # 应用根组件
│   ├── layout/              # Shell 布局（Header、Footer）
│   ├── providers/           # 全局 Provider 注入
│   ├── router/              # 路由表与 Router 选择
│   └── stores/              # 应用级 Zustand store
├── pages/
│   ├── typing/              # 打字练习核心
│   │   ├── components/      # 页面私有组件
│   │   ├── hooks/           # 页面私有 hooks
│   │   ├── store/           # 会话状态 reducer
│   │   └── stores/          # Typing 专属配置 store
│   ├── gallery/             # 词库浏览
│   ├── analysis/            # 数据分析与热力图
│   ├── error-book/          # 错题本管理
│   ├── friend-link/         # 友情链接
│   └── mobile/              # 移动端适配页
├── shared/
│   ├── components/          # 共享业务组件
│   ├── lib/db/              # Dexie 数据库封装
│   ├── resources/           # 词典资源定义
│   ├── stores/              # 共享 Zustand store
│   ├── types/               # 通用 TypeScript 类型
│   ├── constants/           # 常量
│   └── utils/               # 工具函数
├── assets/                  # 图片、音效等静态资源
├── App.css                  # 全局样式与主题变量
└── main.tsx                 # 启动入口
```

## 路由与页面

所有路由定义在 `src/app/router/routes.tsx`：

| 路径           | 页面             | 说明                 |
| -------------- | ---------------- | -------------------- |
| `/`            | `TypingPage`     | 练习主页面           |
| `/gallery`     | `GalleryPage`    | 词库选择与浏览       |
| `/analysis`    | `AnalysisPage`   | 数据统计与键盘热力图 |
| `/error-book`  | `ErrorBookPage`  | 错题本管理           |
| `/friend-link` | `FriendLinkPage` | 友情链接             |
| `/mobile`      | `MobilePage`     | 移动端说明页         |

Router 选择逻辑：根据 `import.meta.env.BASE_URL` 自动切换 `BrowserRouter`（Vercel）或 `HashRouter`（GitHub Pages）。

---

## 核心数据模型

本项目的数据分为四层，绝大部分功能都围绕它们展开：

### 1. 词典与单词

位置：`src/shared/types/index.ts`、`src/shared/types/resource.ts`、`src/shared/resources/dictionary.ts`

```ts
// 单词结构
type Word = {
  name: string; // 单词文本
  trans: string[]; // 翻译列表
  usphone: string; // 美式音标
  ukphone: string; // 英式音标
  notation?: string; // 补充说明
};

// 带训练索引的单词
type WordWithIndex = Word & { index: number };

// 词典资源定义（静态）
type DictionaryResource = {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  url: string; // dict JSON 文件路径
  length: number; // 总单词数
  language: LanguageType;
  languageCategory: LanguageCategoryType;
  defaultPronIndex?: number;
};

// 词典对象（运行时，补充章节数）
type Dictionary = DictionaryResource & { chapterCount: number };
```

关键导出（`src/shared/resources/dictionary.ts`）：

- `dictionaryResources` — 所有内置词典资源数组
- `dictionaries` — 补齐 `chapterCount` 后的词典列表
- `idDictionaryMap` — 按 `id` 索引的词典表

### 2. 训练会话状态（TypingState）

位置：`src/pages/typing/store/type.ts`、`src/pages/typing/store/index.ts`

一次训练会话的完整状态树，由 `typingReducer` 管理：

```ts
type TypingState = {
  chapterData: ChapterData;
  timerData: TimerData;
  isTyping: boolean;
  isFinished: boolean;
  isShowSkip: boolean;
  isTransVisible: boolean;
  isLoopSingleWord: boolean;
  isSavingRecord: boolean;
};
```

核心子结构：

**ChapterData**

```ts
type ChapterData = {
  words: WordWithIndex[]; // 当前章节单词
  index: number; // 当前输入中的单词索引
  wordCount: number; // 已完成单词轮次总数
  correctCount: number; // 按键级正确次数
  wrongCount: number; // 按键级错误次数
  userInputLogs: UserInputLog[]; // 每个单词的输入统计
  wordRecordIds: number[]; // 已写入 DB 的记录主键
};
```

> **注意**：`wordCount` ≠ 章节原始词数。跳词、循环、重练等行为会影响它。

**UserInputLog**

```ts
type UserInputLog = {
  index: number;
  correctCount: number;
  wrongCount: number;
  LetterMistakes: LetterMistakes;
};

// key = 单词中字母位置, value = 该位置输错过的字符列表
interface LetterMistakes {
  [index: number]: string[];
}
```

**TimerData**

```ts
type TimerData = {
  time: number; // 已消耗秒数
  accuracy: number; // 输入准确率
  wpm: number; // 每分钟单词数
};
```

### 3. 应用级状态（Zustand）

项目 Zustand store 分三层：

| 层级   | 位置                       | 职责                     |
| ------ | -------------------------- | ------------------------ |
| 应用级 | `src/app/stores/`          | 主题、信息面板           |
| 共享级 | `src/shared/stores/`       | 跨页面偏好、练习会话配置 |
| 页面级 | `src/pages/typing/stores/` | Typing 专属偏好、发音    |

关键共享 store：

**practice-session**（`src/shared/stores/practice-session.ts`）

- `currentDictId`：当前词典 ID（持久化）
- `currentChapter`：当前章节号（持久化）
- `reviewModeInfo`：复习模式配置（持久化）
- `selectCurrentDictInfo(id)`：由 ID 派生完整词典对象

**preferences**（`src/shared/stores/preferences.ts`）

- `fontSizeConfig`、`isTextSelectable`、`phoneticConfig`

**Typing 专属**（`src/pages/typing/stores/`）

- `loopWordConfig` — 单词循环次数
- `randomConfig` — 随机排序开关
- `wordDictationConfig` — 听写模式（隐藏策略、触发方式）
- `pronunciationConfig` — 发音（音量、语速、发音源）
- `keySoundsConfig` / `hintSoundsConfig` — 按键音与提示音

**persist 工具**（`src/shared/stores/persist.ts`）

统一处理配置的本地存储读写，自动处理类型不匹配和旧配置字段缺失的兼容问题。

### 4. 本地持久化（Dexie）

位置：`src/shared/lib/db/index.ts`、`src/shared/lib/db/record.ts`

数据库：`RecordDB`，基于 IndexedDB。

主要表：

| 表名                  | 用途           | 索引                                                         |
| --------------------- | -------------- | ------------------------------------------------------------ |
| `wordRecords`         | 单词级输入记录 | `word, timeStamp, dict, chapter, wrongCount, [dict+chapter]` |
| `chapterRecords`      | 章节成绩记录   | `timeStamp, dict, chapter, time, [dict+chapter]`             |
| `reviewRecords`       | 复习任务记录   | `dict, createTime, isFinished`                               |
| `revisionDictRecords` | 词典复习统计   | —                                                            |
| `revisionWordRecords` | 单词复习统计   | —                                                            |

**IWordRecord**

```ts
interface IWordRecord {
  word: string;
  timeStamp: number;
  dict: string;
  chapter: number | null;
  timing: number[]; // 相邻字母输入间隔
  wrongCount: number;
  mistakes: LetterMistakes;
}
```

**IChapterRecord**

```ts
interface IChapterRecord {
  dict: string;
  chapter: number | null;
  timeStamp: number;
  time: number; // 总耗时（秒）
  correctCount: number; // 按键级正确数
  wrongCount: number; // 按键级错误数
  wordCount: number; // 总输入词数
  correctWordIndexs: number[]; // 零错误完成词索引
  wordNumber: number; // 章节原始词数
  wordRecordIds: number[]; // 关联单词记录 ID
}
```

**写入入口**：`useSaveWordRecord()`、`useSaveChapterRecord()`、`useDeleteWordRecord()`

---

## 关键数据流

### 词列表获取

`useWordList`（`src/pages/typing/hooks/useWordList.ts`）的流程：

```
① 读取 currentDictId → selectCurrentDictInfo() → 拿到词典对象
② SWR 按 dict.url 拉取 JSON 数据并缓存
③ 判断模式：
   - 复习模式 → 使用 reviewRecord.words
   - 普通模式 → 按 CHAPTER_LENGTH 从数组切片当前章节
④ normalizeTrans() 统一 trans 为 string[]
⑤ 映射为 WordWithIndex[]
```

### 训练状态流转

`typingReducer` 的核心 action 流程：

```
SETUP_CHAPTER → REPORT_CORRECT_WORD / REPORT_WRONG_WORD → NEXT_WORD → ... → FINISH_CHAPTER
                                    ↑                              |
                                    └── LOOP_CURRENT_WORD ←────────┘
                   SKIP_WORD ────────┘
                   TICK_TIMER（同步 timerData）
                   TOGGLE_TRANS_VISIBLE
```

关键行为：

- `SETUP_CHAPTER` 重建整棵会话状态和 `userInputLogs`
- `REPORT_WRONG_WORD` 合并新错误到已有 `LetterMistakes`
- `TICK_TIMER` 负责派生 `time / accuracy / wpm`，不在 store 里维护
- `REPEAT_CHAPTER` / `NEXT_CHAPTER` 保留 `isTransVisible` 状态

### 记录写入

训练结束时：

1. `useSaveWordRecord()` 将每条 `UserInputLog` 的字母时间差转为 `timing[]` 并写入 `wordRecords`
2. `useSaveChapterRecord()` 根据 `userInputLogs` 推导 `correctWordIndexs` 并写入 `chapterRecords`
3. 写入的 `wordRecordIds` 反向写入 `ChapterData`，建立关联

---

## UI 组织方式

### 组件分层

- `src/shared/ui` — 基础 UI 封装（shadcn/Radix 的薄包装）
- `src/shared/components` — 共享业务组件
- `src/pages/*/components` — 页面私有组件

### 样式约定

- 全局主题变量在 `src/App.css`
- 组件样式优先用 Tailwind 类名
- 新增 UI 一律 Tailwind + Radix，旧 Headless UI 组件仅做兼容维护

### 组件拆分原则

- 容器组件只做状态接线
- 派生计算抽到 `logic.ts`
- 纯展示组件放 `components/`

---

## 常见开发任务

### 添加新词典

1. 在 `public/dicts/` 放置 JSON 文件（格式与现有词典一致）
2. 在 `src/shared/resources/dictionary.ts` 注册元数据
3. 确认 `length`（单词总数）正确——影响分期计算
4. 如需指定默认发音，补充 `defaultPronIndex`

### 添加新配置项

1. 判断归属：
   - 应用级 → `src/app/stores`
   - 共享级 → `src/shared/stores`
   - Typing 专属 → `src/pages/typing/stores`
2. 需持久化时优先复用 `src/shared/stores/persist.ts`
3. 影响训练过程时接入 `typingReducer` 或消费方组件

### 扩展训练记录字段

- 即时展示字段 → 从 `TypingState` 派生
- 持久化字段 → 扩展 Dexie record 结构 + 更新 save hook + 加 version migration

### 修改 IndexedDB 结构

同步加 Dexie version migration，否则旧用户数据不兼容直接报错。

---

## 命令速查

```bash
pnpm dev              # 启动开发服务器（localhost:1420）
pnpm build            # 类型检查 + 生产构建
pnpm preview          # 预览构建结果
pnpm tsc --noEmit     # 仅类型检查
pnpm check:encoding   # 源文件编码校验
pnpm tauri dev        # Tauri 桌面端（需先安装 Rust）
pnpm tauri build      # Tauri 桌面端构建（需先安装 Rust）
```

> 终端出现中文乱码不代表文件损坏，以 `pnpm check:encoding` 结果为准。
