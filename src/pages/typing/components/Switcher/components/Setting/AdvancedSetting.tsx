import { useTypingPreferencesStore } from '@/pages/typing/stores';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';

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
    <section className="flex w-full flex-col gap-4 rounded-lg border p-6">
      <div className="flex flex-col gap-2">
        <span className="text-xl font-semibold">{title}</span>
        <span className="text-muted-foreground text-sm">{description}</span>
      </div>

      <div className="flex w-full items-center justify-between gap-4">
        <Switch checked={checked} onCheckedChange={onCheckedChange} />
        <span className="text-muted-foreground text-xs">{statusLabel}</span>
      </div>
    </section>
  );
}

export default function AdvancedSetting() {
  const randomConfig = useTypingPreferencesStore((s) => s.randomConfig);
  const setRandomConfig = useTypingPreferencesStore((s) => s.setRandomConfig);
  const isShowPrevAndNextWord = useTypingPreferencesStore((s) => s.isShowPrevAndNextWord);
  const setIsShowPrevAndNextWord = useTypingPreferencesStore((s) => s.setIsShowPrevAndNextWord);
  const isIgnoreCase = useTypingPreferencesStore((s) => s.isIgnoreCase);
  const setIsIgnoreCase = useTypingPreferencesStore((s) => s.setIsIgnoreCase);
  const isShowAnswerOnHover = useTypingPreferencesStore((s) => s.isShowAnswerOnHover);
  const setIsShowAnswerOnHover = useTypingPreferencesStore((s) => s.setIsShowAnswerOnHover);

  return (
    <ScrollArea className="h-full">
      <div className="flex w-full flex-col gap-8 px-6 py-8">
        <SettingSwitchRow
          title="章节乱序"
          description="开启后，每次练习章节中单词会随机排序。下一章节生效。"
          checked={randomConfig.isOpen}
          onCheckedChange={(v) => setRandomConfig((p) => ({ ...p, isOpen: v }))}
          statusLabel={`随机已${randomConfig.isOpen ? '开启' : '关闭'}`}
        />

        <SettingSwitchRow
          title="练习时展示上一个/下一个单词"
          description="开启后，练习中会在上方展示上一个和下一个单词。"
          checked={isShowPrevAndNextWord}
          onCheckedChange={setIsShowPrevAndNextWord}
          statusLabel={`展示单词已${isShowPrevAndNextWord ? '开启' : '关闭'}`}
        />

        <SettingSwitchRow
          title="是否忽略大小写"
          description={'开启后，输入时不区分大小写，如输入\u201Chello\u201D和\u201CHello\u201D都会被认为是正确的。'}
          checked={isIgnoreCase}
          onCheckedChange={setIsIgnoreCase}
          statusLabel={`忽略大小写已${isIgnoreCase ? '开启' : '关闭'}`}
        />

        <SettingSwitchRow
          title="是否允许默写模式下显示提示"
          description="开启后，可以通过鼠标悬浮单词显示正确答案。"
          checked={isShowAnswerOnHover}
          onCheckedChange={setIsShowAnswerOnHover}
          statusLabel={`显示提示已${isShowAnswerOnHover ? '开启' : '关闭'}`}
        />
      </div>
    </ScrollArea>
  );
}
