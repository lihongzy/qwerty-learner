import { GalleryContext } from '.'
import codeFlag from '@/assets/flags/code.png'
import deFlag from '@/assets/flags/de.png'
import enFlag from '@/assets/flags/en.png'
import idFlag from '@/assets/flags/id.png'
import jpFlag from '@/assets/flags/ja.png'
import kkFlag from '@/assets/flags/kk.png'
import type { LanguageCategoryType } from '@/shared/types/resource'
import clsx from 'clsx'
import { Tabs } from 'radix-ui'
import { useCallback, useContext } from 'react'

export type LanguageTabOption = {
  id: LanguageCategoryType
  name: string
  flag: string
}

const options: LanguageTabOption[] = [
  { id: 'en', name: '英语', flag: enFlag },
  { id: 'ja', name: '日语', flag: jpFlag },
  { id: 'de', name: '德语', flag: deFlag },
  { id: 'kk', name: '哈萨克语', flag: kkFlag },
  { id: 'id', name: '印尼语', flag: idFlag },
  { id: 'code', name: 'Code', flag: codeFlag },
]

export function LanguageTabSwitcher() {
  const { state, setState } = useContext(GalleryContext)!

  const onChangeTab = useCallback(
    (tab: string) => {
      setState((draft) => {
        draft.currentLanguageTab = tab as LanguageCategoryType
      })
    },
    [setState],
  )

  return (
    <Tabs.Root value={state.currentLanguageTab} onValueChange={onChangeTab}>
      <Tabs.List aria-label="语言分类" className="my-control-shell flex flex-wrap items-center gap-2 px-2 py-2">
        {options.map((option) => (
          <Tabs.Trigger
            key={option.id}
            value={option.id}
            className={clsx(
              'my-focus-ring inline-flex items-center gap-2 rounded-[var(--radius-sm)] px-3 py-2 text-sm font-medium transition-colors duration-150',
              'text-[var(--text-muted)] data-[state=active]:bg-[var(--accent-primary-soft)] data-[state=active]:text-[var(--text-strong)]',
              'hover:bg-[var(--bg-ghost)] hover:text-[var(--text-strong)]',
            )}
          >
            <img src={option.flag} alt={`${option.name} flag`} className="h-5 w-5 rounded-full object-cover" />
            <span>{option.name}</span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}