import { SimpleTooltip as Tooltip } from '@/shared/ui/tooltip'
import { TypingContext, TypingStateActionType } from '@/features/typing/store'
import { isOpenDarkModeAtom } from '@/store'
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
      <Tooltip content="Sound settings">
        <SoundSwitcher />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="Set the word repeat count">
        <LoopWordSwitcher />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="Toggle dictation mode (Ctrl + V)">
        <WordDictationSwitcher />
      </Tooltip>
      <Tooltip content="Error book">
        <ErrorBookButton />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="View statistics">
        <AnalysisButton />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="Toggle dark mode">
        <button
          className="p-[2px] text-lg text-indigo-500 focus:outline-none"
          type="button"
          onClick={(e) => {
            changeDarkModeState()
            e.currentTarget.blur()
          }}
          aria-label="Toggle dark mode"
        >
          {isOpenDarkMode ? <IconMoon className="icon" /> : <IconSun className="icon" />}
        </button>
      </Tooltip>
      <Tooltip className="h-7 w-7" content="Typing hand guide">
        <HandPositionIllustration />
      </Tooltip>
      <Tooltip content="Settings">
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
      <Tooltip className="h-7 w-7" content="Toggle translation display (Ctrl + Shift + V)">
        <button
          className={`p-[2px] ${state?.isTransVisible ? 'text-indigo-500' : 'text-gray-500'} text-lg focus:outline-none`}
          type="button"
          onClick={(e) => {
            changeTransVisibleState()
            e.currentTarget.blur()
          }}
          aria-label="Toggle translation display (Ctrl + Shift + V)"
        >
          {state?.isTransVisible ? <IconLanguage /> : <IconLanguageOff />}
        </button>
      </Tooltip>

      <StaticSwitcherControls />
    </div>
  )
}

