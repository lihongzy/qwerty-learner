import { useCallback, useContext, useEffect, useRef } from 'react'
import { TypingContext } from '@/pages/Typing/store'
import type { WordUpdateAction } from '../InputHandler'
import { isChineseSymbol, isLegal } from '@/utils'

type ActiveElementDebug = {
  tagName?: string
  text?: string
  ariaLabel?: string | null
  title?: string | null
  className?: string
}

type KeyDebugPayload = {
  phase: 'keydown' | 'keyup' | 'blur'
  reason?: string
  key?: string
  code?: string
  repeat?: boolean
  altKey?: boolean
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  isComposing?: boolean
  defaultPrevented?: boolean
  keyIdentity?: string
  pressedKeys?: string[]
  isTyping?: boolean
  activeElement?: ActiveElementDebug | null
}

const getActiveElementDebug = (): ActiveElementDebug | null => {
  const activeElement = document.activeElement as HTMLElement | null
  if (!activeElement) {
    return null
  }

  return {
    tagName: activeElement.tagName,
    text: activeElement.textContent?.trim().slice(0, 40),
    ariaLabel: activeElement.getAttribute('aria-label'),
    title: activeElement.getAttribute('title'),
    className: typeof activeElement.className === 'string' ? activeElement.className : '',
  }
}

const logKeyDebug = (payload: KeyDebugPayload) => {
  console.debug('[typing-key-debug]', payload)
}

export const KeyEventHandler = ({ updateInput }: { updateInput: (updateObj: WordUpdateAction) => void }) => {
  const { state } = useContext(TypingContext)!
  const pressedKeysRef = useRef<Set<string>>(new Set())

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      const keyIdentity = e.code || e.key
      const basePayload: Omit<KeyDebugPayload, 'phase' | 'reason'> = {
        key: e.key,
        code: e.code,
        repeat: e.repeat,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        isComposing: e.isComposing,
        defaultPrevented: e.defaultPrevented,
        keyIdentity,
        pressedKeys: Array.from(pressedKeysRef.current),
        isTyping: state.isTyping,
        activeElement: getActiveElementDebug(),
      }

      if (pressedKeysRef.current.has(keyIdentity)) {
        logKeyDebug({ phase: 'keydown', reason: 'ignored-pressed-key', ...basePayload })
        return
      }

      if (e.repeat) {
        logKeyDebug({ phase: 'keydown', reason: 'ignored-repeat', ...basePayload })
        return
      }

      const char = e.key

      if (isChineseSymbol(char)) {
        logKeyDebug({ phase: 'keydown', reason: 'ignored-chinese-symbol', ...basePayload })
        alert('您正在使用输入法，请关闭输入法。')
        return
      }

      if (!isLegal(char)) {
        logKeyDebug({ phase: 'keydown', reason: 'ignored-illegal-char', ...basePayload })
        return
      }

      if (e.altKey || e.ctrlKey || e.metaKey) {
        logKeyDebug({ phase: 'keydown', reason: 'ignored-modifier-key', ...basePayload })
        return
      }

      pressedKeysRef.current.add(keyIdentity)
      e.preventDefault()

      logKeyDebug({
        phase: 'keydown',
        reason: 'accepted-input',
        ...basePayload,
        defaultPrevented: true,
        pressedKeys: Array.from(pressedKeysRef.current),
      })

      updateInput({
        type: 'add',
        value: char,
        event: e,
      })
    },
    [state.isTyping, updateInput],
  )

  const onKeyup = useCallback(
    (e: KeyboardEvent) => {
      const keyIdentity = e.code || e.key
      pressedKeysRef.current.delete(keyIdentity)
      logKeyDebug({
        phase: 'keyup',
        reason: 'released-key',
        key: e.key,
        code: e.code,
        repeat: e.repeat,
        altKey: e.altKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        shiftKey: e.shiftKey,
        isComposing: e.isComposing,
        defaultPrevented: e.defaultPrevented,
        keyIdentity,
        pressedKeys: Array.from(pressedKeysRef.current),
        isTyping: state.isTyping,
        activeElement: getActiveElementDebug(),
      })
    },
    [state.isTyping],
  )

  useEffect(() => {
    if (!state.isTyping) return

    const clearPressedKeys = () => {
      pressedKeysRef.current.clear()
      logKeyDebug({
        phase: 'blur',
        reason: 'cleared-on-blur',
        pressedKeys: [],
        isTyping: state.isTyping,
        activeElement: getActiveElementDebug(),
      })
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

  return <></>
}

