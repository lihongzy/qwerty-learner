import { Layout } from '@/app/layout/Layout'
import { dictionaries } from '@/shared/resources/dictionary'
import type { Dictionary, LanguageCategoryType } from '@/shared/types/resource'
import { createContext, useCallback, useMemo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router'
import { Updater, useImmer } from 'use-immer'
import IconInfo from '~icons/ic/outline-info'
import IconArrowLeft from '~icons/tabler/arrow-left'
import DictRequest from './DictRequest'
import DictionaryGroup from './DictionaryGroup'
import { LanguageTabSwitcher } from './LanguageTabSwitcher'

function appendToGroup<T>(groups: Record<string, T[]>, key: string, value: T) {
  ;(groups[key] ??= []).push(value)
}

function groupBy<T>(elements: T[], iteratee: (value: T) => string) {
  return elements.reduce<Record<string, T[]>>(
    (groups, value) => {
      appendToGroup(groups, iteratee(value), value)
      return groups
    },
    Object.create(null) as Record<string, T[]>,
  )
}

function groupByDictTags(dicts: Dictionary[]) {
  return dicts.reduce<Record<string, Dictionary[]>>(
    (groups, dict) => {
      dict.tags.forEach((tag) => {
        appendToGroup(groups, tag, dict)
      })

      return groups
    },
    Object.create(null) as Record<string, Dictionary[]>,
  )
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

const GalleryPage = () => {
  const [galleryState, setGalleryState] = useImmer<GalleryState>(initialGalleryState)

  const navigate = useNavigate()
  const onBack = useCallback(() => {
    navigate('/')
  }, [navigate])

  useHotkeys('enter,esc', onBack, { preventDefault: true })

  const { groupedByCategoryAndTag, currentLanguageDicts } = useMemo(() => {
    const currentLanguageCategoryDicts = dictionaries.filter((dict) => dict.languageCategory === galleryState.currentLanguageTab)
    const groupedByCategory = Object.entries(groupBy(currentLanguageCategoryDicts, (dict) => dict.category))
    const groupedByCategoryAndTag = groupedByCategory.map(
      ([category, dicts]) => [category, groupByDictTags(dicts)] as [string, Record<string, Dictionary[]>],
    )

    return {
      currentLanguageDicts: currentLanguageCategoryDicts,
      groupedByCategoryAndTag,
    }
  }, [galleryState.currentLanguageTab])

  return (
    <Layout>
      <GalleryContext.Provider value={{ state: galleryState, setState: setGalleryState }}>
        <div className="w-full px-4 pt-6 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <h1 className="text-text-strong text-[1.85rem] font-semibold tracking-tight sm:text-[2.2rem]">词库浏览</h1>

              <button
                type="button"
                className="border-border-main bg-bg-panel text-text-main shadow-app-soft hover:border-accent-primary hover:text-text-strong focus-visible:ring-accent-cool/40 inline-flex gap-2 self-start rounded-md border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 sm:self-auto"
                onClick={onBack}
              >
                <IconArrowLeft className="h-4.5 w-4.5" />
                返回练习
              </button>
            </div>

            <div className="mb-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <LanguageTabSwitcher />
              <DictRequest />
            </div>

            <section className="rounded-app-md border-border-main bg-bg-panel shadow-app-soft relative border px-3 py-3 sm:px-4 sm:py-4">
              <div className="relative mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-text-faint text-[0.68rem] font-semibold tracking-[0.24em] uppercase">Current Language</div>
                  <div className="text-text-strong mt-1 text-base font-semibold tracking-tight">
                    共 {currentLanguageDicts.length} 个词库，按分类与标签分组展示
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col gap-10 pb-4">
                {groupedByCategoryAndTag.map(([category, groupedByTag]) => (
                  <DictionaryGroup key={category} category={category} groupedDictsByTag={groupedByTag} />
                ))}

                <div className="rounded-app-md border-border-main bg-bg-elevated text-text-muted flex items-start gap-3 border px-4 py-3 text-sm leading-6">
                  <IconInfo className="text-accent-primary mt-0.5 h-4.5 w-4.5 shrink-0" />
                  <p>本项目词库数据来自多个开源项目与社区贡献，仅用于个人学习和研究。如涉及版权问题，请通过项目公开渠道联系维护者处理。</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </GalleryContext.Provider>
    </Layout>
  )
}

export default GalleryPage
