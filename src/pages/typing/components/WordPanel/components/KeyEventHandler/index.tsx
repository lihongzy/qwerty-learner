import { useCallback, useContext, useEffect, useRef } from 'react'
import { TypingContext } from '@/pages/typing/store'
import type { WordUpdateAction } from '../InputHandler'
import { isChineseSymbol, isLegal } from '@/shared/utils'

export const KeyEventHandler = ({
  updateInput,
  warnIME,
}: {
  updateInput: (updateObj: WordUpdateAction) => void
  warnIME?: boolean
}) => {
  const { state } = useContext(TypingContext)!
  const pressedKeysRef = useRef<Set<string>>(new Set())

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      const keyIdentity = e.code || e.key

      if (pressedKeysRef.current.has(keyIdentity)) {
        return
      }

      if (e.repeat) {
        return
      }

      const char = e.key

      if (warnIME && isChineseSymbol(char)) {
        alert('您正在使用输入法，请关闭输入法。')
        return
      }

      if (!isLegal(char)) {
        return
      }

      if (e.altKey || e.ctrlKey || e.metaKey) {
        return
      }

      pressedKeysRef.current.add(keyIdentity)
      e.preventDefault()

      updateInput({
        type: 'add',
        value: char,
        event: e,
      })
    },
    [updateInput, warnIME],
  )

  const onKeyup = useCallback(
    (e: KeyboardEvent) => {
      const keyIdentity = e.code || e.key
      pressedKeysRef.current.delete(keyIdentity)
    },
    [],
  )

  useEffect(() => {
    if (!state.isTyping) return

    const clearPressedKeys = () => {
      pressedKeysRef.current.clear()
    }

    window.addEventListener('keydown', onKeydown)
    window.addEventListener('keyup', onKeyup)
    window.addEventListener('blur', clearPressedKeys)

    return () => {
      window.removeEventListener('keydown', onKeydown)
      window.removeEventListener('keyup', onKeyup)
      window.removeEventListener('blur', clearPressedKeys)
      clearPressedKeys()
    }
  }, [state.isTyping, onKeydown, onKeyup])

  return null
}

