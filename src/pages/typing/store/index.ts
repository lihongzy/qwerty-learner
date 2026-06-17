import { createContext } from 'react';
import shuffle from '@/lib/shuffle';
import type { WordWithIndex } from '@/shared/types';
import type { LetterMistakes } from '@/shared/lib/db/record';
import type { TypingState, UserInputLog } from './type';

export const initialState: TypingState = {
  chapterData: {
    words: [],
    index: 0,
    wordCount: 0,
    correctCount: 0,
    wrongCount: 0,
    userInputLogs: [],
    wordRecordIds: [],
  },
  timerData: {
    time: 0,
    accuracy: 0,
    wpm: 0,
  },
  isTyping: false,
  isFinished: false,
  isShowSkip: false,
  isTransVisible: false,
  isLoopSingleWord: false,
  isSavingRecord: false,
};

export const initialUserInputLog: UserInputLog = {
  index: 0,
  correctCount: 0,
  wrongCount: 0,
  LetterMistakes: {},
};

export enum TypingStateActionType {
  SETUP_CHAPTER = 'SETUP_CHAPTER',
  SET_IS_SKIP = 'SET_IS_SKIP',
  SET_IS_TYPING = 'SET_IS_TYPING',
  TOGGLE_IS_TYPING = 'TOGGLE_IS_TYPING',
  REPORT_WRONG_WORD = 'REPORT_WRONG_WORD',
  REPORT_CORRECT_WORD = 'REPORT_CORRECT_WORD',
  NEXT_WORD = 'NEXT_WORD',
  LOOP_CURRENT_WORD = 'LOOP_CURRENT_WORD',
  FINISH_CHAPTER = 'FINISH_CHAPTER',
  INCREASE_WRONG_WORD = 'INCREASE_WRONG_WORD',
  SKIP_WORD = 'SKIP_WORD',
  SET_IS_SAVING_RECORD = 'SET_IS_SAVING_RECORD',
  ADD_WORD_RECORD_ID = 'ADD_WORD_RECORD_ID',
  REPEAT_CHAPTER = 'REPEAT_CHAPTER',
  NEXT_CHAPTER = 'NEXT_CHAPTER',
  TICK_TIMER = 'TICK_TIMER',
  SKIP_2_WORD_INDEX = 'SKIP_2_WORD_INDEX',
  TOGGLE_TRANS_VISIBLE = 'TOGGLE_TRANS_VISIBLE',
}

export type TypingStateAction =
  | {
      type: TypingStateActionType.SETUP_CHAPTER;
      payload: {
        words: WordWithIndex[];
        shouldShuffle: boolean;
        initialIndex?: number;
      };
    }
  | { type: TypingStateActionType.SET_IS_SKIP; payload: boolean }
  | { type: TypingStateActionType.SET_IS_TYPING; payload: boolean }
  | { type: TypingStateActionType.TOGGLE_IS_TYPING }
  | { type: TypingStateActionType.LOOP_CURRENT_WORD }
  | {
      type: TypingStateActionType.NEXT_WORD;
      payload?: {
        updateReviewRecord?: (state: TypingState) => void;
      };
    }
  | { type: TypingStateActionType.FINISH_CHAPTER }
  | { type: TypingStateActionType.REPORT_CORRECT_WORD }
  | { type: TypingStateActionType.REPORT_WRONG_WORD; payload: { letterMistake: LetterMistakes } }
  | { type: TypingStateActionType.SET_IS_SAVING_RECORD; payload: boolean }
  | { type: TypingStateActionType.ADD_WORD_RECORD_ID; payload: number }
  | { type: TypingStateActionType.REPEAT_CHAPTER; shouldShuffle: boolean }
  | { type: TypingStateActionType.NEXT_CHAPTER }
  | { type: TypingStateActionType.TICK_TIMER; addTime?: number }
  | { type: TypingStateActionType.SKIP_WORD }
  | { type: TypingStateActionType.SKIP_2_WORD_INDEX; newIndex: number }
  | { type: TypingStateActionType.TOGGLE_TRANS_VISIBLE };

export type TypingDispatch = (action: TypingStateAction) => void;

