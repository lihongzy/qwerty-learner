import { create } from 'zustand';
import { correctSoundResources, keySoundResources, wrongSoundResources } from '@/shared/resources/soundResource';
import { readStoredValue, resolveStateUpdater, type StateUpdater, writeStoredValue } from '@/shared/stores/persist';

type SoundResource = (typeof keySoundResources)[number];

export type KeySoundsConfig = {
  isOpen: boolean;
  isOpenClickSound: boolean;
  volume: number;
  resource: SoundResource;
};

export type HintSoundsConfig = {
  isOpen: boolean;
  volume: number;
  isOpenWrongSound: boolean;
  isOpenCorrectSound: boolean;
  wrongResource: (typeof wrongSoundResources)[number];
  correctResource: (typeof correctSoundResources)[number];
};

type TypingSoundStore = {
  keySoundsConfig: KeySoundsConfig;
  hintSoundsConfig: HintSoundsConfig;
  setKeySoundsConfig: (nextValue: StateUpdater<KeySoundsConfig>) => void;
  setHintSoundsConfig: (nextValue: StateUpdater<HintSoundsConfig>) => void;
};

const defaultKeySoundsConfig: KeySoundsConfig = {
  isOpen: true,
  isOpenClickSound: true,
  volume: 1,
  resource: keySoundResources[0],
};

const defaultHintSoundsConfig: HintSoundsConfig = {
  isOpen: true,
  volume: 1,
  isOpenWrongSound: true,
  isOpenCorrectSound: true,
  wrongResource: wrongSoundResources[0],
  correctResource: correctSoundResources[0],
};

export const useTypingSoundStore = create<TypingSoundStore>((set) => ({
  keySoundsConfig: readStoredValue('keySoundsConfig', defaultKeySoundsConfig),
  hintSoundsConfig: readStoredValue('hintSoundsConfig', defaultHintSoundsConfig),
  setKeySoundsConfig: (nextValue) => {
    set((state) => {
      const keySoundsConfig = resolveStateUpdater(state.keySoundsConfig, nextValue);
      writeStoredValue('keySoundsConfig', keySoundsConfig);
      return { keySoundsConfig };
    });
  },
  setHintSoundsConfig: (nextValue) => {
    set((state) => {
      const hintSoundsConfig = resolveStateUpdater(state.hintSoundsConfig, nextValue);
      writeStoredValue('hintSoundsConfig', hintSoundsConfig);
      return { hintSoundsConfig };
    });
  },
}));
