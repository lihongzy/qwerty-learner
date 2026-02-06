import { WordWithIndex } from "@/typings";
import { LetterMistakes } from "@/utils/db/record";

export type ChapterData = {
  // warning:因为有章节内随机的存在，所有记录index的场景都应该使用WordWithIndex.index
  words: WordWithIndex[];
  // chapter index
  index: number;
  // 输入的单词数
  wordCount: number;
  //输入正确的单词数
  crrectCount: number;
  //输入错误的单词数
  wrongCount: number;
  //每个单词的输入记录
  userInputLogs: UserInputLog[];
  //本章节用户输入的单词record id列表
  wordRecordIds: number[];
};

export type UserInputLog = {
  index: number;
  correntCount: number;
  wrongCount: number;
  LetterMistakes: LetterMistakes;
};

export type TimerData = {
  time: number;
  accuracy: number;
  wpm: number;
};

export type TypingState = {
  chapterData: ChapterData;
  timerData: TimerData;
  isTyping: boolean;
  isFinished: boolean;
  isShowSkip: boolean;
  isTransVisible: boolean;
  isLoopSingleWord: boolean;
  //是否保存数据
  isSavingRecord: boolean;
};
