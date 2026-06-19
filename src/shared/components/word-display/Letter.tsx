import { memo } from 'react';
import { EXPLICIT_SPACE } from '@/shared/constants';
import { useSharedPreferencesStore } from '@/shared/stores';

export type LetterState = 'normal' | 'correct' | 'wrong';

const stateColor: Record<LetterState, string> = {
  normal: '',
  correct: 'text-green-600 dark:text-green-400',
  wrong: 'text-red-600 dark:text-red-400',
};

export type LetterProps = {
  letter: string;
  state?: LetterState;
  visible?: boolean;
};

export const Letter = memo(({ letter, state = 'normal', visible = true }: LetterProps) => {
  const fontSize = useSharedPreferencesStore((s) => s.fontSizeConfig.foreignFont);

  return (
    <span
      className={`m-0 p-0 font-mono font-normal ${letter === EXPLICIT_SPACE ? 'text-muted-foreground' : stateColor[state]}`}
      style={{ fontSize: `${fontSize}px` }}
    >
      {visible ? letter : '_'}
    </span>
  );
});
