import { TooltipHint as Tooltip } from '@/shared/ui/tooltip';
import { TypingContext, TypingStateActionType } from '@/pages/typing/store';
import { useThemeStore } from '@/app/stores/theme';
import clsx from 'clsx';
import { memo, useContext } from 'react';
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

const StaticSwitcherControls = memo(function StaticSwitcherControls() {
  const isOpenDarkMode = useThemeStore((state) => state.isOpenDarkMode);
  const setIsOpenDarkMode = useThemeStore((state) => state.setIsOpenDarkMode);

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old);
  };

  return (
    <>
      <Tooltip content="声音设置">
        <SoundSwitcher />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="设置单词重复次数">
        <LoopWordSwitcher />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="切换听写模式（Ctrl + Shift + D）">
        <WordDictationSwitcher />
      </Tooltip>
      <Tooltip content="错题本">
        <ErrorBookButton />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="查看统计">
        <AnalysisButton />
      </Tooltip>
      <Tooltip className="h-7 w-7" content="切换深色模式">
        <button
          className="text-accent-primary hover:bg-accent-primary-soft hover:text-accent-primary-hover rounded-md p-0.5 text-lg transition-colors focus:outline-none"
          type="button"
          onClick={(e) => {
            changeDarkModeState();
            e.currentTarget.blur();
          }}
        >
          {isOpenDarkMode ? <IconMoon className="my-icon" /> : <IconSun className="my-icon" />}
        </button>
      </Tooltip>
      <Tooltip className="h-7 w-7" content="指法提示">
        <HandPositionIllustration />
      </Tooltip>
      <Tooltip content="设置">
        <Setting />
      </Tooltip>
    </>
  );
});

export function Switcher() {
  const { state, dispatch } = useContext(TypingContext)!;

  const changeTransVisibleState = () => {
    dispatch?.({ type: TypingStateActionType.TOGGLE_TRANS_VISIBLE });
  };

  useHotkeys(
    'ctrl+shift+v',
    () => {
      changeTransVisibleState();
    },
    { enableOnFormTags: true, preventDefault: true },
    [],
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <Tooltip className="h-7 w-7" content="切换释义显示（Ctrl + Shift + V）">
        <button
          className={clsx(
            'hover:bg-accent-primary-soft rounded-md p-0.5 text-lg transition-colors focus:outline-none',
            state?.isTransVisible
              ? 'text-accent-primary hover:text-accent-primary-hover'
              : 'text-text-muted hover:text-text-strong',
          )}
          type="button"
          onClick={(e) => {
            changeTransVisibleState();
            e.currentTarget.blur();
          }}
          aria-label="切换释义显示（Ctrl + Shift + V）"
        >
          {state?.isTransVisible ? <IconLanguage /> : <IconLanguageOff />}
        </button>
      </Tooltip>

      <StaticSwitcherControls />
    </div>
  );
}
