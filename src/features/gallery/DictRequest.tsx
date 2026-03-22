import { InfoPanel } from '@/shared/components/InfoPanel'
import { useCallback, useState } from 'react'
import IconBook2 from '~icons/tabler/book-2'

export default function DictRequest() {
  const [showPanel, setShowPanel] = useState(false)

  const onOpenPanel = useCallback(() => {
    setShowPanel(true)
  }, [])

  const onClosePanel = useCallback(() => {
    setShowPanel(false)
  }, [])

  const onOpenQwertyLearnerAi = useCallback(() => {
    window.open('https://qwertylearner.ai', '_blank')
    onClosePanel()
  }, [onClosePanel])

  return (
    <>
      <button
        onClick={onOpenPanel}
        className="my-focus-ring my-control-shell inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--text-main)] transition-colors duration-150 hover:border-[var(--accent-primary)] hover:text-[var(--text-strong)]"
      >
        <IconBook2 className="h-4 w-4 text-[var(--accent-primary)]" />
        <span>词库征集</span>
      </button>

      {showPanel && (
        <InfoPanel
          openState={showPanel}
          title="词库征集"
          icon={IconBook2}
          buttonClassName="bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)]"
          iconClassName="bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]"
          onClose={onClosePanel}
        >
          <div className="space-y-4">
            <div className="my-control-shell p-4">
              <h4 className="mb-2 font-semibold text-[var(--text-strong)]">提交自定义词库</h4>
              <p className="text-sm leading-6 text-[var(--text-muted)]">
                如果你想为 Qwerty Learner 补充新的词库，可以先阅读
                <a
                  href="https://github.com/Kaiyiwing/qwerty-learner/blob/master/docs/toBuildDict.md"
                  className="mx-1 font-medium text-[var(--accent-primary)] hover:text-[var(--accent-primary-hover)]"
                  target="_blank"
                  rel="noreferrer"
                >
                  词库制作说明
                </a>
                ，按格式整理内容后再提交。
              </p>
            </div>

            <div className="my-panel p-4">
              <h4 className="mb-2 font-semibold text-[var(--text-strong)]">试试 QwertyLearner.ai</h4>
              <div className="space-y-3 text-sm leading-6 text-[var(--text-muted)]">
                <p>如果你希望更快生成词库、整理释义和补充例句，也可以试试在线工具。</p>
                <p>
                  这是一个适合用来辅助整理词库内容的工具，可以帮你更快完成词条生成、格式整理和内容补全。
                </p>
              </div>

              <div className="mt-4 space-y-2 text-sm text-[var(--text-main)]">
                <div>AI 生成词库：快速整理单词、释义和例句</div>
                <div>内容补全：适合补齐遗漏字段</div>
                <div>格式整理：统一词库结构</div>
                <div>快速预览：方便检查生成结果</div>
              </div>

              <button onClick={onOpenQwertyLearnerAi} className="my-btn-primary my-focus-ring mt-4 w-full">
                打开 QwertyLearner.ai
              </button>
            </div>

            <div className="rounded-[var(--radius-md)] border border-[color:var(--accent-warn-soft)] bg-[var(--accent-warn-soft)] px-4 py-3 text-xs leading-6 text-[var(--text-main)]">
              说明：QwertyLearner.ai 不是 Qwerty Learner 内置服务，这里仅作为词库整理工具推荐。
            </div>
          </div>
        </InfoPanel>
      )}
    </>
  )
}
