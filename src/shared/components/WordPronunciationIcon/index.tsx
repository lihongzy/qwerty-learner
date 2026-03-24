import { SoundIcon } from './SoundIcon'
import { usePronunciationSound } from '@/features/typing/hooks/usePronunciation.ts'
import type { Word } from '@/shared/types'
import clsx from 'clsx'
import { useCallback, useImperativeHandle, useMemo } from 'react'

export type WordPronunciationIconRef = {
  play: () => void
}

type Props = {
  word: Word
  lang: string
  className?: string
  iconClassName?: string
  ref?: React.Ref<WordPronunciationIconRef>
}

export const WordPronunciationIcon = ({ word, lang, className, iconClassName, ref }: Props) => {
  const currentWord = useMemo(() => {
    if (lang === 'romaji') {
      return word.notation || word.name
    }

    if (lang === 'hapin') {
      if (/[\u0400-\u04FF]/.test(word.notation || '')) {
        return word.notation || ''
      }

      return word.trans[2]
    }

    return word.name
  }, [lang, word.name, word.notation, word.trans])

  const { play, stop, isPlaying } = usePronunciationSound(currentWord)

  const playSound = useCallback(() => {
    stop()
    play()
  }, [play, stop])

  useImperativeHandle(
    ref,
    () => ({
      play: playSound,
    }),
    [playSound],
  )

  return (
    <SoundIcon
      animated={isPlaying}
      onClick={playSound}
      className={clsx('cursor-pointer text-text-faint transition-colors duration-150 hover:text-accent-primary', className)}
      iconClassName={iconClassName}
    />
  )
}
 
