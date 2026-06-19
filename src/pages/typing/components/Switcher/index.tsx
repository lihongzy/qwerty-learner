import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TypingContext, TypingStateActionType } from '@/pages/typing/store';
import { useThemeStore } from '@/app/stores/theme';
import { memo, useContext, type ReactNode } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import IconMoon from '~icons/heroicons/moon-solid';
import IconSun from '~icons/heroicons/sun-solid';
import IconLanguage from '~icons/tabler/language';
import IconLanguageOff from '~icons/tabler/language-off';
import AnalysisButton from '@/pages/typing/components/Switcher/components/AnalysisButton';
import ErrorBookButton from '@/pages/typing/components/Switcher/components/ErrorBookButton';
import HandPositionIllustration from '@/pages/typing/components/Switcher/components/HandPositionIllustration';
import LoopWordSwitcher from '@/pages/typing/components/Switcher/components/LoopWordSwitcher';
import Setting from '@/pages/typing/components/Switcher/components/Setting';
import SoundSwitcher from '@/pages/typing/components/Switcher/components/SoundSwitcher';
import WordDictationSwitcher from '@/pages/typing/components/Switcher/components/WordDictationSwitcher';

function TooltipTip({ content, children }: { content: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger className="inline-flex" asChild>
        <span>{children}</span>
      </TooltipTrigger>
      <TooltipContent>{content}</TooltipContent>
    </Tooltip>
  );
}

const StaticSwitcherControls = memo(function StaticSwitcherControls() {
  const isOpenDarkMode = useThemeStore((state) => state.isOpenDarkMode);
  const setIsOpenDarkMode = useThemeStore((state) => state.setIsOpenDarkMode);

  return (
    <>
      <TooltipTip content="声音设置">
        <SoundSwitcher />
      </TooltipTip>
      <TooltipTip content="设置单词重复次数">
        <LoopWordSwitcher />
      </TooltipTip>
      <TooltipTip content="切换听写模式（Ctrl + Shift + D）">
        <WordDictationSwitcher />
      </TooltipTip>
      <TooltipTip content="错题本">
        <ErrorBookButton />
      </TooltipTip>
      <TooltipTip content="查看统计">
        <AnalysisButton />
      </TooltipTip>
      <TooltipTip content="切换深色模式">
        <button
          className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-md p-0.5 text-lg transition-colors"
          type="button"
          onClick={(e) => {
            setIsOpenDarkMode((old) => !old);
            e.currentTarget.blur();
          }}
        >
          {isOpenDarkMode ? <IconSun /> : <IconMoon />}
        </button>
      </TooltipTip>
      <TooltipTip content="指法提示">
        <HandPositionIllustration />
      </TooltipTip>
      <TooltipTip content="设置">
        <Setting />
      </TooltipTip>
    </>
  );
});

export function Switcher() {
  const { state, dispatch } = useContext(TypingContext)!;

  const changeTransVisibleState = () => {
    dispatch?.({ type: TypingStateActionType.TOGGLE_TRANS_VISIBLE });
  };

  useHotkeys('ctrl+shift+v', () => changeTransVisibleState(), { enableOnFormTags: true, preventDefault: true }, []);

  return (
    <div className="flex items-center justify-center gap-2">
      <TooltipProvider>
        <TooltipTip content="切换释义显示（Ctrl + Shift + V）">
          <button
            className={`hover:bg-muted rounded-md p-0.5 text-lg transition-colors ${
              state?.isTransVisible ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
            type="button"
            onClick={(e) => {
              changeTransVisibleState();
              e.currentTarget.blur();
            }}
          >
            {state?.isTransVisible ? <IconLanguage /> : <IconLanguageOff />}
          </button>
        </TooltipTip>

        <StaticSwitcherControls />
      </TooltipProvider>
    </div>
  );
}
