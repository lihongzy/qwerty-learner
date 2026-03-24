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
    <RadioGroup.Root value={currentTag} onValueChange={onChangeTag} className="w-full">
      <div className="flex flex-wrap items-center gap-2">
        {tagList.map((option) => {
          const isChecked = currentTag === option

          return (
            <RadioGroup.Item
              key={option}
              value={option}
              className={clsx(
                'my-focus-ring inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-150',
                isChecked
                  ? 'border-accent-primary bg-accent-primary-soft text-text-strong'
                  : 'border-border-main bg-bg-panel text-text-muted hover:border-accent-primary hover:text-text-strong',
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
