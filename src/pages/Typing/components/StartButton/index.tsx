import { useAtomValue } from 'jotai'
import { useCallback, useContext, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import IconRotate from '~icons/tabler/rotate-clockwise-2'
import { SimpleTooltip as Tooltip } from '@/components/ui/tooltip'
import { randomConfigAtom } from '@/store'
import { TypingContext, TypingStateActionType } from '@/pages/Typing/store'

export const StartButton = ({ isLoading }: { isLoading: boolean }) => {
  const { state, dispatch } = useContext(TypingContext)!
  const randomConfig = useAtomValue(randomConfigAtom)
  const [isRestartVisible, setIsRestartVisible] = useState(false)

  const onToggleIsTyping = useCallback(() => {
    if (!isLoading) {
      dispatch({ type: TypingStateActionType.TOGGLE_IS_TYPING })
    }
  }, [dispatch, isLoading])

  const onClickRestart = useCallback(() => {
    dispatch({ type: TypingStateActionType.REPEAT_CHAPTER, shouldShuffle: randomConfig.isOpen })
  }, [dispatch, randomConfig.isOpen])

  useHotkeys('enter', onToggleIsTyping, { enableOnFormTags: true, preventDefault: true }, [onToggleIsTyping])

  const isTyping = state.isTyping
  const shellClassName = isTyping
    ? 'border-slate-300/80 bg-slate-200/90 shadow-[0_10px_24px_rgba(148,163,184,0.18)] dark:border-slate-600 dark:bg-slate-700/90 dark:shadow-none'
    : 'border-indigo-300/70 bg-white shadow-[0_14px_32px_rgba(99,102,241,0.22)] dark:border-indigo-500/50 dark:bg-slate-900/90 dark:shadow-[0_12px_28px_rgba(79,70,229,0.24)]'
  const primaryButtonClassName = isTyping
    ? 'bg-slate-500 text-white hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500'
    : 'bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400'
  const restartButtonClassName = isTyping
    ? 'border-slate-300/70 bg-white/75 text-slate-600 hover:bg-white dark:border-slate-500/50 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
    : 'border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:border-indigo-500/40 dark:bg-slate-800 dark:text-indigo-200 dark:hover:bg-slate-700'

  return (
    <div
      className={`relative flex items-center overflow-hidden rounded-2xl border p-1 transition-all duration-200 ${shellClassName}`}
      onMouseEnter={() => setIsRestartVisible(true)}
      onMouseLeave={() => setIsRestartVisible(false)}
    >
      <Tooltip content={`${isTyping ? '暂停' : '开始'}（Enter）`}>
        <button
          className={`my-btn-primary min-w-[5.5rem] px-5 text-base shadow-none transition-colors duration-200 ${primaryButtonClassName}`}
          type="button"
          onClick={onToggleIsTyping}
          aria-label={isTyping ? '暂停' : '开始'}
        >
          <span className="font-medium tracking-[0.08em]">{isTyping ? '暂停' : '开始'}</span>
        </button>
      </Tooltip>

      <div
        className={`overflow-hidden transition-all duration-200 ${isRestartVisible ? 'ml-1 max-w-24 opacity-100' : 'ml-0 max-w-0 opacity-0'}`}
        aria-hidden={!isRestartVisible}
      >
        <Tooltip content="重新开始本章">
          <button
            className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium whitespace-nowrap transition-colors duration-200 ${restartButtonClassName}`}
            type="button"
            onClick={onClickRestart}
            aria-label="重新开始"
          >
            <IconRotate className="h-4 w-4" />
            <span>重开</span>
          </button>
        </Tooltip>
      </div>
    </div>
  )
}
