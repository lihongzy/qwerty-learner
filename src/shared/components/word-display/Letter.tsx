import clsx from 'clsx';
import { memo } from 'react';
import { EXPLICIT_SPACE } from '@/shared/constants';
import { useSharedPreferencesStore } from '@/shared/stores';

export type LetterState = 'normal' | 'correct' | 'wrong';

const stateClassNameMap: Record<string, Record<LetterState, string>> = {
  true: {
    normal: 'text-text-faint',
    correct: 'text-state-success',
    wrong: 'text-state-error',
  },
  false: {
    normal: 'text-text-main',
    correct: 'text-state-success',
    wrong: 'text-state-error',
  },
};

export type LetterProps = {
  letter: string;
  state?: LetterState;
  visible?: boolean;
};

export const Letter = memo(({ letter, state = 'normal', visible = true }: LetterProps) => {
  const fontSizeConfig = useSharedPreferencesStore((state) => state.fontSizeConfig);

  return (
    <span
      className={clsx(
        'm-0 p-0 font-mono font-normal duration-0',
        stateClassNameMap[String(letter === EXPLICIT_SPACE)][state],
      )}
      style={{ fontSize: `${fontSizeConfig.foreignFont}px` }}
    >
      {visible ? letter : '_'}
    </span>
  );
});
