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
  return elements.reduce<Record<string, T[]>>((groups, value) => {
    appendToGroup(groups, iteratee(value), value)
    return groups
  }, Object.create(null) as Record<string, T[]>)
}

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
        <div className="w-full px-4 pb-8 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-2">
                <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[var(--text-faint)]">
                  Dictionary Browser
                </span>
                <div>
                  <h1 className="text-[1.85rem] font-semibold tracking-tight text-[var(--text-strong)] sm:text-[2.2rem]">词库浏览</h1>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                    按语言、分类和标签浏览词库，查看章节规模、练习进度与错误记录，快速进入下一轮练习。
                  </p>
                </div>
              </div>

              <button type="button" className="my-btn-secondary my-focus-ring inline-flex gap-2 self-start px-4 sm:self-auto" onClick={onBack}>
                <IconArrowLeft className="h-4.5 w-4.5" />
                返回练习
              </button>
            </div>

            <div className="mb-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <LanguageTabSwitcher />
              <DictRequest />
            </div>

            <section className="my-panel relative px-3 py-3 sm:px-4 sm:py-4">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_24%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_16%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.06),transparent_24%)]" />

              <div className="relative mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">Current Language</div>
                  <div className="mt-1 text-base font-semibold tracking-tight text-[var(--text-strong)]">
                    共 {currentLanguageDicts.length} 个词库，按分类与标签分组展示
                  </div>
                </div>
              </div>

              <div className="relative flex flex-col gap-10 pb-4">
                {groupedByCategoryAndTag.map(([category, groupedByTag]) => (
                  <DictionaryGroup key={category} category={category} groupedDictsByTag={groupedByTag} />
                ))}

                <div className="my-control-shell flex items-start gap-3 px-4 py-3 text-sm leading-6 text-[var(--text-muted)]">
                  <IconInfo className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[var(--accent-primary)]" />
                  <p>
                    本项目词库数据来自多个开源项目与社区贡献，仅用于个人学习和研究。如涉及版权问题，请通过项目公开渠道联系维护者处理。
                  </p>
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