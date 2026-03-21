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
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      <Tabs.List aria-label="语言分类" className="flex items-center gap-4">
        {options.map((option) => (
          <Tabs.Trigger
            key={option.id}
            value={option.id}
            className={clsx(
              'cursor-pointer border-b-2 border-transparent px-2 pb-1 outline-none transition-colors',
              'data-[state=active]:border-indigo-500',
            )}
          >
            <span className="flex items-center">
              <img src={option.flag} alt={`${option.name} flag`} className="mr-1.5 h-7 w-7" />
              <span className="text-lg font-medium text-gray-700 dark:text-gray-200">{option.name}</span>
            </span>
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}
