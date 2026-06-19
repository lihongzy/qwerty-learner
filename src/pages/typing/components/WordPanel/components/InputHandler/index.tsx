import { type ChangeEvent } from 'react';
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

export type WordUpdateAction = WordAddAction | WordDeleteAction;

export const InputHandler = ({ updateInput }: { updateInput: (updateObj: WordUpdateAction) => void }) => {
  return <KeyEventHandler updateInput={updateInput} warnIME />;
};
