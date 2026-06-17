import { create } from 'zustand';
import { defaultFontSizeConfig } from '@/shared/constants';
import type { PronunciationType } from '@/shared/types';
import { readStoredValue, resolveStateUpdater, type StateUpdater, writeStoredValue } from './persist';

export type PhoneticConfig = {
  isOpen: boolean;
  type: PronunciationType;
};

type SharedPreferencesStore = {
  fontSizeConfig: typeof defaultFontSizeConfig;
  isTextSelectable: boolean;
  phoneticConfig: PhoneticConfig;
  setFontSizeConfig: (nextValue: StateUpdater<typeof defaultFontSizeConfig>) => void;
  setIsTextSelectable: (nextValue: StateUpdater<boolean>) => void;
  setPhoneticConfig: (nextValue: StateUpdater<PhoneticConfig>) => void;
};

const defaultPhoneticConfig: PhoneticConfig = {
  isOpen: true,
  type: 'us',
};

export const useSharedPreferencesStore = create<SharedPreferencesStore>((set) => ({
  fontSizeConfig: readStoredValue('fontsize', defaultFontSizeConfig),
  isTextSelectable: readStoredValue('isTextSelectable', false),
  phoneticConfig: readStoredValue('phoneticConfig', defaultPhoneticConfig),
  setFontSizeConfig: (nextValue) => {
    set((state) => {
      const fontSizeConfig = resolveStateUpdater(state.fontSizeConfig, nextValue);
      writeStoredValue('fontsize', fontSizeConfig);
      return { fontSizeConfig };
    });
  },
  setIsTextSelectable: (nextValue) => {
    set((state) => {
      const isTextSelectable = resolveStateUpdater(state.isTextSelectable, nextValue);
      writeStoredValue('isTextSelectable', isTextSelectable);
      return { isTextSelectable };
    });
  },
  setPhoneticConfig: (nextValue) => {
    set((state) => {
      const phoneticConfig = resolveStateUpdater(state.phoneticConfig, nextValue);
      writeStoredValue('phoneticConfig', phoneticConfig);
      return { phoneticConfig };
    });
  },
}));
