import { selectCurrentDictInfo, usePracticeSessionStore } from '@/shared/stores';
import { type ChangeEvent, useMemo } from 'react';
import { getInputProfile } from '../../input-profile';
import { IMECompositionHandler } from '../IMECompositionHandler';
import { KeyEventHandler } from '../KeyEventHandler';

export type WordAddAction = {
  type: 'add';
  value: string;
  event: ChangeEvent | globalThis.KeyboardEvent;
};

export type WordDeleteAction = {
  type: 'delete';
  length: number;
};

export type WordComposeAction = {
  type: 'compose';
  value: string;
};

export type WordUpdateAction = WordAddAction | WordDeleteAction | WordComposeAction;

export const InputHandler = ({ updateInput }: { updateInput: (updateObj: WordUpdateAction) => void }) => {
  const currentDictId = usePracticeSessionStore((state) => state.currentDictId);
  const dictInfo = useMemo(() => selectCurrentDictInfo(currentDictId), [currentDictId]);
  const inputProfile = useMemo(() => getInputProfile(dictInfo), [dictInfo]);

  const handler = useMemo(() => {
    switch (inputProfile.mode) {
      case 'keyboard-direct':
      case 'keyboard-transliteration':
        return <KeyEventHandler updateInput={updateInput} warnIME={inputProfile.warnIME} />;
      case 'ime-composition':
        return <IMECompositionHandler updateInput={updateInput} />;
      default:
        return null;
    }
  }, [inputProfile, updateInput]);

  return <>{handler}</>;
};
