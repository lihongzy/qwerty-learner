import type { JSX } from 'react'

export type ActionButtonConfig = {
  key: string
  label: string
  title: string
  tooltip: string
  className?: string
  onClick: () => void
}

export type UtilityButtonConfig = {
  key: string
  title: string
  className?: string
  onClick?: () => void
  href?: string
  icon: JSX.Element
}
