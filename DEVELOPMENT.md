# Qwerty Learner 开发文档

## 项目概览

Qwerty Learner 是一个面向键盘工作者的单词打字训练应用。核心目标不是“背单词”，而是把以下几件事结合在一起：

- 按章节练习词典内容
- 记录输入速度、准确率和错误分布
- 通过复习模式与错题数据做二次训练
- 用本地持久化保存用户偏好和训练记录

当前仓库已经不是旧版 `src/components + src/pages` 结构，而是标准的：

- `src/app`：应用入口、路由、布局、全局 provider、应用级状态
- `src/features`：按业务域组织页面与模块
- `src/shared`：可复用状态、类型、资源、工具函数、数据库与基础 UI

## 技术栈

### 核心框架

- React 19
- TypeScript
- Vite

### 状态管理

- Jotai：应用级与偏好配置状态
- use-immer / reducer：Typing 场景的会话状态

### 数据获取与持久化

- SWR：词典文件请求与缓存
- Dexie：IndexedDB 封装，保存练习记录和复习数据
- dexie-react-hooks：部分本地数据查询使用 live query

### UI 与样式

- Tailwind CSS 4
- Radix UI
- `@floating-ui/react`
- 仍有少量历史组件使用 Headless UI，正在逐步迁移

### 其他

- React Router 7
- dayjs
- xlsx
- html-to-image
- file-saver
- Tauri（可选桌面端）

## 当前目录结构

```text
src/
├── app/                         # 应用入口、路由、布局、provider、应用级 state
│   ├── app.tsx
│   ├── router/
│   ├── layout/
│   ├── providers/
│   └── state/
├── assets/                      # 图片、图标、分享图素材等静态资源
├── features/                    # 按业务域组织
│   ├── typing/                  # 打字练习核心功能
│   ├── gallery/                 # 词库画廊
│   ├── analysis/                # 数据分析
│   ├── error-book/              # 错题本
│   ├── friend-link/             # 友链
│   └── mobile/                  # 移动端说明页
├── shared/                      # 共享资源
│   ├── components/              # 共享业务组件
│   ├── ui/                      # 基础 UI 组件
│   ├── lib/                     # db 等底层实现
│   ├── resources/               # 内置词典、音效资源
│   ├── state/                   # 跨 feature 的共享 atom
│   ├── types/                   # 通用类型
│   ├── constants/               # 常量
│   └── utils/                   # 工具函数
├── App.css                      # 全局样式
├── main.tsx                     # 启动入口
└── vite-env.d.ts
```

## 应用入口与路由

### 应用入口

位置：

- [src/main.tsx](src/main.tsx)
- [src/app/app.tsx](src/app/app.tsx)

`App` 的职责很简单：

1. 引入全局样式 `App.css`
2. 挂载 `AppProviders`
3. 渲染 `AppRouter`

### 路由定义

位置：

- [src/app/router/routes.tsx](src/app/router/routes.tsx)

当前桌面端页面：

| 路径 | 组件 |
|---|---|
| `/` | `TypingPage` |
| `/gallery` | `GalleryPage` |
| `/analysis` | `AnalysisPage` |
| `/error-book` | `ErrorBookPage` |
| `/friend-link` | `FriendLinkPage` |
| `/mobile` | `MobilePage` |

## 核心数据结构

这一部分是本项目最重要的内容。绝大多数功能都围绕以下四层数据展开：

1. 词典资源数据
2. 打字会话状态
3. 应用级偏好状态
4. 本地持久化训练记录

---

## 1. 词典与单词数据

### 单词结构

位置：

- [src/shared/types/index.ts](src/shared/types/index.ts)

```ts
export type Word = {
  name: string
  trans: string[]
  usphone: string
  ukphone: string
  notation?: string
}

export type WordWithIndex = Word & {
  index: number
}
```

说明：

- `name`：单词文本
- `trans`：翻译列表
- `usphone` / `ukphone`：音标
- `notation`：补充说明，可选
- `WordWithIndex`：在运行时给单词加上当前章节内索引

