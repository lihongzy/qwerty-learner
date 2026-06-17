import { useTypingPreferencesStore } from '@/pages/typing/stores';
import type { WordDictationType } from '@/shared/types';
import { Popover, Select, Switch } from 'radix-ui';
import { useCallback, useMemo } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import IconEyeSlash from '~icons/heroicons/eye-slash-solid';
import IconEye from '~icons/heroicons/eye-solid';
import IconCheck from '~icons/tabler/check';
import IconChevronDown from '~icons/tabler/chevron-down';

const wordDictationTypeList: { name: string; type: WordDictationType }[] = [
  { name: '隐藏全部字母', type: 'hideAll' },
  { name: '隐藏元音', type: 'hideVowel' },
  { name: '隐藏辅音', type: 'hideConsonant' },
  { name: '随机隐藏字母', type: 'randomHide' },
];

const triggerClassName =
  'flex items-center justify-center rounded-md p-0.5 text-lg outline-none transition-colors duration-300 ease-in-out hover:bg-accent-primary-soft hover:text-accent-primary-hover data-[state=open]:bg-accent-primary data-[state=open]:text-white';

const switchRootClassName =
  'relative inline-flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border border-border-main bg-bg-elevated transition-colors duration-200 ease-in-out focus:outline-none data-[state=checked]:bg-accent-primary';

const switchThumbClassName =
  'pointer-events-none inline-block h-4 w-4 translate-x-0 rounded-full bg-bg-panel-strong shadow-app-soft ring-0 transition duration-200 ease-in-out data-[state=checked]:translate-x-[25px]';

const selectTriggerClassName =
  'flex h-10 w-36 items-center justify-between rounded-lg border border-border-main bg-bg-panel px-3 text-left text-sm text-text-strong shadow-app-soft transition-colors focus:outline-none';

const selectContentClassName = 'z-30 overflow-hidden rounded-md border border-border-main bg-bg-panel shadow-app-soft';
const selectViewportClassName = 'p-1';

const selectItemClassName =
  'relative flex cursor-pointer select-none items-center rounded-md py-2 pl-9 pr-8 text-sm text-text-main outline-none data-[highlighted]:bg-accent-primary-soft data-[highlighted]:text-text-strong';

type SettingRowProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const SettingRow = ({ label, checked, onCheckedChange }: SettingRowProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <span className="text-text-main text-sm leading-5 font-normal">{label}</span>
      <div className="flex w-full items-center justify-between">
        <Switch.Root checked={checked} onCheckedChange={onCheckedChange} className={switchRootClassName}>
          <Switch.Thumb className={switchThumbClassName} />
        </Switch.Root>
        <span className="text-text-muted text-right text-xs leading-tight font-normal">
          {checked ? '开启' : '关闭'}
        </span>
      </div>
    </div>
  );
};

export default function WordDictationSwitcher() {
  const wordDictationConfig = useTypingPreferencesStore((state) => state.wordDictationConfig);
  const setWordDictationConfig = useTypingPreferencesStore((state) => state.setWordDictationConfig);

  const currentType = useMemo(
    () => wordDictationTypeList.find((item) => item.type === wordDictationConfig.type) || wordDictationTypeList[0],
    [wordDictationConfig.type],
  );

  const onToggleWordDictation = useCallback(
    (checked?: boolean) => {
      setWordDictationConfig((old) => {
        const nextIsOpen = checked ?? !old.isOpen;
        return {
          ...old,
          isOpen: nextIsOpen,
          openBy: nextIsOpen ? 'user' : old.openBy,
        };
      });
    },
    [setWordDictationConfig],
  );

  const onChangeWordDictationType = useCallback(
    (value: string) => {
      setWordDictationConfig((old) => ({
        ...old,
        type: value as WordDictationType,
      }));
    },
    [setWordDictationConfig],
  );

  useHotkeys(
    'ctrl+shift+d',
    () => {
      onToggleWordDictation();
    },
    { enableOnFormTags: true, preventDefault: true },
    [onToggleWordDictation],
  );

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={`${triggerClassName} ${wordDictationConfig.isOpen ? 'text-accent-primary' : 'text-text-muted hover:text-text-strong'}`}
          type="button"
          aria-label="切换听写模式"
          title="切换听写模式"
          onFocus={(e) => e.currentTarget.blur()}
        >
          {wordDictationConfig.isOpen ? <IconEye className="my-icon" /> : <IconEyeSlash className="my-icon" />}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="center"
          className="border-border-main bg-bg-panel shadow-app-panel z-30 w-60 rounded-xl border p-4 outline-none select-none"
        >
          <div className="flex flex-col gap-4">
            <SettingRow label="听写模式" checked={wordDictationConfig.isOpen} onCheckedChange={onToggleWordDictation} />

            {wordDictationConfig.isOpen && (
              <div className="flex w-full flex-col items-start gap-2">
                <span className="text-text-main text-sm leading-5 font-normal">模式</span>

                <Select.Root value={currentType.type} onValueChange={onChangeWordDictationType}>
                  <Select.Trigger className={selectTriggerClassName} aria-label="选择听写模式">
                    <Select.Value placeholder="选择听写模式" />
                    <Select.Icon>
                      <IconChevronDown className="h-4 w-4" />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Portal>
                    <Select.Content position="popper" sideOffset={6} className={selectContentClassName}>
                      <Select.Viewport className={selectViewportClassName}>
                        {wordDictationTypeList.map((item) => (
                          <Select.Item key={item.type} value={item.type} className={selectItemClassName}>
                            <Select.ItemText>{item.name}</Select.ItemText>
                            <Select.ItemIndicator className="absolute left-3 inline-flex items-center">
                              <IconCheck className="h-4 w-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
