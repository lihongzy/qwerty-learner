import { EXPLICIT_SPACE } from "@/constants"
import { fontSizeConfigAtom } from "@/store"
import clsx from "clsx"
import { useAtomValue } from "jotai"
import { memo } from "react"

export type LetterState = 'normal' | 'correct' | 'wrong'

const stateClassNameMap: Record<string, Record<LetterState, string>> = {
    true: {
        normal: 'text-gray-400',
        correct: 'text-green-400',
        wrong: 'text-red-400 '
    },
    false: {
        normal: 'text-gray-600',
        correct: 'text-green-600',
        wrong: 'text-red-600'
    }
}

export type LetterProps = {
    letter: string
    state?: LetterState
    visible?: boolean
}

export const Letter = memo(({ letter, state = 'normal', visible = true }: LetterProps) => {
  const fontSizeConfig = useAtomValue(fontSizeConfigAtom)

  return (
    <span
      className={clsx('m-0 p-0 font-mono font-normal duration-0', stateClassNameMap[String(letter === EXPLICIT_SPACE)][state])}
      style={{ fontSize: `${fontSizeConfig.foreignFont}px` }}
    >
      {visible ? letter : '_'}
    </span>
  )
})
