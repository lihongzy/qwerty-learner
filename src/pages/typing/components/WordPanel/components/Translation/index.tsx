import { SoundIcon } from '@/shared/components/WordPronunciationIcon/SoundIcon';
import { useSharedPreferencesStore } from '@/shared/stores';
import { TooltipHint as Tooltip } from '@/shared/ui/tooltip';
import useSpeech from '@/pages/typing/hooks/useSpeech';
import { useTypingPreferencesStore } from '@/pages/typing/stores';
import { useCallback, useMemo } from 'react';

export type TranslationProps = {
  trans: string;
  showTrans?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export const Translation = ({ trans, showTrans = true, onMouseEnter, onMouseLeave }: TranslationProps) => {
  const pronunciationConfig = useTypingPreferencesStore((state) => state.pronunciationConfig);
  const fontSizeConfig = useSharedPreferencesStore((state) => state.fontSizeConfig);
  const isTextSelectable = useSharedPreferencesStore((state) => state.isTextSelectable);

  const isShowTransRead = window.speechSynthesis && pronunciationConfig.isTransRead;
  const speechOptions = useMemo(() => ({ volume: pronunciationConfig.transVolume }), [pronunciationConfig.transVolume]);
  const { speak, speaking } = useSpeech(trans, speechOptions);

  const handleClickSoundIcon = useCallback(() => {
    speak(true);
  }, [speak]);

  return (
    <div
      className="flex items-center justify-center px-4 pt-2 pb-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex max-w-4xl items-start justify-center gap-2 px-8">
        <span
          className={`text-text-main max-w-4xl text-center font-sans leading-[1.7] transition-opacity duration-200 ${
            isTextSelectable ? 'select-text' : ''
          } ${showTrans ? 'opacity-100' : 'opacity-0'}`}
          style={{ fontSize: `${fontSizeConfig.translateFont}px` }}
        >
          {showTrans ? trans : '\u00A0'}
        </span>
        {isShowTransRead && showTrans && (
          <Tooltip content="朗读释义">
            <SoundIcon
              animated={speaking}
              onClick={handleClickSoundIcon}
              ariaLabel="朗读释义"
              className="text-text-faint hover:text-accent-primary focus-visible:ring-accent-cool/40 mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2"
              iconClassName="h-4.5 w-4.5"
            />
          </Tooltip>
        )}
      </div>
    </div>
  );
};
