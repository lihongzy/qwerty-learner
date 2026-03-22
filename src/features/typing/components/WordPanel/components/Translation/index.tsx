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
    <div className="flex items-center justify-center px-4 pb-4 pt-5" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="relative flex max-w-4xl items-center justify-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[linear-gradient(180deg,var(--bg-elevated),var(--bg-panel))] px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur-md">
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_46%)]" />

        {isShowTransRead && showTrans && (
          <Tooltip content="朗读释义" className="relative h-8 w-8 cursor-pointer">
            <button
              type="button"
              onClick={handleClickSoundIcon}
              className="my-focus-ring inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-main)] bg-[var(--bg-ghost)] text-[var(--text-muted)] transition-colors duration-150 hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
              aria-label="朗读释义"
            >
              <SoundIcon animated={speaking} className="h-4.5 w-4.5" />
            </button>
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