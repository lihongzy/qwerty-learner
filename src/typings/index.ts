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
