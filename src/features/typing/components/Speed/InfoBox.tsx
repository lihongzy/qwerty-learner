import React from 'react'

export type InfoBoxProps = {
  info: string
  description: string
  emphasis?: 'default' | 'primary' | 'accent' | 'success'
}

const emphasisClassMap: Record<NonNullable<InfoBoxProps['emphasis']>, string> = {
  default: 'text-[var(--text-strong)]',
  primary: 'text-[var(--accent-primary)]',
  accent: 'text-[var(--accent-cool)]',
  success: 'text-[var(--state-success)]',
}

const InfoBox: React.FC<InfoBoxProps> = ({ info, description, emphasis = 'default' }) => {
  return (
    <div className="relative flex min-h-[52px] flex-col justify-center pr-3 md:border-r md:border-[var(--border-soft)] md:pr-4 md:last:border-r-0">
      <span
        className={`font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[1.05rem] font-semibold tracking-[0.05em] sm:text-[1.2rem] ${emphasisClassMap[emphasis]}`}
      >
        {info}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
        {description}
      </span>
    </div>
  )
}

export default React.memo(InfoBox)
