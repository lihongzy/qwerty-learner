import clsx from 'clsx'
import { RadioGroup } from 'radix-ui'
import { useCallback } from 'react'

type Props = {
  tagList: string[]
  currentTag: string
  onChangeCurrentTag: (tag: string) => void
}

export default function DictTagSwitcher({ tagList, currentTag, onChangeCurrentTag }: Props) {
  const onChangeTag = useCallback(
    (tag: string) => {
      onChangeCurrentTag(tag)
    },
    [onChangeCurrentTag],
  )

  return (
    <RadioGroup.Root value={currentTag} onValueChange={onChangeTag}>
      <div className="flex items-center gap-4">
        {tagList.map((option) => {
          const isChecked = currentTag === option

          return (
            <RadioGroup.Item
              key={option}
              value={option}
              className={clsx(
                'cursor-pointer whitespace-nowrap rounded-[3rem] px-4 py-2 font-normal outline-none transition-colors',
                isChecked
                  ? 'bg-indigo-400 text-white'
                  : 'bg-white text-gray-600 hover:bg-indigo-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-600',
              )}
            >
              {option}
            </RadioGroup.Item>
          )
        })}
      </div>
    </RadioGroup.Root>
  )
}
