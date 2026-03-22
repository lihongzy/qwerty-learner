import type { ReactNode } from 'react'
import logo from '@/assets/logo.svg'

type HeaderProps = {
  children?: ReactNode
}

export const Header = ({ children }: HeaderProps) => {
  return (
    <header className="w-full px-4 pt-4 sm:px-6 lg:px-8 lg:pt-5">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 xl:flex-row xl:items-center xl:justify-between">
        <a
          className="group flex items-center gap-3 px-1 py-2 text-text-main transition-colors duration-200 hover:text-text-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool/40"
          href="https://github.com/lihongzy/qwerty-learner"
          rel="noreferrer"
          target="_blank"
        >
          <img src={logo} className="h-7 w-7 shrink-0" alt="Qwerty Learner Logo" />
          <h1 className="min-w-0 truncate text-xl font-semibold tracking-tight text-text-strong">Qwerty Learner</h1>
        </a>

        <nav className="flex w-full flex-wrap items-center justify-center gap-2 py-1 sm:justify-end xl:w-auto">
          {children}
        </nav>
      </div>
    </header>
  )
}
