import { readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const includedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.md', '.html'])
const ignoredDirs = new Set(['.git', 'node_modules', 'dist', 'target'])

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(rootDir, fullPath)

    if (entry.isDirectory()) {
      if (ignoredDirs.has(entry.name)) {
        continue
      }
      walk(fullPath)
      continue
    }

    if (!entry.isFile()) {
      continue
    }

    if (!includedExtensions.has(path.extname(entry.name).toLowerCase())) {
      continue
    }

    const fileBuffer = readFileSync(fullPath)
    try {
      new TextDecoder('utf-8', { fatal: true }).decode(fileBuffer)
    } catch (error) {
      console.error(`Non-UTF-8 file: ${relativePath}`)
      console.error(error instanceof Error ? error.message : String(error))
      process.exitCode = 1
    }
  }
}

walk(rootDir)

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log('Encoding check passed.')
