import { useSharedPreferencesStore } from '@/shared/stores';
import { useTypingPreferencesStore } from '@/pages/typing/stores';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as Switch from '@radix-ui/react-switch';
import { useCallback } from 'react';

function SettingSwitchRow({
  title,
  description,
  checked,
  onCheckedChange,
  statusLabel,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  statusLabel: string;
}) {
  return (
    <section className="rounded-app-md border-border-main bg-bg-panel shadow-app-soft flex w-full flex-col items-start gap-5 border px-6 py-6">
      <div className="flex w-full flex-col items-start gap-3">
        <span className="text-text-strong text-left text-xl font-semibold">{title}</span>
        <span className="text-text-muted text-left text-sm leading-7">{description}</span>
      </div>

      <div className="flex w-full items-center justify-between gap-4">
        <Switch.Root checked={checked} onCheckedChange={onCheckedChange} className="my-switch-root">
          <Switch.Thumb aria-hidden="true" className="my-switch-thumb" />
        </Switch.Root>
        <span className="text-text-muted text-right text-xs leading-tight font-normal">{statusLabel}</span>
      </div>
    </section>
  );
}

export default function AdvancedSetting() {
  const randomConfig = useTypingPreferencesStore((state) => state.randomConfig);
  const setRandomConfig = useTypingPreferencesStore((state) => state.setRandomConfig);
  const isShowPrevAndNextWord = useTypingPreferencesStore((state) => state.isShowPrevAndNextWord);
  const setIsShowPrevAndNextWord = useTypingPreferencesStore((state) => state.setIsShowPrevAndNextWord);
  const isIgnoreCase = useTypingPreferencesStore((state) => state.isIgnoreCase);
  const setIsIgnoreCase = useTypingPreferencesStore((state) => state.setIsIgnoreCase);
  const isTextSelectable = useSharedPreferencesStore((state) => state.isTextSelectable);
  const setIsTextSelectable = useSharedPreferencesStore((state) => state.setIsTextSelectable);
  const isShowAnswerOnHover = useTypingPreferencesStore((state) => state.isShowAnswerOnHover);
  const setIsShowAnswerOnHover = useTypingPreferencesStore((state) => state.setIsShowAnswerOnHover);

  // 控制章节练习时是否开启随机排序。
  const onToggleRandom = useCallback(
    (checked: boolean) => {
      setRandomConfig((prev) => ({
        ...prev,
        isOpen: checked,
      }));
    },
    [setRandomConfig],
  );

  // 控制练习页顶部是否显示前后单词提示。
  const onToggleLastAndNextWord = useCallback(
    (checked: boolean) => {
      setIsShowPrevAndNextWord(checked);
    },
    [setIsShowPrevAndNextWord],
  );

  // 控制输入判断时是否忽略英文字母大小写。
  const onToggleIgnoreCase = useCallback(
    (checked: boolean) => {
      setIsIgnoreCase(checked);
    },
    [setIsIgnoreCase],
  );

  // 控制页面上的文本是否允许被鼠标选中。
  const onToggleTextSelectable = useCallback(
    (checked: boolean) => {
      setIsTextSelectable(checked);
    },
    [setIsTextSelectable],
  );

  // 控制默写模式下，鼠标悬浮时是否允许显示答案提示。
  const onToggleShowAnswerOnHover = useCallback(
    (checked: boolean) => {
      setIsShowAnswerOnHover(checked);
    },
    [setIsShowAnswerOnHover],
  );

  return (
    <ScrollArea.Root className="flex-1 overflow-y-auto select-none">
      <ScrollArea.Viewport className="h-full w-full px-3">
        {/* 高级设置项较多，使用滚动区域承载完整内容。 */}
        <div className="flex w-full flex-col items-start gap-10 overflow-y-auto px-3 pt-8 pb-20">
          <SettingSwitchRow
            title="章节乱序"
            description="开启后，每次练习章节中单词会随机排序。下一章节生效。"
            checked={randomConfig.isOpen}
            onCheckedChange={onToggleRandom}
            statusLabel={`随机已${randomConfig.isOpen ? '开启' : '关闭'}`}
          />

          <SettingSwitchRow
            title="练习时展示上一个/下一个单词"
            description="开启后，练习中会在上方展示上一个和下一个单词。"
            checked={isShowPrevAndNextWord}
            onCheckedChange={onToggleLastAndNextWord}
            statusLabel={`展示单词已${isShowPrevAndNextWord ? '开启' : '关闭'}`}
          />

          <SettingSwitchRow
            title="是否忽略大小写"
            description="开启后，输入时不区分大小写，如输入“hello”和“Hello”都会被认为是正确的。"
            checked={isIgnoreCase}
            onCheckedChange={onToggleIgnoreCase}
            statusLabel={`忽略大小写已${isIgnoreCase ? '开启' : '关闭'}`}
          />

          <SettingSwitchRow
            title="是否允许选择文本"
            description="开启后，可以通过鼠标选择页面中的文本。"
            checked={isTextSelectable}
            onCheckedChange={onToggleTextSelectable}
            statusLabel={`选择文本已${isTextSelectable ? '开启' : '关闭'}`}
          />

          <SettingSwitchRow
            title="是否允许默写模式下显示提示"
            description="开启后，可以通过鼠标悬浮单词显示正确答案。"
            checked={isShowAnswerOnHover}
            onCheckedChange={onToggleShowAnswerOnHover}
            statusLabel={`显示提示已${isShowAnswerOnHover ? '开启' : '关闭'}`}
          />
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none bg-transparent select-none" orientation="vertical" />
    </ScrollArea.Root>
  );
}
