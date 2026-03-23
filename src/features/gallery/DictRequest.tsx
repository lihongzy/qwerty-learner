import { InfoPanel } from '@/shared/components/InfoPanel'
import { useState } from 'react'
import IconBook2 from '~icons/tabler/book-2'

export default function DictRequest() {
  const [showPanel, setShowPanel] = useState(false)

  const onOpenQwertyLearnerAi = () => {
    window.open('https://qwertylearner.ai', '_blank')
    setShowPanel(false)
  }

  return (
    <>
      <button
        onClick={() => setShowPanel(true)}
        className="inline-flex items-center gap-2 rounded-md border border-border-main bg-bg-panel px-4 py-2.5 text-sm font-medium text-text-main shadow-app-soft transition-colors duration-150 hover:border-accent-primary hover:text-text-strong focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool/40"
      >
        <IconBook2 className="h-4 w-4 text-accent-primary" />
        <span>词库征集</span>
      </button>

      {showPanel && (
        <InfoPanel
          openState={showPanel}
          title="词库征集"
          icon={IconBook2}
          buttonClassName="bg-accent-primary hover:bg-accent-primary-hover"
          iconClassName="bg-accent-primary-soft text-accent-primary"
          onClose={() => setShowPanel(false)}
        >
          <div className="space-y-4">
            <div className="rounded-app-md border border-border-main bg-bg-elevated px-4 py-4">
              <h4 className="mb-2 text-sm font-semibold text-text-strong">提交自定义词库</h4>
              <p className="text-sm leading-6 text-text-muted">
                想补充新词库，可以先阅读
                <a
                  href="https://github.com/Kaiyiwing/qwerty-learner/blob/master/docs/toBuildDict.md"
                  className="mx-1 font-medium text-accent-primary transition-colors hover:text-accent-primary-hover"
                  target="_blank"
                  rel="noreferrer"
                >
                  词库制作说明
                </a>
                后再提交。
              </p>
            </div>

            <div className="rounded-app-md border border-border-main bg-bg-panel px-4 py-4 shadow-app-soft">
              <h4 className="mb-2 text-sm font-semibold text-text-strong">试试 QwertyLearner.ai</h4>
              <p className="text-sm leading-6 text-text-muted">需要更快整理词条、释义或例句时，可以用它辅助生成和整理内容。</p>

              <button
                onClick={onOpenQwertyLearnerAi}
                className="mt-4 inline-flex w-full items-center justify-center rounded-app-sm bg-accent-primary px-3 py-2 text-sm font-semibold text-white transition-colors duration-150 hover:bg-accent-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cool/40"
              >
                打开 QwertyLearner.ai
              </button>
            </div>

            <div className="rounded-app-md border border-accent-warn/20 bg-accent-warn/10 px-4 py-3 text-xs leading-6 text-text-main">
              QwertyLearner.ai 不是内置服务。
            </div>
          </div>
        </InfoPanel>
      )}
    </>
  )
}
