import { Layout } from '@/app/layout/Layout';
import { Button } from '@/components/ui/button';
import { dictionaries } from '@/shared/resources/dictionary';
import type { Dictionary, LanguageCategoryType } from '@/shared/types/resource';
import { createContext, useCallback, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useNavigate } from 'react-router';
import { Updater, useImmer } from 'use-immer';
import IconInfo from '~icons/ic/outline-info';
import IconArrowLeft from '~icons/tabler/arrow-left';
import DictRequest from './DictRequest';
import DictionaryGroup from './DictionaryGroup';
import { LanguageTabSwitcher } from './LanguageTabSwitcher';

function appendToGroup<T>(groups: Record<string, T[]>, key: string, value: T) {
  (groups[key] ??= []).push(value);
}

function groupBy<T>(elements: T[], iteratee: (value: T) => string) {
  return elements.reduce<Record<string, T[]>>(
    (groups, value) => {
      appendToGroup(groups, iteratee(value), value);
      return groups;
    },
    Object.create(null) as Record<string, T[]>,
  );
}

function groupByDictTags(dicts: Dictionary[]) {
  return dicts.reduce<Record<string, Dictionary[]>>(
    (groups, dict) => {
      dict.tags.forEach((tag) => appendToGroup(groups, tag, dict));
      return groups;
    },
    Object.create(null) as Record<string, Dictionary[]>,
  );
}

export type GalleryState = {
  currentLanguageTab: LanguageCategoryType;
};

export const GalleryContext = createContext<{
  state: GalleryState;
  setState: Updater<GalleryState>;
} | null>(null);

const initialGalleryState: GalleryState = {
  currentLanguageTab: 'en',
};

const GalleryPage = () => {
  const [galleryState, setGalleryState] = useImmer<GalleryState>(initialGalleryState);
  const navigate = useNavigate();
  const onBack = useCallback(() => navigate('/'), [navigate]);
  useHotkeys('esc', onBack, { preventDefault: true });

  const { groupedByCategoryAndTag, currentLanguageDicts } = useMemo(() => {
    const filtered = dictionaries.filter((dict) => dict.languageCategory === galleryState.currentLanguageTab);
    const grouped = Object.entries(groupBy(filtered, (dict) => dict.category)).map(
      ([category, dicts]) => [category, groupByDictTags(dicts)] as [string, Record<string, Dictionary[]>],
    );
    return { currentLanguageDicts: filtered, groupedByCategoryAndTag: grouped };
  }, [galleryState.currentLanguageTab]);

  return (
    <Layout>
      <GalleryContext.Provider value={{ state: galleryState, setState: setGalleryState }}>
        <div className="w-full px-4 pt-6 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <h1 className="text-2xl font-semibold sm:text-3xl">词库浏览</h1>
              <Button variant="outline" onClick={onBack}>
                <IconArrowLeft />
                返回练习
              </Button>
            </div>

            <div className="mb-4 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <LanguageTabSwitcher />
              <DictRequest />
            </div>

            <section className="relative rounded-lg border px-3 py-3 sm:px-4 sm:py-4">
              <div className="relative mb-3 text-base font-semibold">共 {currentLanguageDicts.length} 个词库</div>

              <div className="relative flex flex-col gap-10 pb-4">
                {groupedByCategoryAndTag.map(([category, groupedByTag]) => (
                  <DictionaryGroup key={category} category={category} groupedDictsByTag={groupedByTag} />
                ))}

                <div className="text-muted-foreground flex items-start gap-3 rounded-lg border p-4 text-sm">
                  <IconInfo className="text-primary mt-0.5 h-4.5 w-4.5 shrink-0" />
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
  );
};

export default GalleryPage;
