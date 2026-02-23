import React, { useState } from 'react'
import clsx from 'clsx'

export const Tooltip = ({ children, content, className, placement = 'top' }: TooltipProps) => {
  const [visible, setVisible] = useState(false)

  // 容器定位：top 贴着底边（bottom-full），bottom 贴着顶边（top-full）
  const placementClasses = {
    top: 'bottom-full pb-2',
    bottom: 'top-full pt-2',
  }[placement]

  // 位移动画：模拟示例的 top:-30 -> -50（更“向外”弹出）
  // top：初始向下(更靠近图标) -> 显示时向上(更远)
  // bottom：初始向上(更靠近图标) -> 显示时向下(更远)
  const offsetClasses =
    placement === 'top'
      ? visible
        ? '-translate-y-3' // 显示：更远
        : '-translate-y-1' // 隐藏：更近
      : visible
        ? 'translate-y-3'
        : 'translate-y-1'

  return (
    <div className={clsx('relative inline-flex', className)}>
      <div onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)} onBlur={() => setVisible(false)}>
        {children}
      </div>

      <div
        className={clsx(
          placementClasses,
          'pointer-events-none absolute left-1/2 -translate-x-1/2',
          'transition-all duration-300 ease-out', // 对齐示例 transition: all 0.3s ease
          offsetClasses,
          visible ? 'visible opacity-100' : 'invisible opacity-0',
        )}
      >
        <span
          className={clsx(
            'rounded-md px-2 py-1 text-sm whitespace-nowrap text-white',
            'shadow-md',
            // 如果你想要和示例一样的 tooltip 背景色，可在外部传 class 或按 data-social 自己扩展
            'bg-black',
          )}
        >
          {content}
        </span>
      </div>
    </div>
  )
}

export type TooltipProps = {
  children: React.ReactNode
  content: string
  className?: string
  placement?: 'top' | 'bottom'
}
