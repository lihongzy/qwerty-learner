type NotationProps = {
  notation: string
}

export const Notation = ({ notation }: NotationProps) => {
  return <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">{notation}</div>
}
