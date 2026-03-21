import { LanguageType } from '@/shared/types/resource'

export type PronunciationType = 'us' | 'uk' | 'romaji' | 'zh' | 'ja' | 'de' | 'hapin' | 'kk' | 'id'
export type PronunciationConfig = {
  name: string
  pron: PronunciationType
}
export type LanguagePronunciationMapConfig = {
  defaultPronIndex: number
  pronunciation: PronunciationConfig[]
}

export type LanguagePronunciationMap = {
  [key in LanguageType]: LanguagePronunciationMapConfig
}

export type SoundResource = {
  key: string
  name: string
  filename: string
}

export const SOUND_URL_PREFIX = './sounds/'
export const KEY_SOUND_URL_PREFIX = SOUND_URL_PREFIX + 'key-sound/'

const videoList = import.meta.glob(['../../../public/sounds/key-sound/*.(wav|mp3)'], {
  eager: false,
})

/**
 * The mechanical keyboard sounds come from https://github.com/tplai/kbsim.
 */
export const keySoundResources: SoundResource[] = Object.keys(videoList)
  .map((k) => {
    const name = k.replace(/(.*\/)*([^.]+).*/gi, '$2')
    const suffix = k.substring(k.lastIndexOf('.'))
    return {
      key: name,
      name: `${name}`,
      filename: `${name}${suffix}`,
    }
  })
  .sort((a, b) => {
    if (a.key === 'Default') {
      return -1
    }
    if (b.key === 'Default') {
      return 1
    }

    return a.key.localeCompare(b.key)
  })

export const wrongSoundResources: SoundResource[] = [{ key: '1', name: 'Sound 1', filename: 'beep.wav' }]

export const correctSoundResources: SoundResource[] = [{ key: '1', name: 'Sound 1', filename: 'correct.wav' }]

export const LANG_PRON_MAP: LanguagePronunciationMap = {
  en: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: 'American',
        pron: 'us',
      },
      {
        name: 'British',
        pron: 'uk',
      },
    ],
  },
  code: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: 'American',
        pron: 'us',
      },
      {
        name: 'British',
        pron: 'uk',
      },
    ],
  },
  de: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: 'German',
        pron: 'de',
      },
    ],
  },
  romaji: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: 'Romaji',
        pron: 'romaji',
      },
    ],
  },
  hapin: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: 'Hapin',
        pron: 'hapin',
      },
    ],
  },
  zh: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: 'Mandarin',
        pron: 'zh',
      },
    ],
  },
  ja: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: 'Japanese',
        pron: 'ja',
      },
    ],
  },
  kk: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: 'Kazakh',
        pron: 'kk',
      },
    ],
  },
  id: {
    defaultPronIndex: 0,
    pronunciation: [
      {
        name: 'Indonesian',
        pron: 'id',
      },
    ],
  },
}
