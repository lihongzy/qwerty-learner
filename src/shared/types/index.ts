export type Word = {
  // 单词文本
  name: string;
  // 翻译列表
  trans: string[];
  // 美式音标
  usphone: string;
  // 英式音标
  ukphone: string;
  // 额外说明（可选）
  notation?: string;
};

export type WordWithIndex = Word & {
  // 在 chapter 中的原始索引
  index: number;
};

export type LoopWordTimesOption = 1 | 3 | 5 | 8 | typeof Number.MAX_SAFE_INTEGER;

export type WordDictationType = 'hideAll' | 'hideVowel' | 'hideConsonant' | 'randomHide';
/**
 * 标记用户是手动打开默写模式，还是通过点击resultScreen中的默写本章节按钮打开的
 *
 * 预期行为是，在进入下一章节时，如果是手动打开的默写模式，则保持设定
 * 如果时通过点击resultScreen中的默写本章按钮打开额，则关闭默写模式
 */
export type WordDictationOpenBy = 'auto' | 'user';

export type PronunciationType = 'us' | 'uk' | 'romaji' | 'zh' | 'ja' | 'de' | 'hapin' | 'kk' | 'id';
