import type { Dictionary } from '@/shared/types/resource'
import { useCallback, useEffect, useMemo, useState } from 'react'
import DictTagSwitcher from './DictTagSwitcher'
import DictionaryComponent from './DictionaryComponent'

type DictionaryGroupProps = {
  category: string
  groupedDictsByTag: Record<string, Dictionary[]>
}

export default function DictionaryGroup({ category, groupedDictsByTag }: DictionaryGroupProps) {
  const tagList = useMemo(() => Object.keys(groupedDictsByTag), [groupedDictsByTag])
  const [currentTag, setCurrentTag] = useState(tagList.length > 0 ? tagList[0] : '')

  useEffect(() => {
    if (tagList.length === 0) {
      setCurrentTag('')
      return
    }

    if (!tagList.includes(currentTag)) {
      setCurrentTag(tagList[0])
    }
  }, [currentTag, tagList])

  const onChangeCurrentTag = useCallback((tag: string) => {
    setCurrentTag(tag)
  }, [])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="text-text-faint text-[0.68rem] font-semibold uppercase tracking-[0.24em]">{category}</div>
          <div className="text-text-strong mt-1 text-lg font-semibold tracking-tight sm:text-xl">按标签筛选词库</div>
        </div>

        {tagList.length > 0 ? (
          <div className="my-control-shell max-w-full px-2 py-2">
            <DictTagSwitcher tagList={tagList} currentTag={currentTag} onChangeCurrentTag={onChangeCurrentTag} />
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        {currentTag && groupedDictsByTag[currentTag] ? (
          groupedDictsByTag[currentTag].map((dict) => <DictionaryComponent key={dict.id} dictionary={dict} />)
        ) : (
          <div className="col-span-full rounded-app-md border border-border-main bg-bg-elevated px-4 py-5 text-center text-sm text-text-muted">
            当前分类下没有可用的词库
          </div>
        )}
      </div>
    </section>
  )
}
