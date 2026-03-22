type NotationProps = {
  notation: string
}

export const Notation = ({ notation }: NotationProps) => {
  return (
    <div className="px-2 text-xs font-medium tracking-[0.12em] text-[var(--text-muted)]">
      {notation}
    </div>
  )
}
