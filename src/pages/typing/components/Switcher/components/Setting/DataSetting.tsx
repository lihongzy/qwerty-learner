import type { ExportProgress, ImportProgress } from '@/shared/lib/db/data-export';
import { exportDatabase, importDatabase } from '@/shared/lib/db/data-export';
import { useCallback, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex w-full items-center gap-4">
      <Progress value={value} className="flex-1" />
      <span className="text-muted-foreground w-10 text-xs">{`${value}%`}</span>
    </div>
  );
}

function Section({
  title,
  description,
  warning,
  progress,
  isLoading,
  buttonText,
  loadingText,
  onClick,
}: {
  title: string;
  description: string;
  warning: string;
  progress: number;
  isLoading: boolean;
  buttonText: string;
  loadingText: string;
  onClick: () => void;
}) {
  return (
    <section className="flex w-full flex-col gap-5 rounded-lg border p-6">
      <div className="flex flex-col gap-3">
        <span className="text-xl font-semibold">{title}</span>
        <span className="text-muted-foreground text-sm leading-7">{description}</span>
        <span className="text-destructive text-sm font-semibold">{warning}</span>
      </div>

      <ProgressBar value={progress} />

      <Button onClick={onClick} disabled={isLoading}>
        {isLoading ? loadingText : buttonText}
      </Button>
    </section>
  );
}

export default function DataSetting() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  const exportProgressCallback = useCallback(({ totalRows, completedRows, done }: ExportProgress) => {
    if (done) {
      setIsExporting(false);
      setExportProgress(100);
      return true;
    }

    if (totalRows) {
      setExportProgress(Math.floor((completedRows / totalRows) * 100));
    }

    return true;
  }, []);

  const onClickExport = useCallback(() => {
    setExportProgress(0);
    setIsExporting(true);
    void exportDatabase(exportProgressCallback).catch(() => {
      setIsExporting(false);
      setExportProgress(0);
    });
  }, [exportProgressCallback]);

  const importProgressCallback = useCallback(({ totalRows, completedRows, done }: ImportProgress) => {
    if (done) {
      setIsImporting(false);
      setImportProgress(100);
      return true;
    }

    if (totalRows) {
      setImportProgress(Math.floor((completedRows / totalRows) * 100));
    }

    return true;
  }, []);

  const onStartImport = useCallback(() => {
    setImportProgress(0);
    setIsImporting(true);
  }, []);

  const onClickImport = useCallback(() => {
    void importDatabase(onStartImport, importProgressCallback).catch(() => {
      setIsImporting(false);
      setImportProgress(0);
    });
  }, [importProgressCallback, onStartImport]);

  return (
    <ScrollArea className="h-full px-6 py-8">
      <div className="flex w-full flex-col gap-8">
        <Section
          title="导出用户数据"
          description="将当前浏览器中的练习记录导出为压缩备份文件，适合在更换设备、重装浏览器或做长期备份时使用。"
          warning="导出的文件中包含你的本地学习记录，请妥善保管，避免泄露。"
          progress={exportProgress}
          isLoading={isExporting}
          buttonText="导出用户数据"
          loadingText="导出中..."
          onClick={onClickExport}
        />

        <Section
          title="导入用户数据"
          description="从之前导出的备份文件中恢复数据。导入时会先清空当前本地记录，再写入备份中的内容。"
          warning="导入操作会覆盖当前本地数据，请先确认备份文件正确无误。"
          progress={importProgress}
          isLoading={isImporting}
          buttonText="导入用户数据"
          loadingText="导入中..."
          onClick={onClickImport}
        />
      </div>
    </ScrollArea>
  );
}
