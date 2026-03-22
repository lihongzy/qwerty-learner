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
    <div className="group relative flex min-h-[88px] flex-col justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[linear-gradient(180deg,var(--bg-elevated),var(--bg-panel))] px-4 py-3 transition-colors duration-200 hover:border-[var(--accent-primary)] hover:bg-[linear-gradient(180deg,var(--bg-panel-strong),var(--bg-panel))]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_34%)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-y-4 right-0 w-px bg-gradient-to-b from-transparent via-[var(--border-main)] to-transparent group-last:hidden" />

      <span
        className={`relative font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[1.45rem] font-semibold tracking-[0.06em] sm:text-[1.7rem] ${emphasisClassMap[emphasis]}`}
      >
        {info}
      </span>
      <span className="relative mt-2 text-[11px] font-semibold tracking-[0.22em] text-[var(--text-faint)] uppercase">
        {description}
      </span>
    </div>
  )
}

export default React.memo(InfoBox)