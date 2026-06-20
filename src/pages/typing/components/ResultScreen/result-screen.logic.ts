import type { WordWithIndex } from '@/shared/types';
import type { ChapterData, UserInputLog } from '@/pages/typing/store/type';
import { RESULT_SCREEN_COPY } from './copy';

export function formatTimeString(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// ResultScreen only cares about words the user actually mistyped.
export function getWrongWords(chapterData: ChapterData): WordWithIndex[] {
  return chapterData.userInputLogs
    .filter((log: UserInputLog) => log.wrongCount > 0)
    .map((log: UserInputLog) => chapterData.words[log.index])
    .filter((word): word is WordWithIndex => word !== undefined);
}

export function getCorrectRate(chapterLength: number, wrongWordCount: number) {
  if (chapterLength === 0) {
    return 0;
  }

  const correctCount = chapterLength - wrongWordCount;
  return Math.floor((correctCount / chapterLength) * 100);
}

export function getMistakeLevel(correctRate: number) {
  if (correctRate >= 85) return 0;
  if (correctRate >= 70) return 1;
  return 2;
}

export function getChapterTitle(dictName: string, chapter: number, isReviewMode: boolean) {
  return `${dictName} ${isReviewMode ? RESULT_SCREEN_COPY.reviewChapterSuffix : RESULT_SCREEN_COPY.chapterLabel(chapter + 1)}`;
}

// Keep export shaping outside JSX so the screen component only wires actions.
export function buildResultExportData(chapterData: ChapterData) {
  return chapterData.userInputLogs.flatMap((log: UserInputLog) => {
    const word = chapterData.words[log.index];
    if (!word) {
      return [];
    }

    const wordName = word.name;

    return [
      {
        ...word,
        trans: word.trans.join(';'),
        correctCount: log.correctCount,
        wrongCount: log.wrongCount,
        wrongLetters: Object.entries(log.LetterMistakes)
          .map(([key, mistakes]) => `${wordName[Number(key)]}:${(mistakes as number[]).length}`)
          .join(';'),
      },
    ];
  });
}

// Lazily load xlsx only when the user explicitly exports results.
export async function exportResultWords(chapterData: ChapterData, exportFileName: string) {
  const exportData = buildResultExportData(chapterData);
  const { utils, writeFileXLSX } = await import('xlsx');
  const workSheet = utils.json_to_sheet(exportData);
  const workBook = utils.book_new();
  utils.book_append_sheet(workBook, workSheet, 'Data');
  writeFileXLSX(workBook, exportFileName);
}
