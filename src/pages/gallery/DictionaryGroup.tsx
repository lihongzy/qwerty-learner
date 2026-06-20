import type { Dictionary } from '@/shared/types/resource';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DictTagSwitcher from './DictTagSwitcher';
import DictionaryComponent from './DictionaryComponent';

type DictionaryGroupProps = {
  category: string;
  groupedDictsByTag: Record<string, Dictionary[]>;
};

export default function DictionaryGroup({ category, groupedDictsByTag }: DictionaryGroupProps) {
  const tagList = useMemo(() => Object.keys(groupedDictsByTag), [groupedDictsByTag]);
  const [currentTag, setCurrentTag] = useState(tagList.length > 0 ? tagList[0] : '');

  useEffect(() => {
    if (tagList.length === 0) {
      setCurrentTag('');
      return;
    }
    if (!tagList.includes(currentTag)) {
      setCurrentTag(tagList[0]);
    }
  }, [currentTag, tagList]);

  const onChangeCurrentTag = useCallback((tag: string) => setCurrentTag(tag), []);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <div className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">{category}</div>
          <div className="mt-1 text-lg font-semibold sm:text-xl">按标签筛选词库</div>
        </div>

        {tagList.length > 0 && (
          <div className="max-w-full">
            <DictTagSwitcher tagList={tagList} currentTag={currentTag} onChangeCurrentTag={onChangeCurrentTag} />
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {currentTag && groupedDictsByTag[currentTag] ? (
          groupedDictsByTag[currentTag].map((dict) => <DictionaryComponent key={dict.id} dictionary={dict} />)
        ) : (
          <div className="text-muted-foreground col-span-full rounded-lg border p-5 text-center text-sm">
            当前分类下没有可用的词库
          </div>
        )}
      </div>
    </section>
  );
}
