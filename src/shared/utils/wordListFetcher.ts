import { Word } from '@/shared/types';

function withBaseUrl(path: string) {
  const baseUrl = import.meta.env.BASE_URL;

  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export async function wordListFetcher(url: string): Promise<Word[]> {
  const response = await fetch(withBaseUrl(url));
  const words: Word[] = await response.json();

  return words;
}
