type NotationProps = {
  notation: string
}

export const Notation = ({ notation }: NotationProps) => {
  return (
    <div className="rounded-full border border-[var(--border-soft)] bg-[linear-gradient(180deg,var(--bg-ghost),var(--bg-elevated))] px-3.5 py-1.5 text-sm font-medium tracking-[0.08em] text-[var(--text-muted)] shadow-[var(--shadow-soft)]">
      {notation}
    </div>
  )
}
