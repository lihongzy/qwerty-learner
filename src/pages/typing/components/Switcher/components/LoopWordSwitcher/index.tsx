import { useTypingPreferencesStore } from '@/pages/typing/stores';
import type { LoopWordTimesOption } from '@/shared/types';
import { Popover, RadioGroup } from 'radix-ui';
import { useCallback } from 'react';
import IconRepeat from '~icons/tabler/repeat';
import IconRepeatOff from '~icons/tabler/repeat-off';

const loopOptions: LoopWordTimesOption[] = [1, 3, 5, 8, Number.MAX_SAFE_INTEGER];

const triggerClassName =
  'group rounded-md p-0.5 text-lg transition-colors duration-300 ease-in-out hover:bg-accent-primary-soft hover:text-accent-primary-hover focus:outline-none data-[state=open]:bg-accent-primary data-[state=open]:text-white';

const radioItemClassName =
  'h-[25px] w-[25px] cursor-pointer rounded-full border border-border-main bg-bg-panel shadow-app-soft outline-none hover:bg-accent-primary-soft';

function getLoopLabel(value: LoopWordTimesOption) {
  return value === Number.MAX_SAFE_INTEGER ? '无限' : String(value);
}

export default function LoopWordSwitcher() {
  const loopTimes = useTypingPreferencesStore((state) => state.loopWordConfig.times);
  const setLoopWordConfig = useTypingPreferencesStore((state) => state.setLoopWordConfig);

  const onChangeLoopTimes = useCallback(
    (value: string) => {
      setLoopWordConfig((old) => ({
        ...old,
        times: Number(value) as LoopWordTimesOption,
      }));
    },
    [setLoopWordConfig],
  );

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={`${triggerClassName} ${loopTimes === 1 ? 'text-text-muted hover:text-text-strong' : 'text-accent-primary'}`}
          type="button"
          onFocus={(e) => e.currentTarget.blur()}
          aria-label="选择单词循环次数"
          title="选择单词循环次数"
        >
          <div className="relative">
            {loopTimes === 1 ? (
              <IconRepeatOff className="text-text-muted group-hover:text-text-strong transition-colors" />
            ) : (
              <>
                <IconRepeat className="text-accent-primary group-hover:text-accent-primary-hover transition-colors data-[state=open]:text-white" />
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.7] font-mono text-xs font-bold text-current">
                  {loopTimes === Number.MAX_SAFE_INTEGER ? '' : loopTimes}
                </span>
              </>
            )}
          </div>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={10}
          align="center"
          className="border-border-main bg-bg-panel shadow-app-panel z-30 w-60 rounded-xl border p-4 outline-none select-none"
        >
          <div className="flex w-full flex-col items-start gap-2">
            <span className="text-text-main text-sm leading-5 font-normal">选择单词循环次数</span>

            <RadioGroup.Root
              className="flex w-full flex-col gap-2.5"
              value={loopTimes.toString()}
              onValueChange={onChangeLoopTimes}
              aria-label="选择单词循环次数"
            >
              {loopOptions.map((value, index) => {
                const id = `loop-times-${index}`;

                return (
                  <div className="flex w-full items-center" key={value}>
                    <RadioGroup.Item className={radioItemClassName} value={value.toString()} id={id}>
                      <RadioGroup.Indicator className="after:bg-accent-primary relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-full after:content-['']" />
                    </RadioGroup.Item>
                    <label
                      className="text-text-main flex-1 cursor-pointer pl-[15px] text-[15px] leading-none"
                      htmlFor={id}
                    >
                      {getLoopLabel(value)}
                    </label>
                  </div>
                );
              })}
            </RadioGroup.Root>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
