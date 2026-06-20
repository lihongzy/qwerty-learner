import { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { db } from '@/shared/lib/db';

export type DonateStats = {
  chapterNumber: number;
  dayFromFirstWord: number;
  wordNumber: number;
  sumWrongCount: number;
};

export function useDonateStats() {
  const [stats, setStats] = useState<DonateStats | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const [chapterNumber, firstWordRecord, wordNumber, chapterRecords] = await Promise.all([
        db.chapterRecords.count(),
        db.wordRecords.orderBy('timeStamp').first(),
        db.wordRecords.count(),
        db.chapterRecords.toArray(),
      ]);

      const dayFromFirstWord = firstWordRecord?.timeStamp
        ? dayjs().diff(dayjs.unix(firstWordRecord.timeStamp), 'day')
        : 0;
      const sumWrongCount = chapterRecords.reduce((total, record) => total + (record.wrongCount ?? 0), 0);

      setStats({ chapterNumber, dayFromFirstWord, wordNumber, sumWrongCount });
    } catch (error) {
      console.error('Failed to load donate stats:', error);
      setStats({ chapterNumber: 0, dayFromFirstWord: 0, wordNumber: 0, sumWrongCount: 0 });
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, fetchStats };
}
