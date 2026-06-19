import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LANG_PRON_MAP } from '@/shared/resources/soundResource';
import { selectCurrentDictInfo, usePracticeSessionStore, useSharedPreferencesStore } from '@/shared/stores';
import { useTypingPreferencesStore } from '@/pages/typing/stores';
import type { PronunciationType } from '@/shared/types';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

const PRONUNCIATION_PHONETIC_MAP: Partial<Record<PronunciationType, PronunciationType>> = {
  us: 'us',
  uk: 'uk',
  romaji: 'romaji',
  zh: 'zh',
  ja: 'ja',
  de: 'de',
  hapin: 'hapin',
  kk: 'kk',
  id: 'id',
};

const PronunciationSwitcherComponent = () => {
  const [open, setOpen] = useState(false);
  const currentDictId = usePracticeSessionStore((s) => s.currentDictId);
  const currentDictInfo = useMemo(() => selectCurrentDictInfo(currentDictId), [currentDictId]);
  const pronunciationConfig = useTypingPreferencesStore((s) => s.pronunciationConfig);
  const setPronunciationConfig = useTypingPreferencesStore((s) => s.setPronunciationConfig);
  const phoneticConfig = useSharedPreferencesStore((s) => s.phoneticConfig);
  const setPhoneticConfig = useSharedPreferencesStore((s) => s.setPhoneticConfig);

  const pronunciationList = useMemo(
    () => LANG_PRON_MAP[currentDictInfo.language].pronunciation,
    [currentDictInfo.language],
  );

  useEffect(() => {
    const defaultPronIndex =
      currentDictInfo.defaultPronIndex ?? LANG_PRON_MAP[currentDictInfo.language].defaultPronIndex;
    const defaultPron = pronunciationList[defaultPronIndex];
    if (pronunciationList.findIndex((item) => item.pron === pronunciationConfig.type) === -1 && defaultPron) {
      setPronunciationConfig((old) => ({ ...old, type: defaultPron.pron, name: defaultPron.name }));
    }
  }, [
    currentDictInfo.defaultPronIndex,
    currentDictInfo.language,
    pronunciationConfig.type,
    pronunciationList,
    setPronunciationConfig,
  ]);

  useEffect(() => {
    const phoneticType = PRONUNCIATION_PHONETIC_MAP[pronunciationConfig.type];
    if (phoneticType) setPhoneticConfig((old) => ({ ...old, type: phoneticType }));
  }, [pronunciationConfig.type, setPhoneticConfig]);

  const onChangePronunciationType = useCallback(
    (value: string) => {
      const item = pronunciationList.find((p) => p.pron === value);
      if (item) setPronunciationConfig((old) => ({ ...old, type: item.pron, name: item.name }));
    },
    [pronunciationList, setPronunciationConfig],
  );

  const currentLabel = pronunciationConfig.isOpen ? pronunciationConfig.name : '关闭';
  const canUseSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;

  return (
    <div className="relative inline-flex">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              className="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 min-w-12 items-center justify-center rounded-md px-2 text-sm transition-colors"
              onClick={() => setOpen((v) => !v)}
            >
              {currentLabel}
            </button>
          </TooltipTrigger>
          <TooltipContent>发音与音标</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="bg-popover absolute top-full left-1/2 z-40 mt-2 w-72 -translate-x-1/2 rounded-lg border p-4 shadow-md">
            <div className="flex flex-col gap-4">
              <SettingRow
                label="音标"
                checked={phoneticConfig.isOpen}
                onCheckedChange={(v) => setPhoneticConfig((old) => ({ ...old, isOpen: v }))}
              />
              <SettingRow
                label="单词发音"
                checked={pronunciationConfig.isOpen}
                onCheckedChange={(v) => setPronunciationConfig((old) => ({ ...old, isOpen: v }))}
              />

              {canUseSpeechSynthesis && (
                <SettingRow
                  label="释义朗读"
                  checked={pronunciationConfig.isTransRead}
                  onCheckedChange={(v) => setPronunciationConfig((old) => ({ ...old, isTransRead: v }))}
                />
              )}

              {pronunciationConfig.isOpen && (
                <div className="flex flex-col gap-4 rounded-lg border p-3">
                  <SettingRow
                    label="循环发音"
                    checked={pronunciationConfig.isLoop}
                    onCheckedChange={(v) => setPronunciationConfig((old) => ({ ...old, isLoop: v }))}
                  />

                  <div className="flex flex-col gap-2">
                    <span className="text-sm">发音类型</span>
                    <Select value={pronunciationConfig.type} onValueChange={onChangePronunciationType}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="选择发音类型" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {pronunciationList.map((item) => (
                          <SelectItem key={item.pron} value={item.pron}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

function SettingRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export const PronunciationSwitcher = memo(PronunciationSwitcherComponent);
export default PronunciationSwitcher;
