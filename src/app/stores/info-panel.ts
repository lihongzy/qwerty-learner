import { create } from 'zustand';
import type { InfoPanelState } from '@/shared/types';
import { resolveStateUpdater, type StateUpdater } from '@/shared/stores/persist';

const defaultInfoPanelState: InfoPanelState = {
  donate: false,
  vsc: false,
  community: false,
  redBook: false,
};

type InfoPanelStore = {
  infoPanelState: InfoPanelState;
  setInfoPanelState: (nextValue: StateUpdater<InfoPanelState>) => void;
};

export const useInfoPanelStore = create<InfoPanelStore>((set) => ({
  infoPanelState: defaultInfoPanelState,
  setInfoPanelState: (nextValue) => {
    set((state) => ({
      infoPanelState: resolveStateUpdater(state.infoPanelState, nextValue),
    }));
  },
}));
