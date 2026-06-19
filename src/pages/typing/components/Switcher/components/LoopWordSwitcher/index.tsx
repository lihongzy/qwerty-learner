import { useTypingPreferencesStore } from '@/pages/typing/stores';
import type { LoopWordTimesOption } from '@/shared/types';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCallback, useState } from 'react';
import IconRepeat from '~icons/tabler/repeat';
import IconRepeatOff from '~icons/tabler/repeat-off';

const loopOptions: LoopWordTimesOption[] = [1, 3, 5, 8, Number.MAX_SAFE_INTEGER];

function getLoopLabel(value: LoopWordTimesOption) {
  return value === Number.MAX_SAFE_INTEGER ? '无限' : String(value);
}

export default function LoopWordSwitcher() {
  const [open, setOpen] = useState(false);
  const loopTimes = useTypingPreferencesStore((s) => s.loopWordConfig.times);
  const setLoopWordConfig = useTypingPreferencesStore((s) => s.setLoopWordConfig);

  const onChangeLoopTimes = useCallback(
    (value: string) => {
      setLoopWordConfig((old) => ({ ...old, times: Number(value) as LoopWordTimesOption }));
      setOpen(false);
    },
    [setLoopWordConfig],
  );

  const isActive = loopTimes !== 1;

  return (
    <div className="relative inline-flex">
      <button
        type="button"
        className={`hover:bg-muted rounded-md p-0.5 text-lg transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="选择单词循环次数"
      >
        <div className="relative">
          {isActive ? (
            <>
              <IconRepeat />
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.7] font-mono text-xs font-bold">
                {loopTimes === Number.MAX_SAFE_INTEGER ? '∞' : loopTimes}
              </span>
            </>
          ) : (
            <IconRepeatOff />
          )}
        </div>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="bg-popover absolute top-full left-1/2 z-40 mt-2 w-48 -translate-x-1/2 rounded-lg border p-4 shadow-md">
            <RadioGroup
              className="flex flex-col gap-2.5"
              value={loopTimes.toString()}
              onValueChange={onChangeLoopTimes}
            >
              {loopOptions.map((value, index) => (
                <div className="flex items-center gap-3" key={value}>
                  <RadioGroupItem value={value.toString()} id={`loop-times-${index}`} />
                  <label htmlFor={`loop-times-${index}`} className="cursor-pointer text-sm">
                    {getLoopLabel(value)}
                  </label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
}
