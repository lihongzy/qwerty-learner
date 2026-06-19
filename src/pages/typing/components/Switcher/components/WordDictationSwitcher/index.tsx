import { useTypingPreferencesStore } from '@/pages/typing/stores';
import type { WordDictationType } from '@/shared/types';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCallback, useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import IconEyeSlash from '~icons/heroicons/eye-slash-solid';
import IconEye from '~icons/heroicons/eye-solid';

const wordDictationTypeList: { name: string; type: WordDictationType }[] = [
  { name: '隐藏全部字母', type: 'hideAll' },
  { name: '隐藏元音', type: 'hideVowel' },
  { name: '隐藏辅音', type: 'hideConsonant' },
  { name: '随机隐藏字母', type: 'randomHide' },
];

export default function WordDictationSwitcher() {
  const [open, setOpen] = useState(false);
  const wordDictationConfig = useTypingPreferencesStore((s) => s.wordDictationConfig);
  const setWordDictationConfig = useTypingPreferencesStore((s) => s.setWordDictationConfig);

  const currentType = useMemo(
    () => wordDictationTypeList.find((item) => item.type === wordDictationConfig.type) || wordDictationTypeList[0],
    [wordDictationConfig.type],
  );

  const onToggleWordDictation = useCallback(
    (checked?: boolean) => {
      setWordDictationConfig((old) => {
        const nextIsOpen = checked ?? !old.isOpen;
        return { ...old, isOpen: nextIsOpen, openBy: nextIsOpen ? 'user' : old.openBy };
      });
    },
    [setWordDictationConfig],
  );

  const onChangeWordDictationType = useCallback(
    (value: string) => {
      setWordDictationConfig((old) => ({ ...old, type: value as WordDictationType }));
    },
    [setWordDictationConfig],
  );

  useHotkeys('ctrl+shift+d', () => onToggleWordDictation(), { enableOnFormTags: true, preventDefault: true }, [
    onToggleWordDictation,
  ]);

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className={`hover:bg-muted rounded-md p-0.5 text-lg transition-colors ${wordDictationConfig.isOpen ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="切换听写模式"
      >
        {wordDictationConfig.isOpen ? <IconEye /> : <IconEyeSlash />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="bg-popover absolute top-full left-1/2 z-40 mt-2 w-56 -translate-x-1/2 rounded-lg border p-4 shadow-md">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm">听写模式</span>
                <Switch checked={wordDictationConfig.isOpen} onCheckedChange={onToggleWordDictation} />
              </div>

              {wordDictationConfig.isOpen && (
                <Select value={currentType.type} onValueChange={onChangeWordDictationType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="选择听写模式" />
                  </SelectTrigger>
                  <SelectContent position="popper">
                    {wordDictationTypeList.map((item) => (
                      <SelectItem key={item.type} value={item.type}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
