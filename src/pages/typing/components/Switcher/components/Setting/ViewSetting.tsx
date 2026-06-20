import { defaultFontSizeConfig } from '@/shared/constants';
import { useSharedPreferencesStore } from '@/shared/stores';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

function FontSizeBlock({
  label,
  value,
  min,
  max,
  step,
  onValueChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border p-4">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <Slider aria-label={label} value={[value]} min={min} max={max} step={step} onValueChange={onValueChange} />
        <span className="text-muted-foreground w-12 shrink-0 text-xs">{value}px</span>
      </div>
    </div>
  );
}

export default function ViewSetting() {
  const fontSizeConfig = useSharedPreferencesStore((s) => s.fontSizeConfig);
  const setFontsizeConfig = useSharedPreferencesStore((s) => s.setFontSizeConfig);

  return (
    <ScrollArea className="h-full">
      <div className="flex w-full flex-col gap-8 px-6 py-8">
        <section className="flex w-full flex-col gap-6 rounded-lg border p-6">
          <span className="text-xl font-semibold">字体设置</span>

          <FontSizeBlock
            label="外语字体"
            value={fontSizeConfig.foreignFont}
            min={20}
            max={96}
            step={4}
            onValueChange={([v]) => setFontsizeConfig((p) => ({ ...p, foreignFont: v }))}
          />

          <FontSizeBlock
            label="中文字体"
            value={fontSizeConfig.translateFont}
            min={14}
            max={60}
            step={4}
            onValueChange={([v]) => setFontsizeConfig((p) => ({ ...p, translateFont: v }))}
          />
        </section>

        <Button variant="outline" onClick={() => setFontsizeConfig({ ...defaultFontSizeConfig })}>
          重置字体设置
        </Button>
      </div>
    </ScrollArea>
  );
}
