import { create } from 'zustand';
import type { groupedWordRecords } from '../type';

type ErrorBookStore = {
  currentRowDetail: groupedWordRecords | null;
  setCurrentRowDetail: (currentRowDetail: groupedWordRecords | null) => void;
};

export const useErrorBookStore = create<ErrorBookStore>((set) => ({
  currentRowDetail: null,
  setCurrentRowDetail: (currentRowDetail) => set({ currentRowDetail }),
}));
