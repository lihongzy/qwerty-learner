import { useTypingSoundStore } from '@/pages/typing/stores';
import { Switch } from '@/components/ui/switch';
import { useCallback, useState } from 'react';
import IconSpeakerWave from '~icons/heroicons/speaker-wave-solid';

type SettingRowProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const SettingRow = ({ label, checked, onCheckedChange }: SettingRowProps) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-sm">{label}</span>
    <Switch checked={checked} onCheckedChange={onCheckedChange} />
  </div>
);

export default function SoundSwitcher() {
  const [open, setOpen] = useState(false);

  const keySoundsConfig = useTypingSoundStore((s) => s.keySoundsConfig);
  const setKeySoundsConfig = useTypingSoundStore((s) => s.setKeySoundsConfig);
  const hintSoundsConfig = useTypingSoundStore((s) => s.hintSoundsConfig);
  const setHintSoundsConfig = useTypingSoundStore((s) => s.setHintSoundsConfig);

  const onChangeKeySound = useCallback(
    (checked: boolean) => setKeySoundsConfig((old) => ({ ...old, isOpen: checked })),
    [setKeySoundsConfig],
  );

  const onChangeHintSound = useCallback(
    (checked: boolean) => setHintSoundsConfig((old) => ({ ...old, isOpen: checked })),
    [setHintSoundsConfig],
  );

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-0.5 text-lg transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-label="声音设置"
      >
        <IconSpeakerWave />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="bg-popover absolute top-full left-1/2 z-40 mt-2 w-48 -translate-x-1/2 rounded-lg border p-4 shadow-md">
            <div className="flex flex-col gap-4">
              <SettingRow label="按键音" checked={keySoundsConfig.isOpen} onCheckedChange={onChangeKeySound} />
              <SettingRow label="提示音" checked={hintSoundsConfig.isOpen} onCheckedChange={onChangeHintSound} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
