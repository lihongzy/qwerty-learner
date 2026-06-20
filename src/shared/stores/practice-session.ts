import { create } from 'zustand';
import type { ReviewRecord } from '@/shared/lib/db/record';
import { idDictionaryMap } from '@/shared/resources/dictionary';
import type { Dictionary } from '@/shared/types/resource';
import { readStoredValue, resolveStateUpdater, type StateUpdater, writeStoredValue } from './persist';

export type ReviewModeInfo = {
  isReviewMode: boolean;
  reviewRecord?: ReviewRecord;
};

type PracticeSessionStore = {
  currentDictId: string;
  currentChapter: number;
  reviewModeInfo: ReviewModeInfo;
  setCurrentDictId: (nextValue: StateUpdater<string>) => void;
  setCurrentChapter: (nextValue: StateUpdater<number>) => void;
  setReviewModeInfo: (nextValue: StateUpdater<ReviewModeInfo>) => void;
};

export const normalizeDictId = (dictId: string) => {
  return dictId in idDictionaryMap ? dictId : 'cet4';
};

const defaultReviewModeInfo: ReviewModeInfo = {
  isReviewMode: false,
  reviewRecord: undefined,
};

export const usePracticeSessionStore = create<PracticeSessionStore>((set) => ({
  currentDictId: normalizeDictId(readStoredValue('currentDict', 'cet4')),
  currentChapter: readStoredValue('currentChapter', 0),
  reviewModeInfo: readStoredValue('reviewModeInfo', defaultReviewModeInfo),
  setCurrentDictId: (nextValue) => {
    set((state) => {
      const currentDictId = normalizeDictId(resolveStateUpdater(state.currentDictId, nextValue));
      writeStoredValue('currentDict', currentDictId);
      return { currentDictId };
    });
  },
  setCurrentChapter: (nextValue) => {
    set((state) => {
      const currentChapter = resolveStateUpdater(state.currentChapter, nextValue);
      writeStoredValue('currentChapter', currentChapter);
      return { currentChapter };
    });
  },
  setReviewModeInfo: (nextValue) => {
    set((state) => {
      const reviewModeInfo = resolveStateUpdater(state.reviewModeInfo, nextValue);
      writeStoredValue('reviewModeInfo', reviewModeInfo);
      return { reviewModeInfo };
    });
  },
}));

export const selectCurrentDictInfo = (currentDictId: string): Dictionary => {
  return idDictionaryMap[normalizeDictId(currentDictId)];
};
