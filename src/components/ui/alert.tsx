/* eslint-disable react/prop-types */
import * as React from 'react'
import { clsx } from 'clsx'

/** 警告弹窗变体类型 */
type AlertVariant = 'default' | 'destructive'

/** Alert 组件属性 */
type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  /** 警告弹窗变体：default 或 destructive */
  variant?: AlertVariant
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Alert 警告弹窗组件
 * 用于显示重要提示信息
 */
export function Alert({
  className,
  variant = 'default',
  ref,
  ...props
}: AlertProps) {
  // 基础样式
  const base =
    'relative w-full rounded-lg border border-slate-200 p-4 ' +
    '[&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] ' +
    '[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 ' +
    '[&>svg]:text-slate-950 dark:border-slate-800 dark:[&>svg]:text-slate-50'

  // 根据 variant 应用不同的样式
  const variantClass =
    variant === 'destructive'
      ? 'bg-white shadow-xl border-none text-red-500 dark:border-red-500 [&>svg]:text-red-500 dark:border-red-900/50 dark:text-red-900 dark:[&>svg]:text-red-900'
      : 'bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50'

  return (
    <div
      ref={ref}
      role="alert"
      className={clsx(base, variantClass, className)}
      {...props}
    />
  )
}
Alert.displayName = 'Alert'

/** AlertTitle 组件属性 */
type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  ref?: React.Ref<HTMLHeadingElement>
}

/**
 * AlertTitle 警告弹窗标题组件
 * 用于显示警告的标题
 */
export function AlertTitle({ className, ref, ...props }: AlertTitleProps) {
  return (
    <h5
      ref={ref}
      className={clsx('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  )
}
AlertTitle.displayName = 'AlertTitle'

/** AlertDescription 组件属性 */
type AlertDescriptionProps = React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>
}

/**
 * AlertDescription 警告弹窗描述组件
 * 用于显示警告的详细描述信息
 */
export function AlertDescription({
  className,
  ref,
  ...props
}: AlertDescriptionProps) {
  return (
    <div
      ref={ref}
      className={clsx('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  )
}
AlertDescription.displayName = 'AlertDescription'