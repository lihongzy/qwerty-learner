import { SoundIcon } from '@/shared/components/WordPronunciationIcon/SoundIcon'
import { fontSizeConfigAtom, isTextSelectableAtom } from '@/shared/state'
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip'
import useSpeech from '@/features/typing/hooks/useSpeech'
import { pronunciationConfigAtom } from '@/features/typing/state'
import { useAtomValue } from 'jotai'
import { useCallback, useMemo } from 'react'

export type TranslationProps = {
  trans: string
  showTrans?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

export const Translation = ({ trans, showTrans = true, onMouseEnter, onMouseLeave }: TranslationProps) => {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom)
  const fontSizeConfig = useAtomValue(fontSizeConfigAtom)
  const isTextSelectable = useAtomValue(isTextSelectableAtom)

  const isShowTransRead = window.speechSynthesis && pronunciationConfig.isTransRead
  const speechOptions = useMemo(() => ({ volume: pronunciationConfig.transVolume }), [pronunciationConfig.transVolume])
  const { speak, speaking } = useSpeech(trans, speechOptions)

  const handleClickSoundIcon = useCallback(() => {
    speak(true)
  }, [speak])

  return (
    <div className="flex items-center justify-center px-4 pb-2 pt-2" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="relative flex max-w-4xl items-center justify-center px-8">
        {isShowTransRead && showTrans && (
          <Tooltip content="朗读释义" className="absolute right-0 top-0 h-7 w-7 cursor-pointer">
            <SoundIcon
              animated={speaking}
              onClick={handleClickSoundIcon}
              ariaLabel="朗读释义"
              className="my-focus-ring inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-faint)] transition-colors duration-150 hover:text-[var(--accent-primary)]"
              iconClassName="h-4.5 w-4.5"
            />
          </Tooltip>
        )}

        <span
          className={`relative max-w-4xl text-center font-sans leading-[1.7] text-[var(--text-main)] transition-opacity duration-200 ${
            isTextSelectable ? 'select-text' : ''
          } ${showTrans ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontSize: `${fontSizeConfig.translateFont}px` }}
        >
          {showTrans ? trans : '\u00A0'}
        </span>
      </div>
    </div>
  )
}
