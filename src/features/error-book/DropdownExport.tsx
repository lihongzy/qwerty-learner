import { idDictionaryMap } from '@/shared/resources/dictionary'
import { wordListFetcher } from '@/shared/utils/wordListFetcher'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { saveAs } from 'file-saver'
import type { FC } from 'react'
import { useState } from 'react'
import * as XLSX from 'xlsx'

type ExportRecord = {
  word: string
  dict: string
  wrongCount: number
}

type DropdownProps = {
  renderRecords: ExportRecord[]
}

const menuItemClassName =
  'my-focus-ring cursor-pointer rounded-[var(--radius-sm)] px-3 py-2 text-sm text-[var(--text-main)] transition-colors duration-150 hover:bg-[var(--accent-primary-soft)] hover:text-[var(--text-strong)]'

const DropdownExport: FC<DropdownProps> = ({ renderRecords }) => {
  const [isExporting, setIsExporting] = useState(false)

  const formatTimestamp = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}-${minutes}-${seconds}`
  }

  const handleExport = async (bookType: 'xlsx' | 'csv' | 'txt') => {
    setIsExporting(true)

    try {
      const dictUrls: string[] = []
      renderRecords.forEach((item) => {
        const dictInfo = idDictionaryMap[item.dict]
        if (dictInfo?.url && !dictUrls.includes(dictInfo.url)) {
          dictUrls.push(dictInfo.url)
        }
      })

      const dictDataResults = await Promise.all(
        dictUrls.map(async (url) => {
          try {
            const data = await wordListFetcher(url)
            return { url, data }
          } catch (error) {
            console.error(`获取词典数据失败: ${url}`, error)
            return { url, data: [] }
          }
        }),
      )
      const dictDataMap = new Map(dictDataResults.map((result) => [result.url, result.data]))

      const exportData: Array<{ 单词: string; 释义: string; 错误次数: number; 词典: string }> = []

      renderRecords.forEach((item) => {
        const dictInfo = idDictionaryMap[item.dict]
        let translation = ''

        if (dictInfo?.url && dictDataMap.has(dictInfo.url)) {
          const wordList = dictDataMap.get(dictInfo.url) || []
          const word = wordList.find((entry) => entry.name === item.word)
          translation = word ? word.trans.join('；') : ''
        }

        exportData.push({
          单词: item.word,
          释义: translation,
          错误次数: item.wrongCount,
          词典: dictInfo?.name || item.dict,
        })
      })

      let blob: Blob

      if (bookType === 'txt') {
        const content = exportData.map((item) => `${item.单词}: ${item.释义}`).join('\n')
        blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
      } else {
        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, '错题')
        const excelBuffer = XLSX.write(workbook, { bookType: bookType as XLSX.BookType, type: 'array' })
        blob = new Blob([excelBuffer], { type: 'application/octet-stream' })
      }

      saveAs(blob, `错题本-${formatTimestamp(new Date())}.${bookType}`)
    } catch (error) {
      console.error('导出失败', error)
      alert('导出失败，请重试')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="my-btn-primary my-focus-ring h-9 px-4 text-sm shadow-none" disabled={isExporting}>
          {isExporting ? '导出中...' : '导出'}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className="z-50 min-w-[9rem] rounded-[var(--radius-md)] border border-[var(--border-main)] bg-[linear-gradient(180deg,var(--bg-panel-strong),var(--bg-panel))] p-1.5 text-[var(--text-main)] shadow-[var(--shadow-panel)] backdrop-blur-md"
        >
          <DropdownMenu.Item className={menuItemClassName} onClick={() => void handleExport('xlsx')} disabled={isExporting}>
            导出为 .xlsx
          </DropdownMenu.Item>
          <DropdownMenu.Item className={menuItemClassName} onClick={() => void handleExport('csv')} disabled={isExporting}>
            导出为 .csv
          </DropdownMenu.Item>
          <DropdownMenu.Item className={menuItemClassName} onClick={() => void handleExport('txt')} disabled={isExporting}>
            导出为 .txt
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export default DropdownExport
