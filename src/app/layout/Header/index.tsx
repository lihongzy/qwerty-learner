import { NavLink } from 'react-router'
import logo from '@/assets/logo.svg'

type HeaderProps = {
  children?: React.ReactNode
}

export const Header = ({ children }: HeaderProps) => {
  return (
    <header className="relative z-20 w-full px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <NavLink
          className="my-focus-ring my-control-shell group flex min-h-[5.25rem] items-center gap-4 px-4 py-3 text-[var(--text-main)] transition-colors duration-200 hover:border-[color:var(--accent-primary)] hover:text-[var(--text-strong)]"
          to="https://github.com/lihongzy/qwerty-learner"
        >
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-[var(--border-main)] bg-[linear-gradient(180deg,var(--bg-panel-strong),var(--bg-elevated))] shadow-[var(--shadow-soft)]">
            <div className="pointer-events-none absolute inset-0 rounded-[18px] bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.2),transparent_55%)] opacity-70" />
            <img src={logo} className="relative h-10 w-10" alt="Qwerty Learner Logo" />
          </div>

          <div className="flex min-w-0 flex-col">
            <span className="font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[0.72rem] font-medium uppercase tracking-[0.28em] text-[var(--text-faint)] transition-colors duration-200 group-hover:text-[var(--accent-primary)]">
              Focused Learning Console
            </span>
            <h1 className="truncate text-[1.45rem] font-semibold tracking-tight text-[var(--text-strong)]">
              Qwerty Learner
            </h1>
          </div>
        </NavLink>

        <nav className="my-control-shell flex min-h-[5.25rem] w-full flex-wrap items-center justify-center gap-2 px-3 py-3 sm:justify-end sm:px-4 xl:w-auto">
          {children}
        </nav>
      </div>
    </header>
  )
}
