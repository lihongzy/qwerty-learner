import type { ExportProgress, ImportProgress } from '@/shared/lib/db/data-export'
import { exportDatabase, importDatabase } from '@/shared/lib/db/data-export'
import * as Progress from '@radix-ui/react-progress'
import * as ScrollArea from '@radix-ui/react-scroll-area'
import { useCallback, useState } from 'react'

// 通用进度条，复用在导入和导出两个流程里。
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex h-3 w-full items-center justify-start px-5">
      <Progress.Root className="relative h-2 w-11/12 overflow-hidden rounded-full bg-bg-elevated" value={value}>
        <Progress.Indicator
          className="h-full w-full bg-accent-primary transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </Progress.Root>
      <span className="ml-4 w-10 text-xs font-normal text-text-muted">{`${value}%`}</span>
    </div>
  )
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
  title: string
  description: string
  warning: string
  progress: number
  isLoading: boolean
  buttonText: string
  loadingText: string
  onClick: () => void
}) {
  return (
    <section className="flex w-full flex-col items-start gap-5 rounded-app-md border border-border-main bg-bg-panel px-6 py-6 shadow-app-soft">
      <div className="flex w-full flex-col items-start gap-3">
        <span className="text-left text-xl font-semibold text-text-strong">{title}</span>
        <span className="text-left text-sm leading-7 text-text-muted">{description}</span>
        <span className="text-left text-sm font-semibold leading-6 text-state-error">{warning}</span>
      </div>

      <ProgressBar value={progress} />

      <button
        className="ml-1 inline-flex items-center justify-center rounded-md bg-accent-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-primary-hover disabled:cursor-not-allowed disabled:bg-bg-elevated disabled:text-text-faint"
        type="button"
        onClick={onClick}
        disabled={isLoading}
        title={title}
      >
        {isLoading ? loadingText : buttonText}
      </button>
    </section>
  )
}

export default function DataSetting() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)

  // 导出过程中持续同步进度，并在完成后收起 loading 状态。
  const exportProgressCallback = useCallback(({ totalRows, completedRows, done }: ExportProgress) => {
    if (done) {
      setIsExporting(false)
      setExportProgress(100)
      return true
    }

    if (totalRows) {
      setExportProgress(Math.floor((completedRows / totalRows) * 100))
    }

    return true
  }, [])

  // 点击后启动数据库导出；失败时重置界面状态。
  const onClickExport = useCallback(() => {
    setExportProgress(0)
    setIsExporting(true)
    void exportDatabase(exportProgressCallback).catch(() => {
      setIsExporting(false)
      setExportProgress(0)
    })
  }, [exportProgressCallback])

  // 导入过程中持续同步进度，并在完成后更新为 100%。
  const importProgressCallback = useCallback(({ totalRows, completedRows, done }: ImportProgress) => {
    if (done) {
      setIsImporting(false)
      setImportProgress(100)
      return true
    }

    if (totalRows) {
      setImportProgress(Math.floor((completedRows / totalRows) * 100))
    }

    return true
  }, [])

  // 用户真正选中文件后，再切换到导入中的界面状态。
  const onStartImport = useCallback(() => {
    setImportProgress(0)
    setIsImporting(true)
  }, [])

  // 点击后打开文件选择器并开始导入；失败时回退到初始状态。
  const onClickImport = useCallback(() => {
    void importDatabase(onStartImport, importProgressCallback).catch(() => {
      setIsImporting(false)
      setImportProgress(0)
    })
  }, [importProgressCallback, onStartImport])

  return (
    <ScrollArea.Root className="flex-1 select-none overflow-y-auto">
      <ScrollArea.Viewport className="h-full w-full px-3">
        {/* 数据设置内容较长，放在可滚动区域中展示。 */}
        <div className="flex w-full flex-col items-start gap-10 overflow-y-auto px-3 pb-20 pt-8">
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
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="flex touch-none select-none bg-transparent" orientation="vertical" />
    </ScrollArea.Root>
  )
}
