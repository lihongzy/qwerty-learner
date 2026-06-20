import { Button } from '@/components/ui/button';
import type { Word } from '@/shared/types';
import { idDictionaryMap } from '@/shared/resources/dictionary';
import { wordListFetcher } from '@/shared/utils/wordListFetcher';
import { saveAs } from 'file-saver';
import { useState } from 'react';
import * as XLSX from 'xlsx';

type ExportRecord = {
  word: string;
  dict: string;
  wrongCount: number;
};

type DropdownProps = {
  renderRecords: ExportRecord[];
};

function formatTimestamp(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
}

const menuItemClass = 'cursor-pointer rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted';

const DropdownExport = ({ renderRecords }: DropdownProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleExport = async (bookType: 'xlsx' | 'csv' | 'txt') => {
    setIsExporting(true);
    setOpen(false);
    try {
      const dictUrls = [
        ...new Set(renderRecords.map((item) => idDictionaryMap[item.dict]?.url).filter(Boolean) as string[]),
      ];
      const dictDataMap = new Map(
        await Promise.all(
          dictUrls.map(async (url): Promise<[string, Word[]]> => {
            try {
              return [url, await wordListFetcher(url)];
            } catch (e) {
              console.error(`获取词典数据失败: ${url}`, e);
              return [url, []];
            }
          }),
        ),
      );

      const exportData = renderRecords.map((item) => {
        const dictInfo = idDictionaryMap[item.dict];
        const wordList = dictInfo?.url && dictDataMap.has(dictInfo.url) ? dictDataMap.get(dictInfo.url)! : [];
        const word = wordList.find((entry) => entry.name === item.word);
        return {
          单词: item.word,
          释义: word ? word.trans.join('；') : '',
          错误次数: item.wrongCount,
          词典: dictInfo?.name || item.dict,
        };
      });

      let blob: Blob;
      if (bookType === 'txt') {
        blob = new Blob([exportData.map((item) => `${item.单词}: ${item.释义}`).join('\n')], {
          type: 'text/plain;charset=utf-8',
        });
      } else {
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(exportData), '错题');
        blob = new Blob([XLSX.write(workbook, { bookType: bookType as XLSX.BookType, type: 'array' })], {
          type: 'application/octet-stream',
        });
      }
      saveAs(blob, `错题本-${formatTimestamp(new Date())}.${bookType}`);
    } catch (e) {
      console.error('导出失败', e);
      alert('导出失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative inline-flex justify-self-end">
      <Button size="sm" disabled={isExporting} onClick={() => setOpen((v) => !v)}>
        {isExporting ? '导出中...' : '导出'}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="bg-popover absolute top-full right-0 z-50 mt-1 w-36 rounded-md border p-1.5 shadow-md">
            <div className={menuItemClass} onClick={() => void handleExport('xlsx')}>
              导出为 .xlsx
            </div>
            <div className={menuItemClass} onClick={() => void handleExport('csv')}>
              导出为 .csv
            </div>
            <div className={menuItemClass} onClick={() => void handleExport('txt')}>
              导出为 .txt
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DropdownExport;
