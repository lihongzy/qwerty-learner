import type { Dictionary } from '@/shared/types/resource'
import { useCallback, useMemo, useState } from 'react'
import DictTagSwitcher from './DictTagSwitcher'
import DictionaryComponent from './DictionaryComponent'

type DictionaryGroupProps = {
  category: string
  groupedDictsByTag: Record<string, Dictionary[]>
}

export default function DictionaryGroup({ category, groupedDictsByTag }: DictionaryGroupProps) {
  const tagList = useMemo(() => Object.keys(groupedDictsByTag), [groupedDictsByTag])
  const [currentTag, setCurrentTag] = useState(tagList.length > 0 ? tagList[0] : '')
  const onChangeCurrentTag = useCallback((tag: string) => {
    setCurrentTag(tag)
  }, [])

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div>
          <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[var(--text-faint)]">{category}</div>
          <div className="mt-1 text-xl font-semibold tracking-tight text-[var(--text-strong)]">按标签浏览当前分类词库</div>
        </div>
        <DictTagSwitcher tagList={tagList} currentTag={currentTag} onChangeCurrentTag={onChangeCurrentTag} />
      </div>

      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
        {currentTag && groupedDictsByTag[currentTag] ? (
          groupedDictsByTag[currentTag].map((dict) => <DictionaryComponent key={dict.id} dictionary={dict} />)
        ) : (
          <div className="col-span-full my-control-shell px-4 py-5 text-center text-sm text-[var(--text-muted)]">当前分类下没有可用的词库</div>
        )}
      </div>
    </section>
  )
}
