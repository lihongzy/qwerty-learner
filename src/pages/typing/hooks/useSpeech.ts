import { useCallback, useEffect, useMemo, useState } from 'react'

export type UseSpeechResult = {
  /**
   * 开始朗读文本
   * @param abort 是否先中断当前正在播放的语音
   */
  speak: (abort?: boolean) => void
  /**
   * 取消当前朗读
   */
  cancel: () => void
  /**
   * 当前是否正在朗读
   */
  speaking: boolean
}

/**
 * 封装浏览器 SpeechSynthesis API 的 React Hook。
 * @param text 需要被朗读的文本
 * @param option SpeechSynthesisUtterance 的可选配置
 * @returns 返回朗读、取消朗读方法以及当前朗读状态
 */
export default function useSpeech(text: string, option?: Partial<SpeechSynthesisUtterance>): UseSpeechResult {
  const [speaking, setSpeaking] = useState(false)

  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'

  // 文本或配置变化时，重新生成一份新的朗读对象。
  const utterance = useMemo(() => {
    if (!isSpeechSupported) {
      return null
    }

    const nextUtterance = new SpeechSynthesisUtterance(text)
    Object.assign(nextUtterance, option)
    return nextUtterance
  }, [isSpeechSupported, option, text])

  useEffect(() => {
    if (!isSpeechSupported) {
      console.error('当前浏览器不支持 SpeechSynthesis API')
      return
    }

    return () => {
      window.speechSynthesis.cancel()
      setSpeaking(false)
    }
  }, [isSpeechSupported])

  useEffect(() => {
    if (!utterance) {
      return
    }

    // 朗读结束或出错后，同步更新播放状态。
    const handleEnd = () => {
      setSpeaking(false)
    }

    utterance.addEventListener('end', handleEnd)
    utterance.addEventListener('error', handleEnd)

    return () => {
      utterance.removeEventListener('end', handleEnd)
      utterance.removeEventListener('error', handleEnd)
    }
  }, [utterance])

  const speak = useCallback(
    (abort = false) => {
      if (!utterance || !isSpeechSupported) {
        return
      }

      const synth = window.speechSynthesis
      // 需要抢占播放时，先停止已有语音，再播放新的内容。
      if (abort && synth.speaking) {
        synth.cancel()
      }

      setSpeaking(true)
      synth.speak(utterance)
    },
    [isSpeechSupported, utterance],
  )

  const cancel = useCallback(() => {
    if (!isSpeechSupported) {
      return
    }

    window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [isSpeechSupported])

  return {
    speak,
    cancel,
    speaking,
  }
}