这个 `index` 很关键，它不是词库全局索引，而是当前训练切片中的局部索引，用来：

- 对齐 `userInputLogs`
- 映射错词
- 保存章节内正确词位置

### 词典资源结构

位置：

- [src/shared/types/resource.ts](src/shared/types/resource.ts)

```ts
export type DictionaryResource = {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  url: string
  length: number
  language: LanguageType
  languageCategory: LanguageCategoryType
  defaultPronIndex?: number
}

export type Dictionary = DictionaryResource & {
  chapterCount: number
}
```

说明：

- `DictionaryResource`：静态资源层定义
- `Dictionary`：运行时词典对象，在资源基础上补充 `chapterCount`

### 词典注册

位置：

- [src/shared/resources/dictionary.ts](src/shared/resources/dictionary.ts)

核心导出：

- `dictionaryResources`：所有内置词典资源数组
- `dictionaries`：补齐 `chapterCount` 后的词典列表
- `idDictionaryMap`：按词典 `id` 建立的索引表

词典条目最少需要：

```ts
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

---

## 2. 打字会话状态（TypingState）

位置：

- [src/features/typing/store/type.ts](src/features/typing/store/type.ts)
- [src/features/typing/store/index.ts](src/features/typing/store/index.ts)

### TypingState

```ts
export type TypingState = {
  chapterData: ChapterData
  timerData: TimerData
  isTyping: boolean
  isFinished: boolean
  isShowSkip: boolean
  isTransVisible: boolean
  isLoopSingleWord: boolean
  isSavingRecord: boolean
}
```

这是一次训练会话的完整状态树。

### ChapterData

```ts
export type ChapterData = {
  words: WordWithIndex[]
  index: number
  wordCount: number
  correctCount: number
  wrongCount: number
  userInputLogs: UserInputLog[]
  wordRecordIds: number[]
}
```

字段含义：

- `words`：当前章节实际训练的单词列表
- `index`：当前正在输入的单词索引
- `wordCount`：本次训练总共“完成了多少个单词输入轮次”
- `correctCount`：按键级正确次数
- `wrongCount`：按键级错误次数
- `userInputLogs`：每个单词的输入统计
- `wordRecordIds`：本章训练中保存到 IndexedDB 的 `wordRecords` 主键列表

注意：

- `wordCount` 不是章节原始单词数，它会受跳词、循环、重练等行为影响
- `correctCount` / `wrongCount` 是输入维度，不是单词维度

### UserInputLog

```ts
export type UserInputLog = {
  index: number
  correctCount: number
  wrongCount: number
  LetterMistakes: LetterMistakes
}
```

用途：

- 统计某个单词在本章内的正确/错误输入次数
- 记录具体哪一位字母输错了什么

### LetterMistakes

位置：

- [src/shared/lib/db/record.ts](src/shared/lib/db/record.ts)

```ts
export interface LetterMistakes {
  [index: number]: string[]
}
```

含义：

- key：单词中字母位置
- value：该位置上用户输错过的字符列表

示例：

```ts
{
  0: ['r', 't'],
  2: ['o']
}
```

表示：

- 第 0 个字符输错过两次
- 第 2 个字符输错过一次

### TimerData

```ts
export type TimerData = {
  time: number
  accuracy: number
  wpm: number
}
```

含义：

- `time`：本次训练已经消耗的秒数
- `accuracy`：输入准确率
- `wpm`：按当前实现换算出的每分钟单词数

### 状态流转

Typing reducer 中最重要的 action：

- `SETUP_CHAPTER`：初始化章节，会重建整棵会话状态
- `REPORT_CORRECT_WORD`：累计按键级正确输入
- `REPORT_WRONG_WORD`：累计按键级错误并合并 `LetterMistakes`
- `NEXT_WORD`：推进到下一词
- `LOOP_CURRENT_WORD`：留在当前词继续练
- `SKIP_WORD` / `SKIP_2_WORD_INDEX`：跳词
- `FINISH_CHAPTER`：结束本章训练
- `REPEAT_CHAPTER`：重练当前章
- `NEXT_CHAPTER`：进入下一章
- `TICK_TIMER`：刷新 `time / accuracy / wpm`
- `TOGGLE_TRANS_VISIBLE`：切换释义显示

### Reducer 行为上的几个关键点

1. `SETUP_CHAPTER` 会按当前词表重建 `userInputLogs`
2. `REPEAT_CHAPTER` 和 `NEXT_CHAPTER` 都会保留 `isTransVisible`
3. `REPORT_WRONG_WORD` 会把新错误合并进已有 `LetterMistakes`
4. `TICK_TIMER` 负责同步派生指标，而不是单独存 observer

---

## 3. 应用级状态（Jotai Atoms）

项目的 Jotai 状态分两层：

- `src/shared/state`：跨 feature 共用
- `src/features/typing/state`：Typing 专属偏好和声音配置

### 3.1 共享练习状态

位置：

- [src/shared/state/practice-session.ts](src/shared/state/practice-session.ts)

#### ReviewModeInfo

```ts
export type ReviewModeInfo = {
  isReviewMode: boolean
  reviewRecord?: ReviewRecord
}
```

字段说明：

- `isReviewMode`：当前是否处于复习模式
- `reviewRecord`：如果在复习模式，当前复习任务对应的记录

#### 核心 atoms

- `currentDictIdAtom`：当前选中的词典 ID，带本地持久化
- `currentDictInfoAtom`：由 `currentDictIdAtom` 派生出的词典对象
- `currentChapterAtom`：当前章节号，带本地持久化
- `reviewModeInfoAtom`：复习模式配置，带本地持久化
- `isReviewModeAtom`：从 `reviewModeInfoAtom` 派生出的布尔值

### 3.2 共享显示偏好

位置：

- [src/shared/state/preferences.ts](src/shared/state/preferences.ts)

当前主要包含：

- `fontSizeConfigAtom`
- `isTextSelectableAtom`
- `phoneticConfigAtom`

### 3.3 Typing 专属配置 atoms

位置：

- [src/features/typing/state/preferences.ts](src/features/typing/state/preferences.ts)
- [src/features/typing/state/sound.ts](src/features/typing/state/sound.ts)

#### loopWordConfigAtom

```ts
{ times: LoopWordTimesOption }
```

控制单词循环训练次数。

#### randomConfigAtom

```ts
{ isOpen: boolean }
```

控制章节是否随机打乱。

#### wordDictationConfigAtom

```ts
{
  isOpen: boolean
  type: WordDictationType
  openBy: WordDictationOpenBy
}
```

字段说明：

- `isOpen`：是否开启听写模式
- `type`：隐藏策略，如 `hideAll / hideVowel / hideConsonant / randomHide`
- `openBy`：是用户主动打开，还是结果页自动打开

#### pronunciationConfigAtom

```ts
{
  isOpen: boolean
  volume: number
  type: PronunciationType
  name: string
  isLoop: boolean
  isTransRead: boolean
  transVolume: number
  rate: number
}
```

负责单词发音的整体配置。

#### keySoundsConfigAtom / hintSoundsConfigAtom

控制按键音、正确音、错误音等提示音。

### 3.4 atomForConfig 的作用

位置：

- [src/shared/state/atomForConfig.ts](src/shared/state/atomForConfig.ts)

这个封装不是简单的 `atomWithStorage` 包装，而是做了配置修正：

- 如果存储值类型不匹配，回退到默认值
- 如果旧版本配置缺少字段，用默认值补齐
- 补齐后会回写 localStorage

这保证了配置对象扩展字段后，旧用户本地存储不会直接报错。

---

## 4. 本地持久化记录（Dexie / IndexedDB）

位置：

- [src/shared/lib/db/index.ts](src/shared/lib/db/index.ts)
- [src/shared/lib/db/record.ts](src/shared/lib/db/record.ts)

数据库实例名：

- `RecordDB`

### 表结构

当前代码中显式声明的表：

- `wordRecords`
- `chapterRecords`
- `reviewRecords`
- `revisionDictRecords`
- `revisionWordRecords`

其中 `version(3)` 明确声明的 stores 是：

```ts
wordRecords: '++id,word,timeStamp,dict,chapter,wrongCount,[dict+chapter]'
chapterRecords: '++id,timeStamp,dict,chapter,time,[dict+chapter]'
reviewRecords: '++id,dict,createTime,isFinished'
```

### IWordRecord / WordRecord

```ts
export interface IWordRecord {
  word: string
  timeStamp: number
  dict: string
  chapter: number | null
  timing: number[]
  wrongCount: number
  mistakes: LetterMistakes
}
```

说明：

- `word`：单词文本
- `timeStamp`：创建时间
- `dict`：词典 ID
- `chapter`：章节号；如果在复习/其他模式下训练，可能是 `-1` 或 `null`
- `timing`：相邻字母输入间隔数组
- `wrongCount`：该词输入出错次数
- `mistakes`：按字母位记录的错误输入

`WordRecord.totalTime` 是 `timing` 的求和结果。

### IChapterRecord / ChapterRecord

```ts
export interface IChapterRecord {
  dict: string
  chapter: number | null
  timeStamp: number
  time: number
  correctCount: number
  wrongCount: number
  wordCount: number
  correctWordIndexs: number[]
  wordNumber: number
  wordRecordIds: number[]
}
```

说明：

- `time`：本章总耗时（秒）
- `correctCount` / `wrongCount`：按键级统计
- `wordCount`：训练过程中总输入词数
- `correctWordIndexs`：零错误完成的单词索引
- `wordNumber`：章节原始词数
- `wordRecordIds`：关联的单词记录 ID 列表

派生 getter：

- `wpm`
- `inputAccuracy`
- `wordAccuracy`

### IReviewRecord / ReviewRecord

```ts
export interface IReviewRecord {
  id?: number
  dict: string
  index: number
  createTime: number
  isFinished: boolean
  words: Word[]
}
```

用于复习模式，核心是：

- `index`：当前复习进度
- `words`：复习任务中的词序列
- `isFinished`：该复习任务是否完成

### RevisionWordRecord / RevisionDictRecord

这两类记录用于复习体系的统计与调度：

- `RevisionWordRecord`：记录某词在复习维度下的错误次数
- `RevisionDictRecord`：记录词典的复习轮次与时间

### 写入入口

位置：

- [src/shared/lib/db/index.ts](src/shared/lib/db/index.ts)

主要 hooks：

- `useSaveWordRecord()`
- `useSaveChapterRecord()`
- `useDeleteWordRecord()`

其中：

- `useSaveWordRecord` 会把字母时间差数组转换成 `timing`
- `useSaveChapterRecord` 会根据 `userInputLogs` 推导 `correctWordIndexs`

---

## 5. 词列表获取流程

位置：

- [src/features/typing/hooks/useWordList.ts](src/features/typing/hooks/useWordList.ts)

### 返回结构

```ts
export type UseWordListResult = {
  words: WordWithIndex[]
  isLoading: boolean
  error: Error | undefined
}
```

### 工作流程

1. 读取当前词典 `currentDictInfoAtom`
2. 读取当前章节 `currentChapterAtom`
3. 读取复习模式 `reviewModeInfoAtom`
4. 使用 SWR 按 `currentDictInfo.url` 拉取词典 JSON
5. 根据模式得到最终词表：
   - 复习模式：直接使用 `reviewRecord.words`
   - 普通模式：按 `CHAPTER_LENGTH` 从词典数组切片
6. 把结果映射成 `WordWithIndex[]`
7. 调用 `normalizeTrans` 保证 `trans` 最终始终是 `string[]`

### normalizeTrans 的意义

词典来源并不总是严格一致，`trans` 可能是：

- `string[]`
- 单个字符串
- `null`
- 其他异常值

`normalizeTrans` 负责把这些输入统一成组件层可消费的 `string[]`。

---

## 6. Typing 功能的状态协作关系

可以把 Typing 功能拆成 4 层：

### 6.1 资源层

- 词典元数据：`shared/resources/dictionary.ts`
- 词典文件：`public/dicts/*.json`

### 6.2 会话层

- `TypingContext`
- `typingReducer`
- `TypingState`

这一层是“本次训练正在发生什么”。

### 6.3 配置层

- `currentDictIdAtom`
- `currentChapterAtom`
- `reviewModeInfoAtom`
- `wordDictationConfigAtom`
- `pronunciationConfigAtom`
- `randomConfigAtom`

这一层是“用户当前怎么练、练什么、用什么偏好练”。

### 6.4 持久化层

- `wordRecords`
- `chapterRecords`
- `reviewRecords`
- 其他 revision 记录

这一层是“训练完以后沉淀什么数据”。

---

## 7. UI 组织方式

### 全局样式

位置：

- [src/App.css](src/App.css)

当前全局样式主要负责：

- 主题变量
- light / dark 模式背景
- 少量全局组件类，如 `my-card`、`my-btn-primary`

### UI 组件分层

- `src/shared/ui`：基础 UI primitive 封装
- `src/shared/components`：共享业务组件
- `src/features/*/components`：feature 私有组件

当前 UI 栈并不完全统一：

- 新组件优先使用 Tailwind + Radix
- 少量旧组件仍保留 Headless UI

新增 UI 时优先遵守这一原则：

1. 优先放入所属 feature
2. 只有跨 feature 复用时才移动到 `shared`
3. 优先 Tailwind + Radix

---

## 8. 常见开发任务

### 添加新词典

1. 在 `public/dicts/` 中加入 JSON 文件
2. 在 [src/shared/resources/dictionary.ts](src/shared/resources/dictionary.ts) 注册词典元数据
3. 确认 `length` 正确
4. 如需默认发音索引，补 `defaultPronIndex`

### 添加新的 Typing 配置项

1. 先判断它属于：
   - 共享状态：放 `src/shared/state`
   - Typing 私有配置：放 `src/features/typing/state`
2. 如果需要持久化，优先用 `atomForConfig` 或 `atomWithStorage`
3. 如果它会影响训练过程，再接入 `typingReducer` 或消费方组件

### 新增训练结果字段

如果是“本次训练即时展示”的字段：

- 优先从 `TypingState` 派生

如果是“训练完成后要持久化”的字段：

- 同步扩展 Dexie record 结构
- 更新对应 save hook

### 调整结果页或打字页组件

优先原则：

- 容器组件只做状态接线
- 派生计算放 `logic.ts`
- 纯展示组件放 feature 内 `components/`

---

## 9. 运行与检查命令

```bash
# 开发模式
npm run dev

# 构建
npm run build

# 预览
npm run preview

# 编码检查
npm run check:encoding

# 类型检查
npx tsc --noEmit

# Tauri
npm run tauri
```

## 10. 维护注意事项

1. 当前代码库已经迁移到 `src/app / src/features / src/shared`，不要再按旧版 `src/pages / src/components` 组织新代码。
2. 文档中所有数据结构应以 `src/features/typing/store/type.ts` 与 `src/shared/lib/db/record.ts` 为准。
3. 对持久化配置对象新增字段时，优先复用 `atomForConfig`，避免旧 localStorage 数据结构不兼容。
4. 对 IndexedDB 结构做变更时，必须同步考虑 Dexie version migration。
5. 新 UI 优先使用 Tailwind + Radix，旧的 Headless UI 仅做兼容维护。
6. 如果终端里看到中文乱码，不一定是文件坏了，PowerShell 编码显示可能不正确；最终以 `npm run check:encoding` 结果为准。