export const typingReducer = (state: TypingState, action: TypingStateAction) => {
  switch (action.type) {
    case TypingStateActionType.SETUP_CHAPTER: {
      const newState = structuredClone(initialState);
      const words = action.payload.shouldShuffle ? shuffle(action.payload.words) : action.payload.words;
      let initialIndex = action.payload.initialIndex ?? 0;
      if (initialIndex >= words.length) {
        initialIndex = 0;
      }
      newState.chapterData.index = initialIndex;
      newState.chapterData.words = words;
      newState.chapterData.userInputLogs = words.map((_, index) => ({
        ...structuredClone(initialUserInputLog),
        index,
      }));
      return newState;
    }
    case TypingStateActionType.SET_IS_TYPING:
      state.isTyping = action.payload;
      break;
    case TypingStateActionType.TOGGLE_IS_TYPING:
      state.isTyping = !state.isTyping;
      break;
    case TypingStateActionType.LOOP_CURRENT_WORD:
      state.isShowSkip = false;
      state.chapterData.wordCount += 1;
      break;
    case TypingStateActionType.NEXT_WORD:
      state.chapterData.index += 1;
      state.chapterData.wordCount += 1;
      state.isShowSkip = false;
      action?.payload?.updateReviewRecord?.(state);
      break;
    case TypingStateActionType.FINISH_CHAPTER:
      state.chapterData.wordCount += 1;
      state.isTyping = false;
      state.isFinished = true;
      state.isShowSkip = false;
      break;
    case TypingStateActionType.REPORT_CORRECT_WORD: {
      state.chapterData.correctCount += 1;
      state.chapterData.userInputLogs[state.chapterData.index].correctCount += 1;
      break;
    }
    case TypingStateActionType.REPORT_WRONG_WORD: {
      state.chapterData.wrongCount += 1;
      const wordLog = state.chapterData.userInputLogs[state.chapterData.index];
      wordLog.wrongCount += 1;
      wordLog.LetterMistakes = mergeLetterMistake(wordLog.LetterMistakes, action.payload.letterMistake);
      break;
    }
    case TypingStateActionType.SET_IS_SAVING_RECORD:
      state.isSavingRecord = action.payload;
      break;
    case TypingStateActionType.ADD_WORD_RECORD_ID:
      state.chapterData.wordRecordIds.push(action.payload);
      break;
    case TypingStateActionType.REPEAT_CHAPTER: {
      const newState = structuredClone(initialState);
      newState.chapterData.userInputLogs = state.chapterData.words.map((_, index) => ({
        ...structuredClone(initialUserInputLog),
        index,
      }));
      newState.isTyping = true;
      newState.chapterData.words = action.shouldShuffle ? shuffle(state.chapterData.words) : state.chapterData.words;
      newState.isTransVisible = state.isTransVisible;
      return newState;
    }
    case TypingStateActionType.NEXT_CHAPTER: {
      const newState = structuredClone(initialState);
      newState.chapterData.userInputLogs = state.chapterData.words.map((_, index) => ({
        ...structuredClone(initialUserInputLog),
        index,
      }));
      newState.isTyping = true;
      newState.isTransVisible = state.isTransVisible;
      return newState;
    }
    case TypingStateActionType.TICK_TIMER: {
      const increment = action.addTime === undefined ? 1 : action.addTime;
      const newTime = state.timerData.time + increment;
      const elapsedTime = newTime <= 0 ? 1 : newTime;
      const inputSum = state.chapterData.correctCount + state.chapterData.wrongCount || 1;

      state.timerData.time = newTime;
      state.timerData.accuracy = Math.round((state.chapterData.correctCount / inputSum) * 100);
      state.timerData.wpm = Math.round((state.chapterData.wordCount / elapsedTime) * 60);
      break;
    }
    case TypingStateActionType.SKIP_WORD: {
      const newIndex = state.chapterData.index + 1;
      if (newIndex >= state.chapterData.words.length) {
        state.isTyping = false;
        state.isFinished = true;
      } else {
        state.chapterData.index = newIndex;
      }
      state.isShowSkip = false;
      break;
    }
    case TypingStateActionType.SKIP_2_WORD_INDEX: {
      const newIndex = Math.max(0, action.newIndex);
      if (newIndex >= state.chapterData.words.length) {
        state.isTyping = false;
        state.isFinished = true;
      } else {
        state.chapterData.index = newIndex;
      }
      state.isShowSkip = false;
      break;
    }
    case TypingStateActionType.TOGGLE_TRANS_VISIBLE:
      state.isTransVisible = !state.isTransVisible;
      break;
  }
};

export const TypingContext = createContext<{
  state: TypingState;
  dispatch: TypingDispatch;
} | null>(null);

export function mergeLetterMistake(letterMistake1: LetterMistakes, letterMistake2: LetterMistakes): LetterMistakes {
  const result: LetterMistakes = {};

  for (const mistakes of [letterMistake1, letterMistake2]) {
    for (const key in mistakes) {
      if (result[key]) {
        result[key].push(...mistakes[key]);
      } else {
        result[key] = [...mistakes[key]];
      }
    }
  }

  return result;
}
