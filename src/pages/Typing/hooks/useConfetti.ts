
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

// Shared visual defaults for each confetti burst.
export const CONFETTI_DEFAULTS = {
  colors: ['#5D8C7B', '#F2D091', '#F2A679', '#D9695F', '#8C4646'],
  shapes: ['square'],
  ticks: 500,
} as confetti.Options

export function useConfetti(state: boolean) {
  useEffect(() => {
    let leftConfettiTimer: number | undefined
    let rightConfettiTimer: number | undefined

    if (state) {
      // Fire from the left first so the celebration feels staggered instead of perfectly synced.
      leftConfettiTimer = window.setTimeout(() => {
        confetti({
          ...CONFETTI_DEFAULTS,
          particleCount: 50,
          angle: 60,
          spread: 100,
          origin: { x: 0 },
        })
      }, 250)

      // Fire from the right shortly after to mirror the effect across the screen.
      rightConfettiTimer = window.setTimeout(() => {
        confetti({
          ...CONFETTI_DEFAULTS,
          particleCount: 50,
          angle: 120,
          spread: 100,
          origin: { x: 1 },
        })
      }, 400)
    }

    // Cancel pending bursts when the effect reruns or the component unmounts.
    return () => {
      window.clearTimeout(leftConfettiTimer)
      window.clearTimeout(rightConfettiTimer)
    }
  }, [state])
}
