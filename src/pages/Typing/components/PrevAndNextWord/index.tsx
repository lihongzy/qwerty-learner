import { Tooltip } from '@/components/Tooltip'
import { TypingContext, TypingStateActionType } from '@/pages/Typing/store'
import { currentDictInfoAtom, wordDictationConfigAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { useCallback, useContext, useMemo } from 'react'
import IconNext from '~icons/tabler/arrow-narrow-right'
import IconPrev from '~icons/tabler/arrow-narrow-left'

export type LastAndNextWordProps = {
  type: 'prev' | 'next'
}

export const PrevAndNextWord = ({ type }: LastAndNextWordProps) => {
  const { state, dispatch } = useContext(TypingContext)!
  const wordDictationConfig = useAtomValue(wordDictationConfigAtom)
  const currentLanguage = useAtomValue(currentDictInfoAtom).language

  const newIndex = useMemo(() => state.chapterData.index + (type === 'prev' ? -1 : 1), [state.chapterData.index, type])
  const word = state.chapterData.words[newIndex]
  const shortCutKey = useMemo(() => (type === 'prev' ? 'Ctrl + Shift + ArrowLeft' : 'Ctrl + Shift + ArrowRight'), [type])

  const onClickWord = useCallback(() => {
    if (!word) {
      return
    }

    dispatch({ type: TypingStateActionType.SKIP_2_WORD_INDEX, newIndex })
  }, [dispatch, newIndex, word])

  const headWord = useMemo(() => {
    if (!word) {
      return ''
    }

    const showWord = ['romaji', 'hapin'].includes(currentLanguage) ? word.notation || word.name : word.name

    if (type === 'prev') {
      return showWord
    }

    return wordDictationConfig.isOpen ? showWord.replace(/./g, '_') : showWord
  }, [currentLanguage, type, word, wordDictationConfig.isOpen])

  return (
    <>
      {word ? (
        <Tooltip content={`Shortcut: ${shortCutKey}`}>
          <div
            onClick={onClickWord}
            className="flex max-w-xs cursor-pointer select-none items-center text-gray-700 opacity-60 duration-200 ease-in-out hover:opacity-100 dark:text-gray-400"
          >
            {type === 'prev' && <IconPrev className="mr-4 shrink-0 grow-0 text-2xl" />}

            <div className={`grow-1 flex w-full flex-col ${type === 'next' ? 'items-end text-right' : ''}`}>
              <p
                className={`font-mono text-2xl font-normal text-gray-700 dark:text-gray-400 ${
                  wordDictationConfig.isOpen ? 'tracking-wider' : 'tracking-normal'
                }`}
              >
                {headWord}
              </p>
              {state.isTransVisible && (
                <p className="line-clamp-1 max-w-full text-sm font-normal text-gray-600 dark:text-gray-500">{word.trans.join('；')}</p>
              )}
            </div>

            {type === 'next' && <IconNext className="ml-4 shrink-0 grow-0 text-2xl" />}
          </div>
        </Tooltip>
      ) : (
        <div />
      )}
    </>
  )
}
