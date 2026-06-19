import { GalleryContext } from '.';
import codeFlag from '@/assets/flags/code.png';
import enFlag from '@/assets/flags/en.png';
import type { LanguageCategoryType } from '@/shared/types/resource';
import { useCallback, useContext } from 'react';

const options = [
  { id: 'en' as LanguageCategoryType, name: '英语', flag: enFlag },
  { id: 'code' as LanguageCategoryType, name: 'Code', flag: codeFlag },
];

export function LanguageTabSwitcher() {
  const { state, setState } = useContext(GalleryContext)!;

  const onChangeTab = useCallback(
    (tab: LanguageCategoryType) => {
      setState((draft) => {
        draft.currentLanguageTab = tab;
      });
    },
    [setState],
  );

  return (
    <div className="flex flex-wrap items-center gap-2 px-2 py-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChangeTab(option.id)}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            state.currentLanguageTab === option.id
              ? 'bg-muted'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <img src={option.flag} alt={`${option.name} flag`} className="h-5 w-5 rounded-full object-cover" />
          <span>{option.name}</span>
        </button>
      ))}
    </div>
  );
}
