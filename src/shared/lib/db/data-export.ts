import { db } from '.'

export type ExportProgress = {
  totalRows?: number
  completedRows: number
  done: boolean
}

export type ImportProgress = {
  totalRows?: number
  completedRows: number
  done: boolean
}

function getCurrentDate() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// fflate 返回的底层 buffer 可能被推断成 ArrayBufferLike，这里显式拷贝成基于 ArrayBuffer 的新 Uint8Array。
function toBlobCompatibleUint8Array(uint8Array: Uint8Array) {
  const copied = new Uint8Array(uint8Array.byteLength)
  copied.set(uint8Array)
  return copied
}

export async function exportDatabase(callback: (exportProgress: ExportProgress) => boolean) {
  const [{ gzipSync, strToU8 }, { saveAs }] = await Promise.all([import('fflate'), import('file-saver'), import('dexie-export-import')])

  // 使用 dexie-export-import 先导出数据库，再转成 gzip 文件下载。
  const blob = await db.export({
    progressCallback: ({ totalRows, completedRows, done }) => {
      return callback({ totalRows, completedRows, done })
    },
  })

  const json = await blob.text()
  const compressed = gzipSync(strToU8(json))
  const compressedBlob = new Blob([toBlobCompatibleUint8Array(compressed)], { type: 'application/gzip' })
  const currentDate = getCurrentDate()

  saveAs(compressedBlob, `Qwerty-Learner-User-Data-${currentDate}.gz`)
}

export async function importDatabase(onStart: () => void, callback: (importProgress: ImportProgress) => boolean) {
  const [{ gunzipSync, strFromU8 }] = await Promise.all([import('fflate'), import('dexie-export-import')])

  // 动态创建文件选择器，避免页面上额外放一个隐藏 input。
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.gz,application/gzip'

  input.addEventListener('change', async () => {
    const file = input.files?.[0]
    if (!file) {
      return
    }

    onStart()

    const compressed = await file.arrayBuffer()
    // 先解压 gzip，再交给 dexie-import 恢复数据库。
    const json = strFromU8(gunzipSync(new Uint8Array(compressed)))
    const blob = new Blob([json])

    await db.import(blob, {
      acceptVersionDiff: true,
      acceptMissingTables: true,
      acceptNameDiff: false,
      acceptChangedPrimaryKey: false,
      overwriteValues: true,
      clearTablesBeforeImport: true,
      progressCallback: ({ totalRows, completedRows, done }) => {
        return callback({ totalRows, completedRows, done })
      },
    })
  })

  input.click()
}
