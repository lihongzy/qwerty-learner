import { currentDictInfoAtom } from '@/store'
import { useAtomValue } from 'jotai'
import { type ChangeEvent, useMemo } from 'react'
import { KeyEventHandler } from '../KeyEventHandler'

export type WordAddAction = {
  type: 'add'
  value: string
  event: ChangeEvent | globalThis.KeyboardEvent
}

export type WordDeleteAction = {
  type: 'delete'
  length: number
}

export type WordComposeAction = {
  type: 'compose'
  value: string
}

export type WordUpdateAction = WordAddAction | WordDeleteAction | WordComposeAction

export const InputHandler = ({ updateInput }: { updateInput: (updateObj: WordUpdateAction) => void }) => {
  const dictInfo = useAtomValue(currentDictInfoAtom)

  const handler = useMemo(() => {
    switch (dictInfo.language) {
      case 'en':
        return <KeyEventHandler updateInput={updateInput} />
      default:
        return null
    }
  }, [dictInfo.language, updateInput])

  return <>{handler}</>
}
