import type React from 'react'

interface DataTagProps {
  icon: React.ElementType
  name: string
  data: number | string
}

const DataTag: React.FC<DataTagProps> = ({ icon, name, data }) => {
  const IconComponent = icon

  return (
    <div className="my-panel flex min-h-[4.75rem] min-w-[11rem] flex-1 items-center justify-between gap-3 px-4 py-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]">
          <IconComponent className="h-4.5 w-4.5" />
        </div>
        <span className="text-sm text-[var(--text-muted)]">{name}</span>
      </div>
      <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-base font-semibold text-[var(--text-strong)]">{data}</span>
    </div>
  )
}

export default DataTag
