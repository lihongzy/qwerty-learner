import clsx from 'clsx'
import { useAtomValue } from 'jotai'
import { isTextSelectableAtom, phoneticConfigAtom } from '@/shared/state'
import { Word, WordWithIndex } from '@/typings'

export type PhoneticProps = {
  word: WordWithIndex | Word
}

export const Phonetic = ({ word }: PhoneticProps) => {
  const phoneticConfig = useAtomValue(phoneticConfigAtom)
  const isTextSelectable = useAtomValue(isTextSelectableAtom)

  return (
    <div
      className={clsx('space-x-5 text-center text-sm font-normal text-gray-600 transition-colors duration-300', {
        'select-all': isTextSelectable,
      })}
    >
      {phoneticConfig.type === 'us' && word.usphone && word.usphone.length > 1 && <span>{`AmE:[${word.usphone}]`}</span>}
      {phoneticConfig.type === 'uk' && word.ukphone && word.ukphone.length > 1 && <span>{`BrE:${word.ukphone}`}</span>}
    </div>
  )
}
