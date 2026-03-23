import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import { TypingContext, TypingStateActionType } from '@/features/typing/store'
import { isOpenDarkModeAtom } from '@/app/state/theme'
import clsx from 'clsx'
import { useAtom } from 'jotai'
import { memo, useContext } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import IconMoon from '~icons/heroicons/moon-solid'
import IconSun from '~icons/heroicons/sun-solid'
import IconLanguage from '~icons/tabler/language'
import IconLanguageOff from '~icons/tabler/language-off'
import AnalysisButton from '@/features/typing/components/Switcher/components/AnalysisButton'
import ErrorBookButton from '@/features/typing/components/Switcher/components/ErrorBookButton'
import HandPositionIllustration from '@/features/typing/components/Switcher/components/HandPositionIllustration'
import LoopWordSwitcher from '@/features/typing/components/Switcher/components/LoopWordSwitcher'
import Setting from '@/features/typing/components/Switcher/components/Setting'
import SoundSwitcher from '@/features/typing/components/Switcher/components/SoundSwitcher'
import WordDictationSwitcher from '@/features/typing/components/Switcher/components/WordDictationSwitcher'

const StaticSwitcherControls = memo(function StaticSwitcherControls() {
  const [isOpenDarkMode, setIsOpenDarkMode] = useAtom(isOpenDarkModeAtom)

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old)
  }

  return (
    <>
      <Tooltip content="声音设置">
        <SoundSwitcher />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="设置单词重复次数">
        <LoopWordSwitcher />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="切换听写模式（Ctrl + Shift + D）">
        <WordDictationSwitcher />
      </Tooltip>
      <Tooltip content="错题本">
        <ErrorBookButton />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="查看统计">
        <AnalysisButton />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="切换深色模式">
        <button
          className="rounded-md p-0.5 text-lg text-accent-primary transition-colors hover:bg-accent-primary-soft hover:text-accent-primary-hover focus:outline-none"
          type="button"
          onClick={(e) => {
            changeDarkModeState()
            e.currentTarget.blur()
          }}
          aria-label="切换深色模式"
        >
          {isOpenDarkMode ? <IconMoon className="my-icon" /> : <IconSun className="my-icon" />}
        </button>
      </Tooltip>
      <Tooltip className="h-7 w-7" content="指法提示">
        <HandPositionIllustration />
      </Tooltip>
      <Tooltip content="设置">
        <Setting />
      </Tooltip>
    </>
  )
})

export function Switcher() {
  const { state, dispatch } = useContext(TypingContext)!

  const changeTransVisibleState = () => {
    dispatch?.({ type: TypingStateActionType.TOGGLE_TRANS_VISIBLE })
  }

  useHotkeys(
    'ctrl+shift+v',
    () => {
      changeTransVisibleState()
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  )

  return (
    <div className="flex items-center justify-center gap-2">
      <Tooltip className="h-7 w-7" content="切换释义显示（Ctrl + Shift + V）">
        <button
          className={clsx(
            'rounded-md p-0.5 text-lg transition-colors hover:bg-accent-primary-soft focus:outline-none',
            state?.isTransVisible ? 'text-accent-primary hover:text-accent-primary-hover' : 'text-text-muted hover:text-text-strong',
          )}
          type="button"
          onClick={(e) => {
            changeTransVisibleState()
            e.currentTarget.blur()
          }}
          aria-label="切换释义显示（Ctrl + Shift + V）"
        >
          {state?.isTransVisible ? <IconLanguage /> : <IconLanguageOff />}
        </button>
      </Tooltip>

      <StaticSwitcherControls />
    </div>
  )
}

