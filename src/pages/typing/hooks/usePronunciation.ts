import { useTypingPreferencesStore } from '@/pages/typing/stores';
import type { PronunciationType } from '@/shared/types';
import { useEffect, useMemo, useState } from 'react';
import useSound from 'use-sound';

interface SoundOptions {
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
  html5?: boolean;
  format?: string[];
}

export function generateWordSoundSrc(word: string, pronunciation: Exclude<PronunciationType, false>): string {
  switch (pronunciation) {
    case 'uk':
      return `https://dict.youdao.com/dictvoice?audio=${word}&type=1`;
    case 'us':
      return `https://dict.youdao.com/dictvoice?audio=${word}&type=2`;
    case 'zh':
      return `https://dict.youdao.com/dictvoice?audio=${word}&le=zh`;
    case 'romaji':
    case 'ja':
      return `https://dict.youdao.com/dictvoice?audio=${word}&le=jap`;
    case 'de':
      return `https://dict.youdao.com/dictvoice?audio=${word}&le=de`;
    case 'hapin':
    case 'kk':
      return `https://dict.youdao.com/dictvoice?audio=${word}&le=ru`;
    case 'id':
      return `https://dict.youdao.com/dictvoice?audio=${word}&le=id`;
    default:
      return '';
  }
}

export const usePronunciationSound = (word: string, isLoop?: boolean) => {
  const pronunciationConfig = useTypingPreferencesStore((state) => state.pronunciationConfig);
  const [isPlaying, setIsPlaying] = useState(false);

  const loop = useMemo(
    () => (typeof isLoop === 'boolean' ? isLoop : pronunciationConfig.isLoop),
    [isLoop, pronunciationConfig.isLoop],
  );

  const soundSrc = useMemo(
    () => generateWordSoundSrc(word, pronunciationConfig.type),
    [word, pronunciationConfig.type],
  );

  const soundOptions = useMemo(
    () =>
      ({
        html5: true,
        format: ['mp3'],
        loop,
        volume: pronunciationConfig.volume,
        playbackRate: pronunciationConfig.rate,
      }) satisfies SoundOptions,
    [loop, pronunciationConfig.rate, pronunciationConfig.volume],
  );

  const [play, { stop, sound }] = useSound(soundSrc, soundOptions);

  useEffect(() => {
    if (!sound) {
      return;
    }

    sound.loop(loop);
  }, [loop, sound]);

  useEffect(() => {
    if (!sound) {
      return;
    }

    const onPlay = () => setIsPlaying(true);
    const onEnd = () => setIsPlaying(false);
    const onPause = () => setIsPlaying(false);
    const onError = () => setIsPlaying(false);

    sound.on('play', onPlay);
    sound.on('end', onEnd);
    sound.on('pause', onPause);
    sound.on('playerror', onError);

    return () => {
      sound.off('play', onPlay);
      sound.off('end', onEnd);
      sound.off('pause', onPause);
      sound.off('playerror', onError);
      sound.unload();
    };
  }, [sound]);

  return { play, stop, isPlaying };
};

export function usePrefetchPronunciationSound(word: string | undefined) {
  const pronunciationConfig = useTypingPreferencesStore((state) => state.pronunciationConfig);

  useEffect(() => {
    if (!word) return;

    const soundUrl = generateWordSoundSrc(word, pronunciationConfig.type);
    if (soundUrl === '') return;

    const head = document.head;
    const isPrefetch = (Array.from(head.querySelectorAll('link[href]')) as HTMLLinkElement[]).some(
      (el) => el.href === soundUrl,
    );

    if (!isPrefetch) {
      const audio = new Audio();
      audio.src = soundUrl;
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.style.display = 'none';

      head.appendChild(audio);

      return () => {
        head.removeChild(audio);
      };
    }
  }, [pronunciationConfig.type, word]);
}
