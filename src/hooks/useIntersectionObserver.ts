import type { RefObject } from 'react'
import { useEffect, useRef, useState } from 'react'

type UseIntersectionObserverArgs = IntersectionObserverInit & {
  freezeOnceVisible?: boolean
  initialIsIntersecting?: boolean
  onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void
}

type UseIntersectionObserverReturn<T extends Element> = {
  ref: (node: T | null) => void
  isIntersecting: boolean
  entry?: IntersectionObserverEntry
}

function isRefObject<T extends Element>(value: RefObject<T | null> | UseIntersectionObserverArgs | undefined): value is RefObject<T | null> {
  return typeof value === 'object' && value !== null && 'current' in value
}

export default function useIntersectionObserver<T extends Element>(
  targetRef: RefObject<T | null>,
  options?: UseIntersectionObserverArgs,
): IntersectionObserverEntry | undefined
export default function useIntersectionObserver<T extends Element = Element>(
  options?: UseIntersectionObserverArgs,
): UseIntersectionObserverReturn<T>
export default function useIntersectionObserver<T extends Element = Element>(
  targetRefOrOptions?: RefObject<T | null> | UseIntersectionObserverArgs,
  options?: UseIntersectionObserverArgs,
): IntersectionObserverEntry | undefined | UseIntersectionObserverReturn<T> {
  const isLegacyMode = isRefObject(targetRefOrOptions)
  const legacyRef = isLegacyMode ? targetRefOrOptions : undefined
  const observerOptions = isLegacyMode ? options : targetRefOrOptions

  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
    initialIsIntersecting = false,
    onChange,
  } = observerOptions ?? {}

  const [observedNode, setObservedNode] = useState<T | null>(null)
  const [entry, setEntry] = useState<IntersectionObserverEntry>()
  const callbackRef = useRef(onChange)
  callbackRef.current = onChange

  const frozen = entry?.isIntersecting && freezeOnceVisible
  const target = legacyRef?.current ?? observedNode

  useEffect(() => {
    if (!target || typeof IntersectionObserver === 'undefined' || frozen) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const thresholds = Array.isArray(observer.thresholds) ? observer.thresholds : [threshold]

        entries.forEach((nextEntry) => {
          const isIntersecting =
            nextEntry.isIntersecting && thresholds.some((observerThreshold) => nextEntry.intersectionRatio >= observerThreshold)

          setEntry(nextEntry)
          callbackRef.current?.(isIntersecting, nextEntry)

          if (isIntersecting && freezeOnceVisible) {
            observer.unobserve(nextEntry.target)
          }
        })
      },
      { threshold, root, rootMargin },
    )

    observer.observe(target)

    return () => {
      observer.disconnect()
    }
  }, [freezeOnceVisible, frozen, root, rootMargin, target, threshold])

  useEffect(() => {
    if (!target && entry) {
      setEntry(undefined)
    }
  }, [entry, target])

  if (isLegacyMode) {
    return entry
  }

  return {
    ref: (node: T | null) => {
      setObservedNode(node)
    },
    isIntersecting: entry?.isIntersecting ?? initialIsIntersecting,
    entry,
  }
}
