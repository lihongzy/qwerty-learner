import { Dictionary } from '@/typings/resource'
import { useCallback, useMemo, useState } from 'react'
import DictTagSwitcher from './DictTagSwitcher'
import DictionaryComponent from './DictionaryComponent'

export default function DictionaryGroup({ groupedDictsByTag }: { groupedDictsByTag: Record<string, Dictionary[]> }) {
  const tagList = useMemo(() => Object.keys(groupedDictsByTag), [groupedDictsByTag])
  const [currentTag, setCurrentTag] = useState(tagList.length > 0 ? tagList[0] : '')
  const onChangeCurrentTag = useCallback((tag: string) => {
    setCurrentTag(tag)
  }, [])
  return (
    <div>
      <DictTagSwitcher tagList={tagList} currentTag={currentTag} onChangeCurrentTag={onChangeCurrentTag} />
      <div className="dic3:grid-cols-3 dic4:grid-cols-4 mt-8 grid gap-x-5 gap-y-10 px-1 pb-4 sm:grid-cols-1 md:grid-cols-2">
        {currentTag && groupedDictsByTag[currentTag] ? (
          groupedDictsByTag[currentTag].map((dict) => <DictionaryComponent key={dict.id} dictionary={dict} />)
        ) : (
          <div className="col-span-full text-center text-gray-500">当前分类下没有可用的词典</div>
        )}
      </div>
    </div>
  )
}
