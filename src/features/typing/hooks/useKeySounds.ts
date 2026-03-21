import { KEY_SOUND_URL_PREFIX, SOUND_URL_PREFIX, keySoundResources } from '@/resources/soundResource'
import { hintSoundsConfigAtom, keySoundsConfigAtom } from '@/shared/state'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useEffect, useMemo } from 'react'
import useSound from 'use-sound'

export type PlayFunction = ReturnType<typeof useSound>[0]

export default function useKeySounds(): [PlayFunction, PlayFunction, PlayFunction] {
  const { isOpen: isKeyOpen, isOpenClickSound, volume: keyVolume, resource: keyResource } = useAtomValue(keySoundsConfigAtom)
  const setKeySoundsConfig = useSetAtom(keySoundsConfigAtom)
  const {
    isOpen: isHintOpen,
    isOpenWrongSound,
    isOpenCorrectSound,
    volume: hintVolume,
    wrongResource,
    correctResource,
  } = useAtomValue(hintSoundsConfigAtom)

  const matchedResource = useMemo(
    () => keySoundResources.find((item) => item.filename === keyResource.filename && item.key === keyResource.key),
    [keyResource.filename, keyResource.key],
  )

  const fallbackResource = useMemo(
    () => keySoundResources.find((item) => item.key === 'Default') || keySoundResources[0],
    [],
  )

  useEffect(() => {
    if (!matchedResource) {
      setKeySoundsConfig((prev) => ({ ...prev, resource: fallbackResource }))
    }
  }, [fallbackResource, matchedResource, setKeySoundsConfig])

  const resolvedKeyResource = matchedResource || fallbackResource
  const keySoundUrl = useMemo(() => `${KEY_SOUND_URL_PREFIX}${resolvedKeyResource.filename}`, [resolvedKeyResource.filename])

  const [playClickSoundRaw] = useSound(keySoundUrl, {
    volume: keyVolume,
    interrupt: true,
  })
  const [playWrongSoundRaw] = useSound(`${SOUND_URL_PREFIX}${wrongResource.filename}`, {
    volume: hintVolume,
    interrupt: true,
  })
  const [playCorrectSoundRaw] = useSound(`${SOUND_URL_PREFIX}${correctResource.filename}`, {
    volume: hintVolume,
    interrupt: true,
  })

  const playClickSound = useCallback(() => {
    if (isKeyOpen && isOpenClickSound) {
      playClickSoundRaw()
    }
  }, [isKeyOpen, isOpenClickSound, playClickSoundRaw])

  const playWrongSound = useCallback(() => {
    if (isHintOpen && isOpenWrongSound) {
      playWrongSoundRaw()
    }
  }, [isHintOpen, isOpenWrongSound, playWrongSoundRaw])

  const playCorrectSound = useCallback(() => {
    if (isHintOpen && isOpenCorrectSound) {
      playCorrectSoundRaw()
    }
  }, [isHintOpen, isOpenCorrectSound, playCorrectSoundRaw])

  return [playClickSound, playWrongSound, playCorrectSound]
}
