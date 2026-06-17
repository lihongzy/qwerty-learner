import { create } from 'zustand';
import { readStoredValue, resolveStateUpdater, type StateUpdater, writeStoredValue } from '@/shared/stores/persist';

const prefersDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;

type ThemeState = {
  isOpenDarkMode: boolean;
  setIsOpenDarkMode: (nextValue: StateUpdater<boolean>) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  isOpenDarkMode: readStoredValue('isOpenDarkMode', prefersDarkMode),
  setIsOpenDarkMode: (nextValue) => {
    set((state) => {
      const isOpenDarkMode = resolveStateUpdater(state.isOpenDarkMode, nextValue);
      writeStoredValue('isOpenDarkMode', isOpenDarkMode);
      return { isOpenDarkMode };
    });
  },
}));
