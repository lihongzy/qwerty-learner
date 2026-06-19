import clsx from 'clsx';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useImmer } from 'use-immer';
import { EXPLICIT_SPACE } from '@/shared/constants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { WordPronunciationIcon, type WordPronunciationIconRef } from '@/shared/components/WordPronunciationIcon';
import { selectCurrentDictInfo, usePracticeSessionStore } from '@/shared/stores';
import { useTypingPreferencesStore } from '@/pages/typing/stores';
import type { Word } from '@/shared/types';
import { useSaveWordRecord } from '@/shared/lib/db';
import { getUTCUnixTimestamp } from '@/shared/utils';
import useKeySounds from '@/pages/typing/hooks/useKeySounds';
import { TypingContext, TypingStateActionType } from '@/pages/typing/store';
import { InputHandler, type WordUpdateAction } from '../InputHandler';
import { getTypingTarget } from '../../input-profile';
import { TipAlert } from './TipAlert';
import { Letter } from '@/shared/components/word-display';
import { initialWordState, type WordState } from './type';

const vowelLetters = ['A', 'E', 'I', 'O', 'U'];

export const WordComponent = ({ word, onFinish }: { word: Word; onFinish: () => void }) => {
  const { state, dispatch } = useContext(TypingContext)!;
  const [wordState, setWordState] = useImmer<WordState>(structuredClone(initialWordState));

  const currentDictId = usePracticeSessionStore((state) => state.currentDictId);
  const currentDictInfo = useMemo(() => selectCurrentDictInfo(currentDictId), [currentDictId]);
  const currentLanguage = currentDictInfo.language;
  const currentLanguageCategory = currentDictInfo.languageCategory;
  const currentChapter = usePracticeSessionStore((state) => state.currentChapter);
  const wordDictationConfig = useTypingPreferencesStore((state) => state.wordDictationConfig);
  const pronunciationIsOpen = useTypingPreferencesStore((state) => state.pronunciationConfig.isOpen);
  const isShowAnswerOnHover = useTypingPreferencesStore((state) => state.isShowAnswerOnHover);

  const isIgnoreCase = useTypingPreferencesStore((state) => state.isIgnoreCase);

  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null);
  const hasCommittedFinishRef = useRef(false);
  const [showTipAlert, setShowTipAlert] = useState(false);
  const [isHoveringWord, setIsHoveringWord] = useState(false);
  const [isShowingFullWord, setIsShowingFullWord] = useState(false);
  const saveWordRecord = useSaveWordRecord();
  const [playKeySound, playBeepSound, playHintSound] = useKeySounds();
  const typingTarget = useMemo(() => getTypingTarget(word, currentDictInfo), [currentDictInfo, word]);

  useEffect(() => {
    let headword = '';
    try {
      headword = typingTarget.replace(/ /g, EXPLICIT_SPACE).replace(/’/g, '..');
    } catch {
      headword = '';
    }

    const newWordState = structuredClone(initialWordState);
    newWordState.displayWord = headword;
    newWordState.letterStates = new Array(headword.length).fill('normal');
    newWordState.startTime = Date.now().toString();
    newWordState.randomLetterVisible = headword.split('').map(() => Math.random() > 0.4);
    hasCommittedFinishRef.current = false;
    setIsShowingFullWord(false);
    setWordState(newWordState);
  }, [setWordState, typingTarget, word]);

  const updateInput = useCallback(
    (updateAction: WordUpdateAction) => {
      if (updateAction.type === 'delete') {
        if (wordState.hasWrong || updateAction.length <= 0) {
          return;
        }

        setWordState((draft) => {
          draft.inputWord = draft.inputWord.slice(0, Math.max(0, draft.inputWord.length - updateAction.length));
        });
        return;
      }

      if (updateAction.type === 'compose') {
        if (wordState.hasWrong || updateAction.value.length === 0) {
          return;
        }

        setWordState((draft) => {
          draft.inputWord += updateAction.value;
        });
        return;
      }

      if (updateAction.type !== 'add') {
        return;
      }

      if (wordState.hasWrong) {
        return;
      }

      if (updateAction.value === ' ') {
        updateAction.event.preventDefault();
        setWordState((draft) => {
          draft.inputWord += EXPLICIT_SPACE;
        });
        return;
      }

      setWordState((draft) => {
        draft.inputWord += updateAction.value;
      });
    },
    [setWordState, wordState.hasWrong],
  );

  const getLetterVisible = useCallback(
    (index: number) => {
      if (wordState.letterStates[index] === 'correct' || isShowingFullWord || (isShowAnswerOnHover && isHoveringWord)) {
        return true;
      }

      if (!wordDictationConfig.isOpen) {
        return true;
      }

      if (wordDictationConfig.type === 'hideAll') {
        return false;
      }

      const letter = wordState.displayWord[index];
      if (wordDictationConfig.type === 'hideVowel') {
        return !vowelLetters.includes(letter.toUpperCase());
      }
      if (wordDictationConfig.type === 'hideConsonant') {
        return vowelLetters.includes(letter.toUpperCase());
      }
      if (wordDictationConfig.type === 'randomHide') {
        return wordState.randomLetterVisible[index];
      }

      return true;
    },
    [
      isHoveringWord,
      isShowingFullWord,
      isShowAnswerOnHover,
      wordDictationConfig.isOpen,
      wordDictationConfig.type,
      wordState.displayWord,
      wordState.letterStates,
      wordState.randomLetterVisible,
    ],
  );

  useEffect(() => {
    if (wordState.inputWord.length === 0 && state.isTyping) {
      wordPronunciationIconRef.current?.play?.();
    }
  }, [state.isTyping, wordState.inputWord.length]);

  useHotkeys(
    'tab',
    (event) => {
      event.preventDefault();
      setIsShowingFullWord(true);
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  );

  useHotkeys(
    'tab',
    () => {
      setIsShowingFullWord(false);
    },
    { enableOnFormTags: true, keyup: true, preventDefault: true },
    [],
  );

  useHotkeys(
    'ctrl+j',
    (event) => {
      event.preventDefault();
      if (pronunciationIsOpen) {
        wordPronunciationIconRef.current?.play?.();
      }
    },
    { preventDefault: true, enableOnFormTags: true },
    [pronunciationIsOpen],
  );

  useEffect(() => {
    const inputLength = wordState.inputWord.length;
    if (wordState.hasWrong || inputLength === 0 || wordState.displayWord.length === 0) {
      return;
    }

    const inputChar = wordState.inputWord[inputLength - 1];
    const correctChar = wordState.displayWord[inputLength - 1];
    const isEqual =
      inputChar !== undefined && correctChar !== undefined
        ? isIgnoreCase
          ? inputChar.toLowerCase() === correctChar.toLowerCase()
          : inputChar === correctChar
        : false;

    if (isEqual) {
      setWordState((draft) => {
        draft.letterTimeArray.push(Date.now());
        draft.correctCount += 1;
        draft.letterStates[inputLength - 1] = 'correct';

        if (inputLength >= draft.displayWord.length) {
          draft.isFinished = true;
          draft.endTime = getUTCUnixTimestamp().toString();
        }
      });

      if (inputLength >= wordState.displayWord.length) {
        playHintSound();
      } else {
        playKeySound();
      }

      dispatch({ type: TypingStateActionType.REPORT_CORRECT_WORD });
      return;
    }

    playBeepSound();
    setWordState((draft) => {
      draft.letterStates[inputLength - 1] = 'wrong';
      draft.hasWrong = true;
      draft.hasMadeInputWrong = true;
      draft.wrongCount += 1;
      draft.letterTimeArray = [];

      if (draft.letterMistake[inputLength - 1]) {
        draft.letterMistake[inputLength - 1].push(inputChar);
      } else {
        draft.letterMistake[inputLength - 1] = [inputChar];
      }

      dispatch({
        type: TypingStateActionType.REPORT_WRONG_WORD,
        payload: { letterMistake: JSON.parse(JSON.stringify(draft.letterMistake)) },
      });
    });

    if (currentChapter === 0 && state.chapterData.index === 0 && wordState.wrongCount >= 3) {
      setShowTipAlert(true);
    }
  }, [
    currentChapter,
    dispatch,
    isIgnoreCase,
    playBeepSound,
    playHintSound,
    playKeySound,
    setWordState,
    state.chapterData.index,
    wordState.displayWord.length,
    wordState.hasWrong,
    wordState.inputWord,
    wordState.wrongCount,
  ]);

  useEffect(() => {
    if (!wordState.isFinished || hasCommittedFinishRef.current) {
      return;
    }

    hasCommittedFinishRef.current = true;
    dispatch({ type: TypingStateActionType.SET_IS_SAVING_RECORD, payload: true });
    void saveWordRecord(
      {
        word: word.name,
        wrongCount: wordState.wrongCount,
        letterTimeArray: wordState.letterTimeArray,
        letterMistake: wordState.letterMistake,
      },
      {
        onSavedRecordId: (dbID) => {
          dispatch({ type: TypingStateActionType.ADD_WORD_RECORD_ID, payload: dbID });
        },
        onSettled: () => {
          dispatch({ type: TypingStateActionType.SET_IS_SAVING_RECORD, payload: false });
        },
      },
    );
    onFinish();
  }, [
    dispatch,
    onFinish,
    saveWordRecord,
    word.name,
    wordState.letterMistake,
    wordState.letterTimeArray,
    wordState.isFinished,
    wordState.wrongCount,
  ]);

  useEffect(() => {
    if (!wordState.hasWrong) {
      return;
    }

    const timer = setTimeout(() => {
      setWordState((draft) => {
        draft.inputWord = '';
        draft.letterStates = new Array(draft.letterStates.length).fill('normal');
        draft.hasWrong = false;
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [setWordState, wordState.hasWrong]);

  return (
    <>
      <InputHandler updateInput={updateInput} />
      <div
        lang={currentLanguageCategory !== 'code' ? currentLanguageCategory : 'en'}
        className="flex flex-col items-center justify-center gap-2 pt-3 pb-1"
      >
        <div
          className={clsx(
            'relative flex min-h-[7.75rem] max-w-[min(84vw,48rem)] min-w-[min(70vw,40rem)] flex-col items-center justify-center overflow-hidden px-6 py-4',
          )}
          data-tip="按 Tab 快捷键显示完整单词"
        >
          <div
            onMouseEnter={() => setIsHoveringWord(true)}
            onMouseLeave={() => setIsHoveringWord(false)}
            className={clsx(
              'relative flex min-h-[4rem] items-center justify-center px-2 text-center',
              wordState.hasWrong && 'my-word-wrong',
            )}
          >
            <div className="flex items-center justify-center gap-3">
              <div className="flex flex-wrap items-center justify-center">
                {wordState.displayWord.split('').map((char, index) => (
                  <Letter
                    key={`${index}-${char}`}
                    letter={char}
                    visible={getLetterVisible(index)}
                    state={wordState.letterStates[index]}
                  />
                ))}
              </div>
              {pronunciationIsOpen && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex">
                        <WordPronunciationIcon
                          word={word}
                          lang={currentLanguage}
                          ref={wordPronunciationIconRef}
                          className="h-8 w-8 rounded-full"
                          iconClassName="h-4 w-4"
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>快捷键：Ctrl + J</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <div className="text-text-faint relative mt-2 text-xs">
            {wordDictationConfig.isOpen && (
              <span>
                按 <span className="text-text-main font-mono">Tab</span> 查看完整拼写
              </span>
            )}
          </div>
        </div>
      </div>
      <TipAlert className="fixed right-3 bottom-10" show={showTipAlert} setShow={setShowTipAlert} />
    </>
  );
};
