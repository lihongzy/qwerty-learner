import { Word } from '@/shared/types';

export async function wordListFetcher(url: string): Promise<Word[]> {
  const URL_PREFIX = import.meta.env.BASE_URL;

  const response = await fetch(URL_PREFIX + url);
  const words: Word[] = await response.json();

  return words;
}
