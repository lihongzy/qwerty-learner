import { KEY_SOUND_URL_PREFIX, SOUND_URL_PREFIX, keySoundResources } from '@/shared/resources/soundResource';
import { useTypingSoundStore } from '@/pages/typing/stores';
import { useCallback, useEffect, useMemo } from 'react';
import useSound from 'use-sound';

export type PlayFunction = ReturnType<typeof useSound>[0];

export default function useKeySounds(): [PlayFunction, PlayFunction, PlayFunction] {
  const {
    isOpen: isKeyOpen,
    isOpenClickSound,
    volume: keyVolume,
    resource: keyResource,
  } = useTypingSoundStore((state) => state.keySoundsConfig);
  const setKeySoundsConfig = useTypingSoundStore((state) => state.setKeySoundsConfig);
  const {
    isOpen: isHintOpen,
    isOpenWrongSound,
    isOpenCorrectSound,
    volume: hintVolume,
    wrongResource,
    correctResource,
  } = useTypingSoundStore((state) => state.hintSoundsConfig);

  const fallbackResource = useMemo(
    () => keySoundResources.find((item) => item.key === 'Default') || keySoundResources[0],
    [],
  );

  const matchedResource = useMemo(
    () =>
      keyResource
        ? keySoundResources.find((item) => item.filename === keyResource.filename && item.key === keyResource.key)
        : undefined,
    [keyResource],
  );

  useEffect(() => {
    if (fallbackResource && !matchedResource) {
      setKeySoundsConfig((prev) => ({ ...prev, resource: fallbackResource }));
    }
  }, [fallbackResource, matchedResource, setKeySoundsConfig]);

  const resolvedKeyResource = matchedResource || fallbackResource;
  const keySoundUrl = useMemo(
    () => (resolvedKeyResource ? `${KEY_SOUND_URL_PREFIX}${resolvedKeyResource.filename}` : undefined),
    [resolvedKeyResource],
  );

  const [playClickSoundRaw] = useSound(keySoundUrl ?? '', {
    volume: keyVolume,
    interrupt: true,
    soundEnabled: Boolean(keySoundUrl),
  });
  const [playWrongSoundRaw] = useSound(`${SOUND_URL_PREFIX}${wrongResource.filename}`, {
    volume: hintVolume,
    interrupt: true,
  });
  const [playCorrectSoundRaw] = useSound(`${SOUND_URL_PREFIX}${correctResource.filename}`, {
    volume: hintVolume,
    interrupt: true,
  });

  const playClickSound = useCallback(() => {
    if (isKeyOpen && isOpenClickSound) {
      playClickSoundRaw();
    }
  }, [isKeyOpen, isOpenClickSound, playClickSoundRaw]);

  const playWrongSound = useCallback(() => {
    if (isHintOpen && isOpenWrongSound) {
      playWrongSoundRaw();
    }
  }, [isHintOpen, isOpenWrongSound, playWrongSoundRaw]);

  const playCorrectSound = useCallback(() => {
    if (isHintOpen && isOpenCorrectSound) {
      playCorrectSoundRaw();
    }
  }, [isHintOpen, isOpenCorrectSound, playCorrectSoundRaw]);

  return [playClickSound, playWrongSound, playCorrectSound];
}
