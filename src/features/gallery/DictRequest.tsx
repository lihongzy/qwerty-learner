import { useCallback, useState } from 'react'
import IconBook2 from '~icons/tabler/book-2'
import { InfoPanel } from '@/shared/components/InfoPanel'

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
        className="group flex items-center space-x-2 rounded-lg border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 px-4 py-2.5 text-sm font-medium text-indigo-600 shadow-sm transition-all duration-200 hover:scale-105 hover:border-indigo-300 hover:from-indigo-100 hover:to-blue-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-indigo-400 dark:from-gray-800 dark:to-gray-700 dark:text-indigo-400 dark:hover:from-gray-700 dark:hover:to-gray-600"
      >
        <IconBook2 className="h-4 w-4" />
        <span>词库征集</span>
        <span className="transform transition-transform group-hover:translate-x-1">+</span>
      </button>

      {showPanel && (
        <InfoPanel
          openState={showPanel}
          title="词库征集"
          icon={IconBook2}
          buttonClassName="bg-indigo-500 hover:bg-indigo-400"
          iconClassName="bg-indigo-100 text-indigo-500 dark:bg-indigo-500 dark:text-indigo-300"
          onClose={onClosePanel}
        >
          <div className="space-y-5">
            <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">提交自定义词库</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                如果你想为 Qwerty Learner 补充新的词库，可以先阅读
                <a
                  href="https://github.com/Kaiyiwing/qwerty-learner/blob/master/docs/toBuildDict.md"
                  className="mx-1 font-medium text-blue-500 hover:text-blue-600"
                  target="_blank"
                  rel="noreferrer"
                >
                  词库制作说明
                </a>
                ，按格式整理内容后再提交。
              </p>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4 shadow-sm dark:from-gray-800 dark:to-gray-700">
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">试试 QwertyLearner.ai</h4>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <p>如果你希望更快生成词库、整理释义和补充例句，也可以试试在线工具。</p>
                <p>
                  这是由 DeepLearningAI 团队推出的
                  <span className="mx-1 font-semibold text-blue-600 dark:text-blue-400">QwertyLearner.ai</span>
                  ，适合拿来辅助整理词库内容。
                </p>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>AI 生成词库</strong> - 帮你快速整理单词、释义、例句等基础内容
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>内容补全</strong> - 适合补充遗漏字段
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>格式整理</strong> - 便于统一词库结构
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-blue-500">•</span>
                  <span className="text-gray-700 dark:text-gray-300">
                    <strong>快速预览</strong> - 方便检查生成效果
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenQwertyLearnerAi}
                className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                打开 QwertyLearner.ai
              </button>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
              <p>
                <strong>说明：</strong>
                QwertyLearner.ai 与 DeepLearningAI 相关项目并非 Qwerty Learner 官方内置服务，这里仅作为词库整理工具推荐。
              </p>
            </div>
          </div>
        </InfoPanel>
      )}
    </>
  )
}
