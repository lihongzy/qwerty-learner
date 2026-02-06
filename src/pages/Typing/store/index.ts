import { WordWithIndex } from "@/typings";
import { TypingState, UserInputLog } from "./type";
import { createContext } from "react";
import shuffle from "@/utils/shuffle";

export const initialState: TypingState = {
  chapterData: {
    words: [],
    index: 0,
    wordCount: 0,
    crrectCount: 0,
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
  correntCount: 0,
  wrongCount: 0,
  LetterMistakes: {},
};

export enum TypingStateActionType {
  SETUP_CHAPTER = "SETUP_CHAPTER",
  SET_IS_SKIP = "SET_IS_SKIP",
  SET_IS_TYPING = "SET_IS_TYPING",
  TOGGLE_IS_TYPING = "TOGGLE_IS_TYPING",
  REPORT_WRONG_WORD = "REPORT_WRONG_WORD",
  REPORT_CORRECT_WORD = "REPORT_CORRECT_WORD",
  NEXT_WORD = "NEXT_WORD",
  LOOP_CURRENT_WORD = "LOOP_CURRENT_WORD",
  FINISH_CHAPTER = "FINISH_CHAPTER",
  INCREASE_WRONG_WORD = "INCREASE_WRONG_WORD",
  SKIP_WORD = "SKIP_WORD",
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
  | { type: TypingStateActionType.TOGGLE_IS_TYPING };

type Dispatch = (action: TypingStateAction) => void;

export const typingReducer = (
  state: TypingState,
  action: TypingStateAction,
) => {
  switch (action.type) {
    case TypingStateActionType.SETUP_CHAPTER: {
      const newState = structuredClone(initialState);
      const words = action.payload.shouldShuffle
        ? shuffle(action.payload.words)
        : action.payload.words;
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
  }
};

export const TypingContext = createContext<{
  state: TypingState;
  dispatch: Dispatch;
} | null>(null);
