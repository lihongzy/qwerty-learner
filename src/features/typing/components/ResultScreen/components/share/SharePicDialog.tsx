import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { useAtomValue } from 'jotai'
import { Fragment, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import IconXMark from '~icons/heroicons/x-mark-solid'
import shareImage1 from '@/assets/sharePic/image-1.png'
import shareImage2 from '@/assets/sharePic/image-2.png'
import shareImage3 from '@/assets/sharePic/image-3.png'
import shareImage4 from '@/assets/sharePic/image-4.png'
import shareImage5 from '@/assets/sharePic/image-5.png'
import shareImage6 from '@/assets/sharePic/image-6.png'
import shareImage7 from '@/assets/sharePic/image-7.png'
import shareImage8 from '@/assets/sharePic/image-8.png'
import shareImage9 from '@/assets/sharePic/image-9.png'
import keyboardSvg from '@/assets/sharePic/keyBackground.svg'
import { TypingContext } from '@/features/typing/store'
import { currentChapterAtom, currentDictInfoAtom } from '@/shared/state'

const PIC_RATIO = 3
const PIC_LIST = [shareImage1, shareImage2, shareImage3, shareImage4, shareImage5, shareImage6, shareImage7, shareImage8, shareImage9]
const PROMOTE_LIST = [
  { word: '快人一手', sentence: '速度快得就像比别人多长了一只手。' },
  { word: '手落听雨', sentence: '雷霆手法，震撼观众。' },
  { word: '疾如闪电', sentence: '打字速度极快，就像一道闪电在键盘上迅速穿梭。' },
  { word: '手如疾风', sentence: '手速快得惊人，就像疾风一般。' },
  { word: '精准如箭', sentence: '打字精度极高，就像一箭命中靶心一般准确。' },
  { word: '狂飙突进', sentence: '打字速度快得让人感到狂飙突进的冲劲。' },
  { word: '神速如风', sentence: '神速打字，如同风一样快。' },
  { word: '招招到位', sentence: '打字精度和速度都十分到位，毫不出错。' },
  { word: '如履平地', sentence: '打字手法熟练，如履平地，行云流水。' },
  { word: '声东击西', sentence: '打字技巧高超，声东击西，出奇制胜。' },
  { word: '魔法使者', sentence: '打字速度快得让人难以置信，就像一名魔法使者。' },
  { word: '灵活多变', sentence: '打字姿势灵活多变，就像一只蛇一样柔韧。' },
  { word: '犹如飞鸟', sentence: '打字速度极快，就像一只飞鸟在键盘上翱翔。' },
  { word: '连珠妙语', sentence: '打字技巧娴熟，如同一连串妙语连珠。' },
  { word: '百毒不侵', sentence: '打字速度和准确度都非常高，就像身具百毒不侵的能力。' },
  { word: '攻守兼备', sentence: '打字速度和精度都非常出色，攻守兼备，所向披靡。' },
  { word: '跃然纸上', sentence: '打字手法灵活多变，跃然纸上，生动有趣。' },
]

export type SharePicDialogProps = {
  showState: boolean
  setShowState: (showState: boolean) => void
  randomChoose: {
    picRandom: number
    promoteRandom: number
  }
}

export default function SharePicDialog({ showState, setShowState, randomChoose }: SharePicDialogProps) {
  const { state } = useContext(TypingContext)!
  const [imageURL, setImageURL] = useState<string | null>(null)

  const dialogFocusRef = useRef<HTMLButtonElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const shareImage = useMemo(() => PIC_LIST[Math.floor(randomChoose.picRandom * PIC_LIST.length)], [randomChoose.picRandom])
  const promote = useMemo(() => PROMOTE_LIST[Math.floor(randomChoose.promoteRandom * PROMOTE_LIST.length)], [randomChoose.promoteRandom])

  const currentDictInfo = useAtomValue(currentDictInfoAtom)
  const currentChapter = useAtomValue(currentChapterAtom)

  useEffect(() => {
    async function loadToPng() {
      const { toPng } = await import('html-to-image')

      if (imageRef.current) {
        const width = imageRef.current.offsetWidth
        const height = imageRef.current.offsetHeight

        toPng(imageRef.current, { canvasWidth: width * PIC_RATIO, canvasHeight: height * PIC_RATIO }).then((url) => {
          setImageURL(url)
        })
      }
    }

    loadToPng()
  }, [])

  const handleClose = useCallback(() => {
    setShowState(false)
  }, [setShowState])

  const handleDownload = useCallback(async () => {
    const { saveAs } = await import('file-saver')

    if (imageURL) {
      saveAs(imageURL, 'Qwerty-learner.png')
    }
  }, [imageURL])

  return (
    <>
      <Transition show={showState}>
        <Dialog as="div" className="relative z-50" onClose={handleClose} initialFocus={dialogFocusRef}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50 transition-opacity backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="bg-bg-panel shadow-app-panel border-border-main relative transform overflow-hidden rounded-[1.1rem] border text-left transition-all">
                  <div className="flex flex-col items-center justify-center px-6 pb-6 pt-8">
                    <button className="absolute right-5 top-4 rounded-full p-1" type="button" onClick={handleClose} title="关闭对话框">
                      <IconXMark className="text-text-muted h-5 w-5" />
                    </button>
                    <div className="mb-2 text-center">
                      <div className="text-text-strong text-sm font-semibold">分享练习结果</div>
                    </div>
                    <div className="w-[24rem]">
                      {imageURL ? (
                        <img src={imageURL} alt="分享练习结果" className="rounded-xl" />
                      ) : (
                        <div className="border-border-main bg-bg-elevated flex aspect-[3/4] w-full items-center justify-center rounded-xl border">
                          <svg
                            className="text-accent-primary -ml-1 mr-3 h-5 w-5 animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle className="opacity-50" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>
                      )}
                    </div>
                    <button
                      ref={dialogFocusRef}
                      className="my-btn-primary mt-5 h-9 min-w-[6rem] px-4"
                      type="button"
                      onClick={handleDownload}
                      title="保存"
                    >
                      保存
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div style={{ position: 'absolute', left: '-999px', zIndex: -1 }}>
        <div ref={imageRef} className="box-content w-85 bg-white p-4">
          <div
            className="relative flex h-112 w-75 flex-col items-start justify-start overflow-hidden rounded-[1.2rem] border border-slate-200 bg-[linear-gradient(180deg,#f7fafc,#eef4f8)] shadow-lg"
          >
            <div className="w-full">
              <KeyboardPanel description={promote.word} />
              <div className="px-6 text-center text-xs leading-5 text-slate-500">{promote.sentence}</div>
              <div className="mx-4 mt-6 grid grid-cols-3 gap-2 rounded-[0.95rem] border border-slate-100 bg-slate-50/90 p-2.5">
                <DataBox data={String(state.timerData.time)} description="用时" />
                <DataBox data={`${state.timerData.accuracy}%`} description="正确率" />
                <DataBox data={String(state.timerData.wpm)} description="WPM" />
              </div>
              <div className="ml-5 mt-4 self-start text-base font-medium text-slate-800">{currentDictInfo.name}</div>
              <div className="ml-5 mt-1.5 self-start text-xs text-slate-500">{`第 ${currentChapter + 1} 章`}</div>
            </div>

            <div className="mb-3 ml-5 mt-auto">
              <div className="text-xs font-medium text-slate-700">Qwerty.laity</div>
              <div className="mt-1 text-xs font-normal text-slate-400">为键盘工作者设计的单词与肌肉记忆锻炼软件</div>
            </div>
            <div className="absolute -right-9 bottom-10">
              <img src={shareImage} className="w-48" width={186} height={122} alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function KeyboardPanel({ description }: { description: string }) {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-0">
      {description.split('').map((char, index) => (
        <KeyboardKey key={`${index}-${char}`} char={char} />
      ))}
    </div>
  )
}

function KeyboardKey({ char }: { char: string }) {
  return (
    <div className="relative -mx-1 h-18 w-18">
      <div className="absolute inset-0">
        <img src={keyboardSvg} className="h-full w-full" alt="" />
      </div>
      <div className="absolute left-0 right-0 top-2.5 flex items-center justify-center">
        <span className="text-base font-medium text-slate-700" style={{ fontSize: '20px', transform: 'rotateX(30deg)' }}>
          {char}
        </span>
      </div>
    </div>
  )
}

function DataBox({ data, description }: { data: string; description: string }) {
  return (
    <div className="flex min-h-[4.5rem] flex-col items-center justify-center rounded-[0.9rem] border border-slate-200 bg-slate-50 px-2 py-2">
      <span className="text-center font-['IBM_Plex_Mono','JetBrains_Mono',monospace] text-[1.05rem] font-semibold text-slate-800">
        {data}
      </span>
      <span className="mt-1 text-[11px] text-slate-400">{description}</span>
    </div>
  )
}
