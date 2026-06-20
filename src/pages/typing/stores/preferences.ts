import { create } from 'zustand';
import type { LoopWordTimesOption, PronunciationType, WordDictationOpenBy, WordDictationType } from '@/shared/types';
import { readStoredValue, resolveStateUpdater, type StateUpdater, writeStoredValue } from '@/shared/stores/persist';

export type LoopWordConfig = {
  times: LoopWordTimesOption;
};

export type RandomConfig = {
  isOpen: boolean;
};

export type WordDictationConfig = {
  isOpen: boolean;
  type: WordDictationType;
  openBy: WordDictationOpenBy;
};

export type PronunciationConfig = {
  isOpen: boolean;
  volume: number;
  type: PronunciationType;
  name: string;
  isLoop: boolean;
  isTransRead: boolean;
  transVolume: number;
  rate: number;
};

type TypingPreferencesStore = {
  loopWordConfig: LoopWordConfig;
  isShowPrevAndNextWord: boolean;
  isShowAnswerOnHover: boolean;
  isIgnoreCase: boolean;
  randomConfig: RandomConfig;
  wordDictationConfig: WordDictationConfig;
  pronunciationConfig: PronunciationConfig;
  setLoopWordConfig: (nextValue: StateUpdater<LoopWordConfig>) => void;
  setIsShowPrevAndNextWord: (nextValue: StateUpdater<boolean>) => void;
  setIsShowAnswerOnHover: (nextValue: StateUpdater<boolean>) => void;
  setIsIgnoreCase: (nextValue: StateUpdater<boolean>) => void;
  setRandomConfig: (nextValue: StateUpdater<RandomConfig>) => void;
  setWordDictationConfig: (nextValue: StateUpdater<WordDictationConfig>) => void;
  setPronunciationConfig: (nextValue: StateUpdater<PronunciationConfig>) => void;
};

const defaultLoopWordConfig: LoopWordConfig = { times: 1 };
const defaultRandomConfig: RandomConfig = { isOpen: false };
const defaultWordDictationConfig: WordDictationConfig = {
  isOpen: false,
  type: 'hideAll',
  openBy: 'auto',
};
const defaultPronunciationConfig: PronunciationConfig = {
  isOpen: true,
  volume: 1,
  type: 'us',
  name: '美音',
  isLoop: false,
  isTransRead: false,
  transVolume: 1,
  rate: 1,
};

export const useTypingPreferencesStore = create<TypingPreferencesStore>((set) => ({
  loopWordConfig: readStoredValue('loopWordConfig', defaultLoopWordConfig),
  isShowPrevAndNextWord: readStoredValue('isShowPrevAndNextWord', true),
  isShowAnswerOnHover: readStoredValue('isShowAnswerOnHover', true),
  isIgnoreCase: readStoredValue('isIgnoreCase', readStoredValue('isIgnoreCase\u0041tom', true)),
  randomConfig: readStoredValue('randomConfig', defaultRandomConfig),
  wordDictationConfig: readStoredValue('wordDictationConfig', defaultWordDictationConfig),
  pronunciationConfig: readStoredValue('pronunciationConfig', defaultPronunciationConfig),
  setLoopWordConfig: (nextValue) => {
    set((state) => {
      const loopWordConfig = resolveStateUpdater(state.loopWordConfig, nextValue);
      writeStoredValue('loopWordConfig', loopWordConfig);
      return { loopWordConfig };
    });
  },
  setIsShowPrevAndNextWord: (nextValue) => {
    set((state) => {
      const isShowPrevAndNextWord = resolveStateUpdater(state.isShowPrevAndNextWord, nextValue);
      writeStoredValue('isShowPrevAndNextWord', isShowPrevAndNextWord);
      return { isShowPrevAndNextWord };
    });
  },
  setIsShowAnswerOnHover: (nextValue) => {
    set((state) => {
      const isShowAnswerOnHover = resolveStateUpdater(state.isShowAnswerOnHover, nextValue);
      writeStoredValue('isShowAnswerOnHover', isShowAnswerOnHover);
      return { isShowAnswerOnHover };
    });
  },
  setIsIgnoreCase: (nextValue) => {
    set((state) => {
      const isIgnoreCase = resolveStateUpdater(state.isIgnoreCase, nextValue);
      writeStoredValue('isIgnoreCase', isIgnoreCase);
      return { isIgnoreCase };
    });
  },
  setRandomConfig: (nextValue) => {
    set((state) => {
      const randomConfig = resolveStateUpdater(state.randomConfig, nextValue);
      writeStoredValue('randomConfig', randomConfig);
      return { randomConfig };
    });
  },
  setWordDictationConfig: (nextValue) => {
    set((state) => {
      const wordDictationConfig = resolveStateUpdater(state.wordDictationConfig, nextValue);
      writeStoredValue('wordDictationConfig', wordDictationConfig);
      return { wordDictationConfig };
    });
  },
  setPronunciationConfig: (nextValue) => {
    set((state) => {
      const pronunciationConfig = resolveStateUpdater(state.pronunciationConfig, nextValue);
      writeStoredValue('pronunciationConfig', pronunciationConfig);
      return { pronunciationConfig };
    });
  },
}));
