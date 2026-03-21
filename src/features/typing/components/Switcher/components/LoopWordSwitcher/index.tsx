import { loopWordConfigAtom } from '@/features/typing/state'
import type { LoopWordTimesOption } from '@/shared/types'
import { useAtom } from 'jotai'
import { Popover, RadioGroup } from 'radix-ui'
import { useCallback } from 'react'
import IconRepeat from '~icons/tabler/repeat'
import IconRepeatOff from '~icons/tabler/repeat-off'

const loopOptions: LoopWordTimesOption[] = [1, 3, 5, 8, Number.MAX_SAFE_INTEGER]

const triggerClassName =
  'rounded p-[2px] text-lg transition-colors duration-300 ease-in-out hover:bg-indigo-400 hover:text-white focus:outline-none data-[state=open]:bg-indigo-500 data-[state=open]:text-white'

const radioItemClassName =
  'h-[25px] w-[25px] cursor-pointer rounded-full bg-white shadow-[0_2px_10px] shadow-gray-300 outline-none hover:bg-indigo-100 dark:bg-gray-700 dark:shadow-gray-900'

function getLoopLabel(value: LoopWordTimesOption) {
  return value === Number.MAX_SAFE_INTEGER ? '无限' : String(value)
}

export default function LoopWordSwitcher() {
  const [{ times: loopTimes }, setLoopWordConfig] = useAtom(loopWordConfigAtom)

  const onChangeLoopTimes = useCallback(
    (value: string) => {
      setLoopWordConfig((old) => ({
        ...old,
        times: Number(value) as LoopWordTimesOption,
      }))
    },
    [setLoopWordConfig],
  )

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={`${triggerClassName} ${loopTimes === 1 ? 'text-gray-500' : 'text-indigo-500'}`}
          type="button"
          onFocus={(e) => e.currentTarget.blur()}
          aria-label="选择单词循环次数"
          title="选择单词循环次数"
        >
          <div className="relative">
            {loopTimes === 1 ? (
              <IconRepeatOff />
            ) : (
              <>
                <IconRepeat />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.7] font-mono text-xs font-bold">
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
          className="z-30 w-60 select-none rounded-xl bg-white p-4 shadow-[0_-12px_30px_rgba(0,0,0,0.08),0_20px_40px_rgba(0,0,0,0.14)] outline-none dark:bg-gray-800"
        >
          <div className="flex w-full flex-col items-start gap-2">
            <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">选择单词循环次数</span>

            <RadioGroup.Root
              className="flex w-full flex-col gap-2.5"
              value={loopTimes.toString()}
              onValueChange={onChangeLoopTimes}
              aria-label="选择单词循环次数"
            >
              {loopOptions.map((value, index) => {
                const id = `loop-times-${index}`

                return (
                  <div className="flex w-full items-center" key={value}>
                    <RadioGroup.Item className={radioItemClassName} value={value.toString()} id={id}>
                      <RadioGroup.Indicator className="relative flex h-full w-full items-center justify-center after:block after:h-[11px] after:w-[11px] after:rounded-full after:bg-indigo-600 after:content-['']" />
                    </RadioGroup.Item>
                    <label className="flex-1 cursor-pointer pl-[15px] text-[15px] leading-none dark:text-white dark:text-opacity-60" htmlFor={id}>
                      {getLoopLabel(value)}
                    </label>
                  </div>
                )
              })}
            </RadioGroup.Root>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
