import { TypingContext } from '@/pages/typing/store'
import { useCallback, useContext, useEffect, useRef } from 'react'
import type { WordUpdateAction } from '../InputHandler'

type IMECompositionHandlerProps = {
  updateInput: (updateObj: WordUpdateAction) => void
}

export const IMECompositionHandler = ({ updateInput }: IMECompositionHandlerProps) => {
  const { state } = useContext(TypingContext)!
  const inputRef = useRef<HTMLInputElement>(null)
  const isComposingRef = useRef(false)

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const commitValue = useCallback(
    (value: string) => {
      if (!value) return

      for (const char of value) {
        updateInput({
          type: 'add',
          value: char,
          event: new KeyboardEvent('keydown', { key: char }),
        })
      }
    },
    [updateInput],
  )

  useEffect(() => {
    if (!state.isTyping) {
      inputRef.current?.blur()
      return
    }

    focusInput()
  }, [focusInput, state.isTyping])

  useEffect(() => {
    const handleWindowPointerDown = () => {
      if (state.isTyping) {
        focusInput()
      }
    }

    window.addEventListener('pointerdown', handleWindowPointerDown)

    return () => {
      window.removeEventListener('pointerdown', handleWindowPointerDown)
    }
  }, [focusInput, state.isTyping])

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="text"
      autoCapitalize="off"
      autoComplete="off"
      autoCorrect="off"
      spellCheck={false}
      className="pointer-events-none absolute h-px w-px opacity-0"
      aria-hidden="true"
      onCompositionStart={() => {
        isComposingRef.current = true
      }}
      onCompositionEnd={(event) => {
        isComposingRef.current = false
        commitValue(event.data || event.currentTarget.value)
        event.currentTarget.value = ''
      }}
      onInput={(event) => {
        if (isComposingRef.current) {
          return
        }

        commitValue(event.currentTarget.value)
        event.currentTarget.value = ''
      }}
      onBlur={() => {
        if (state.isTyping) {
          requestAnimationFrame(() => {
            focusInput()
          })
        }
      }}
    />
  )
}
