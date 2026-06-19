import { KEY_SOUND_URL_PREFIX, keySoundResources } from '@/shared/resources/soundResource';
import type { SoundResource } from '@/shared/resources/soundResource';
import { useTypingPreferencesStore, useTypingSoundStore } from '@/pages/typing/stores';
import { Howl } from 'howler';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ReactNode } from 'react';
import { useCallback } from 'react';
import IconEar from '~icons/tabler/ear';

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

let previewKeySound: Howl | null = null;

function playKeySoundResource(soundResource: SoundResource, volume = 1) {
  previewKeySound?.stop();
  previewKeySound?.unload();
  previewKeySound = new Howl({
    src: [KEY_SOUND_URL_PREFIX + soundResource.filename],
    format: ['wav'],
    volume,
    onend: () => {
      previewKeySound?.unload();
      previewKeySound = null;
    },
  });
  previewKeySound.play();
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex w-full flex-col gap-4 rounded-lg border p-6">
      <span className="text-xl font-semibold">{title}</span>
      {children}
    </section>
  );
}

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      {children}
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min = 0,
  max,
  step,
  valueText,
  disabled,
  onValueChange,
}: {
  label: string;
  value: number;
  min?: number;
  max: number;
  step: number;
  valueText: string;
  disabled?: boolean;
  onValueChange: (value: number[]) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border p-4">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-4">
        <Slider
          aria-label={label}
          value={[value]}
          min={min}
          max={max}
          step={step}
          onValueChange={onValueChange}
          disabled={disabled}
        />
        <span className="text-muted-foreground w-12 shrink-0 text-xs">{valueText}</span>
      </div>
    </div>
  );
}

export default function SoundSetting() {
  const pronunciationConfig = useTypingPreferencesStore((s) => s.pronunciationConfig);
  const setPronunciationConfig = useTypingPreferencesStore((s) => s.setPronunciationConfig);
  const keySoundsConfig = useTypingSoundStore((s) => s.keySoundsConfig);
  const setKeySoundsConfig = useTypingSoundStore((s) => s.setKeySoundsConfig);
  const hintSoundsConfig = useTypingSoundStore((s) => s.hintSoundsConfig);
  const setHintSoundsConfig = useTypingSoundStore((s) => s.setHintSoundsConfig);

  const canUseSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const onPlayKeySound = useCallback(() => {
    playKeySoundResource(keySoundsConfig.resource, keySoundsConfig.volume);
  }, [keySoundsConfig.resource, keySoundsConfig.volume]);

  const onChangeKeySoundResource = useCallback(
    (key: string) => {
      const soundResource = keySoundResources.find((item) => item.key === key);
      if (soundResource) setKeySoundsConfig((p) => ({ ...p, resource: soundResource }));
    },
    [setKeySoundsConfig],
  );

  return (
    <ScrollArea className="h-full">
      <div className="flex w-full flex-col gap-8 px-6 py-8">
        {/* 单词发音 */}
        <Section title="单词发音">
          <SettingRow label={`发音已${pronunciationConfig.isOpen ? '开启' : '关闭'}`}>
            <Switch
              checked={pronunciationConfig.isOpen}
              onCheckedChange={(v) => setPronunciationConfig((p) => ({ ...p, isOpen: v }))}
            />
          </SettingRow>
          <SliderRow
            label="音量"
            value={pronunciationConfig.volume * 100}
            max={100}
            step={10}
            disabled={!pronunciationConfig.isOpen}
            onValueChange={([v]) => setPronunciationConfig((p) => ({ ...p, volume: clamp(v / 100, 0, 1) }))}
            valueText={`${Math.floor(pronunciationConfig.volume * 100)}%`}
          />
          <SliderRow
            label="倍速"
            value={pronunciationConfig.rate ?? 1}
            min={0.5}
            max={4}
            step={0.1}
            disabled={!pronunciationConfig.isOpen}
            onValueChange={([v]) => setPronunciationConfig((p) => ({ ...p, rate: Number(v.toFixed(1)) }))}
            valueText={(pronunciationConfig.rate ?? 1).toFixed(1)}
          />
        </Section>

        {/* 释义发音 */}
        {canUseSpeechSynthesis && (
          <Section title="释义发音">
            <SettingRow label={`发音已${pronunciationConfig.isTransRead ? '开启' : '关闭'}`}>
              <Switch
                checked={pronunciationConfig.isTransRead}
                onCheckedChange={(v) => setPronunciationConfig((p) => ({ ...p, isTransRead: v }))}
              />
            </SettingRow>
            <SliderRow
              label="音量"
              value={pronunciationConfig.transVolume * 100}
              max={100}
              step={10}
              disabled={!pronunciationConfig.isTransRead}
              onValueChange={([v]) => setPronunciationConfig((p) => ({ ...p, transVolume: clamp(v / 100, 0, 1) }))}
              valueText={`${Math.floor(pronunciationConfig.transVolume * 100)}%`}
            />
          </Section>
        )}

        {/* 按键音 */}
        <Section title="按键音">
          <SettingRow label={`发音已${keySoundsConfig.isOpen ? '开启' : '关闭'}`}>
            <Switch
              checked={keySoundsConfig.isOpen}
              onCheckedChange={(v) => setKeySoundsConfig((p) => ({ ...p, isOpen: v }))}
            />
          </SettingRow>
          <SliderRow
            label="音量"
            value={keySoundsConfig.volume * 100}
            min={1}
            max={100}
            step={10}
            disabled={!keySoundsConfig.isOpen}
            onValueChange={([v]) => setKeySoundsConfig((p) => ({ ...p, volume: clamp(v / 100, 0.01, 1) }))}
            valueText={`${Math.floor(keySoundsConfig.volume * 100)}%`}
          />
          <div className="flex w-full flex-col gap-3 rounded-lg border p-4">
            <span className="text-sm font-medium">按键音效</span>
            <Select
              value={keySoundsConfig.resource.key}
              onValueChange={onChangeKeySoundResource}
              disabled={!keySoundsConfig.isOpen}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {keySoundResources.map(({ key, name }) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <button
              type="button"
              onClick={onPlayKeySound}
              disabled={!keySoundsConfig.isOpen}
              className="hover:text-primary inline-flex items-center gap-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <IconEar className="h-4 w-4" />
              <span>试听当前按键音</span>
            </button>
          </div>
        </Section>

        {/* 效果音 */}
        <Section title="效果音">
          <SettingRow label={`发音已${hintSoundsConfig.isOpen ? '开启' : '关闭'}`}>
            <Switch
              checked={hintSoundsConfig.isOpen}
              onCheckedChange={(v) => setHintSoundsConfig((p) => ({ ...p, isOpen: v }))}
            />
          </SettingRow>
          <SliderRow
            label="音量"
            value={hintSoundsConfig.volume * 100}
            min={1}
            max={100}
            step={10}
            disabled={!hintSoundsConfig.isOpen}
            onValueChange={([v]) => setHintSoundsConfig((p) => ({ ...p, volume: clamp(v / 100, 0.01, 1) }))}
            valueText={`${Math.floor(hintSoundsConfig.volume * 100)}%`}
          />
        </Section>
      </div>
    </ScrollArea>
  );
}
