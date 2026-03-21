
import clamp from '@/utils'
import { useMemo } from 'react'
import clsx from 'clsx'

/**
 * 统计环组件 Props
 */
export type RemarkRingProps = {
  remark: string          // 显示的数值（如 "85%", "01:30"）
  caption: string         // 底部说明文字（如 "正确率"）
  /**
   * 进度百分比。如果不适用则为 null，否则为 0-100 之间的整数。
   */
  percentage?: number | null
  /**
   * 环的大小，默认为 7 rem
   */
  size?: number
}

/**
 * 统计环组件
 * 用于在结果页面显示数据指标（正确率、WPM等），支持进度环效果
 */
export default function RemarkRing({ remark, caption, percentage = null, size = 7 }: RemarkRingProps) {
  // 获取 root 元素的 font-size，用于计算圆的尺寸
  // 兼容 SSR：服务端渲染时 window 不存在，返回默认值 16
  const rootFontSize = useMemo(() => {
    if (typeof window === 'undefined') return 16
    return parseInt(window.getComputedStyle(document.documentElement).getPropertyValue('font-size'))
  }, [])

  // 计算裁剪路径（clip-path），用于实现进度环效果
  // 使用 SVG path 来定义裁剪区域
  const clipPath = useMemo((): string | undefined => {
    // 如果没有 percentage，不显示进度环
    if (percentage === null) {
      return undefined
    }

    // 限制百分比在 0-100 范围内
    const clamped = clamp(percentage, 0, 100)

    // 100% 时不需要裁剪，显示完整边框
    if (clamped === 100) {
      return undefined
    }

    // ========== 圆环绘制原理 ==========
    //
    // 使用 SVG path 绘制一个扇形，然后通过 clip-path 裁剪边框
    //
    // 1. 计算弧度：alpha = 2π * (百分比/100)
    //    例如：25% = 0.5π弧度，75% = 1.5π弧度
    //
    // 2. 计算圆心坐标 (r, r)，r = rootFontSize * size / 2
    //
    // 3. SVG path 命令：
    //    M ${r},0                    // Move to: 从顶部圆心开始
    //    A ${r},${r} 0 ...           // Arc: 绘制椭圆弧
    //    L ${r},${r}                 // Line to: 回到圆心（形成扇形）
    //    Z                           // Close path: 闭合路径
    //
    // ========== 详细说明 ==========
    //
    // 圆环结构：
    // ┌─────────────────┐
    // │    ┌───────┐    │
    // │    │  数值  │    │  ← 中心内容
    // │    └───────┘    │
    // │   ╭─────────╮   │  ← 进度环（被裁剪的边框）
    // │  ╱           ╲  │
    // │ ╱             ╲ │
    // │╱               ╲│  ← 基础边框（完整圆形）
    // └─────────────────┘
    //
    // 进度环实现方式：
    // - 外层 div：有完整边框（border-indigo-200，灰色）
    // - 内层 div：有彩色边框（border-indigo-400，蓝色）
    // - 内层 div 使用 clip-path 裁剪，只显示部分边框

    // 计算弧度（0-2π）
    const alpha = Math.PI * 2 * (clamped / 100)

    // 计算半径：root font-size * size / 2
    const r = (rootFontSize * size) / 2

    // 绘制 SVG path
    // M ${r},0           → 从顶部开始（圆的最上方）
    // A ${r},${r}        → 椭圆弧，半径为 r
    // 0 ${clamped > 50 ? 1 : 0},1  → 大弧标志位：>50% 时用大弧
    // ${r + Math.sin(alpha) * r},${r + -Math.cos(alpha) * r}  → 弧的终点坐标
    //   - sin(alpha) * r 计算 x 偏移
    //   - -cos(alpha) * r 计算 y 偏移（负号因为 SVG y 轴向下）
    // L ${r},${r}        → 画线到圆心（形成扇形区域）
    // Z                   → 闭合路径
    const path = `M ${r},0 A ${r},${r} 0 ${clamped > 50 ? 1 : 0},1 ${r + Math.sin(alpha) * r},${r + -Math.cos(alpha) * r} L ${r},${r} Z`

    return `path("${path}")`
  }, [percentage, size])

  return (
    <div
      className={clsx(
        // 相对定位
        'relative',
        // Flex 布局，垂直排列，居中显示
        'flex flex-shrink-0 flex-col items-center justify-center',
        // 圆形
        'rounded-full',
        // 边框样式：8px 宽，浅蓝色（暗色模式下灰色）
        'border-8 border-indigo-200 bg-transparent dark:border-gray-700',
      )}
      style={{
        // 动态设置尺寸
        width: `${size}rem`,
        height: `${size}rem`,
      }}
    >
      {/* 进度环：使用 clip-path 裁剪的彩色边框 */}
      {/* 只有当 percentage 不为 null 时才显示 */}
      {percentage !== null && (
        <div
          className={clsx(
            // 绝对定位，偏移 -inset-2（向外扩展以覆盖外层边框）
            'absolute -inset-2',
            // 同样的圆形和边框样式
            'rounded-full border-8 border-indigo-400 bg-transparent dark:border-indigo-500',
          )}
          style={{ clipPath }}
          aria-hidden
        />
      )}

      {/* 显示的数值 */}
      <span className="text-xl tabular-nums text-gray-800 dark:text-gray-300">{remark}</span>

      {/* 底部说明文字 */}
      <span className="text-sm font-medium text-gray-600 dark:text-gray-500">{caption}</span>
    </div>
  )
}
