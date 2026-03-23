import React from 'react'

export type InfoBoxProps = {
  info: string
  description: string
  emphasis?: 'default' | 'primary' | 'accent' | 'success'
}

const emphasisClassMap: Record<NonNullable<InfoBoxProps['emphasis']>, string> = {
  default: 'text-text-strong',
  primary: 'text-accent-primary',
  accent: 'text-accent-cool',
  success: 'text-state-success',
}

const InfoBox: React.FC<InfoBoxProps> = ({ info, description, emphasis = 'default' }) => {
  return (
    <div className="relative flex min-h-12 flex-col justify-center pr-3 md:border-r md:border-border-soft md:pr-4 md:last:border-r-0">
      <span className={`text-lg font-semibold sm:text-xl ${emphasisClassMap[emphasis]}`}>{info}</span>
      <span className="mt-1 text-xs text-text-faint">
        {description}
      </span>
    </div>
  )
}

export default React.memo(InfoBox)
