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
      <div className="flex flex-wrap items-center gap-2">
        {tagList.map((option) => {
          const isChecked = currentTag === option

          return (
            <RadioGroup.Item
              key={option}
              value={option}
              className={clsx(
                'my-focus-ring cursor-pointer whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors duration-150',
                isChecked
                  ? 'border-[var(--accent-primary)] bg-[var(--accent-primary-soft)] text-[var(--text-strong)]'
                  : 'border-[var(--border-main)] bg-[var(--bg-panel)] text-[var(--text-muted)] hover:bg-[var(--bg-ghost)] hover:text-[var(--text-strong)]',
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
