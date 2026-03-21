import { Layout } from '@/components/Layout'
import { Dictionary, LanguageCategoryType } from '@/typings/resource'
import { createContext, useCallback, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router'
import { Updater, useImmer } from 'use-immer'
import IconX from '~icons/tabler/x'
import { LanguageTabSwitcher } from './LanguageTabSwitcher'
import DictRequest from './DictRequest'
import { ScrollArea } from 'radix-ui'
import IconInfo from '~icons/ic/outline-info'
import { dictionaries } from '@/resources/dictionary'
import DictionaryGroup from './DictionaryGroup'


function appendToGroup<T>(groups: Record<string, T[]>, key: string, value: T) {
  ;(groups[key] ??= []).push(value)
}

// 按单个分组键聚合数组元素，常用于把词典按分类、语言等字段分组。
 function groupBy<T>(elements: T[], iteratee: (value: T) => string) {
  return elements.reduce<Record<string, T[]>>((groups, value) => {
    appendToGroup(groups, iteratee(value), value)
    return groups
  }, Object.create(null) as Record<string, T[]>)
}

// 一个词典可能同时带有多个标签，所以这里会把同一个词典分发到多个 tag 分组里。
 function groupByDictTags(dicts: Dictionary[]) {
  return dicts.reduce<Record<string, Dictionary[]>>((groups, dict) => {
    dict.tags.forEach((tag) => {
      appendToGroup(groups, tag, dict)
    })

    return groups
  }, Object.create(null) as Record<string, Dictionary[]>)
}




export type GalleryState = {
  currentLanguageTab: LanguageCategoryType
}
export const GalleryContext = createContext<{
  state: GalleryState
  setState: Updater<GalleryState>
} | null>(null)

const initialGalleryState: GalleryState = {
  currentLanguageTab: 'en',
}
const GalleryNPage = () => {
  const [galleryState, setGalleryState] = useImmer<GalleryState>(initialGalleryState)

  const navigate = useNavigate()
  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  useHotkeys('enter,esc', onBack, { preventDefault: true })

  const { groupedByCategoryAndTag } = useMemo(() => {
    const currentLanguageCategoryDicts = dictionaries.filter((dict) => dict.languageCategory === galleryState.currentLanguageTab)
    const groupedByCategory = Object.entries(groupBy(currentLanguageCategoryDicts, (dict) => dict.category))
    const groupedByCategoryAndTag = groupedByCategory.map(
      ([category, dicts]) => [category, groupByDictTags(dicts)] as [string, Record<string, Dictionary[]>],
    )

    return {
      groupedByCategoryAndTag,
    }
  }, [galleryState.currentLanguageTab])

  return (
    <Layout>
      <GalleryContext.Provider value={{ state: galleryState, setState: setGalleryState }}>
        <div className="relative mt-auto mb-auto flex w-full flex-1 flex-col overflow-y-auto pl-20">
          <IconX className="absolute top-10 right-20 mr-2 h-7 w-7 cursor-pointer text-gray-400" onClick={onBack} />
          <div className="mt-20 flex w-full flex-1 flex-col items-center justify-center overflow-y-auto">
            <div className="flex h-full flex-col overflow-y-auto">
              <div className="flex h-20 w-full items-center justify-between pr-20 pb-6">
                <LanguageTabSwitcher />
                <DictRequest />
              </div>
              <ScrollArea.Root className="flex-1 overflow-y-auto">
                <ScrollArea.Viewport className="h-full w-full">
                  <div className="mr-4 flex flex-1 flex-col items-start justify-start gap-14 overflow-y-auto">
                    {groupedByCategoryAndTag.map(([category, groupeByTag]) => (
                      <DictionaryGroup key={category} groupedDictsByTag={groupeByTag} />
                    ))}
                  </div>

                  <div className="flex items-center justify-center pt-[20rem] pb-10 text-gray-500">
                    <IconInfo className="mr-1 h-5 w-5" />
                    <p className="mr-5 w-10/12 text-xs">
                      本项目的词典数据来自多个开源项目以及社区贡献者的无偿提供。我们深感感激并尊重每一位贡献者的知识产权。
                      这些数据仅供个人学习和研究使用，严禁用于任何商业目的。如果你是数据的版权所有者，并且认为我们的使用方式侵犯了你的权利，请通过网站底部的电子邮件与我们联系。一旦收到有效的版权投诉，我们将在最短的时间内删除相关内容或寻求必要的许可。
                      同时，我们也鼓励所有使用这些数据的人尊重版权所有者的权利，并且在使用这些数据时遵守所有相关的法律和规定。
                      请注意，虽然我们尽力确保所有数据的合法性和准确性，但我们不能对任何数据的准确性、完整性、合法性或可靠性做出任何保证。使用这些数据的风险完全由用户自己承担。
                    </p>
                  </div>
                </ScrollArea.Viewport>
                 <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent " orientation="vertical"></ScrollArea.Scrollbar>
              </ScrollArea.Root>
            </div>
          </div>
        </div>
      </GalleryContext.Provider>
    </Layout>
  )
}
export default GalleryNPage
