import { MouseEventHandler, useEffect, useState } from 'react'
import { VolumeIcon, VolumeLowIcon, VolumeMediumIcon, VolumeHighIcon } from './VolumeIcon'
import clsx from 'clsx'

export type SoundIconProps = {
  animated?: boolean
  duration?: number
  onClick?: MouseEventHandler<HTMLButtonElement>
  iconClassName?: string
  className?: string
}

const volumeIcons = [VolumeIcon, VolumeLowIcon, VolumeMediumIcon, VolumeHighIcon]

export const SoundIcon = ({ duration = 500, animated = false, onClick, iconClassName, className }: SoundIconProps) => {
  const [animationFrameIndex, setAnimationFrameIndex] = useState(0)

  useEffect(() => {
    if (!animated) {
      setAnimationFrameIndex(0)
      return
    }

    const interval = setInterval(() => {
      setAnimationFrameIndex((prev) => (prev < volumeIcons.length - 1 ? prev + 1 : 0))
    }, duration)

    return () => clearInterval(interval)
  }, [animated, duration])

  const Icon = volumeIcons[animationFrameIndex]

  return (
    <button type={'button'} className={clsx('inline-flex items-center justify-center focus:outline-none', className)} onClick={onClick}>
      <Icon className={clsx('h-8 w-8', iconClassName)} />
    </button>
  )
}
