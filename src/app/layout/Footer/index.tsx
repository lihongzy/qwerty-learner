import { useCallback } from 'react'
import { useAtom } from 'jotai'
import IconCoffee from '~icons/mdi/coffee'
import IconGitHub from '~icons/mdi/github'
import IconTwitter from '~icons/mdi/twitter'
import { infoPanelStateAtom } from '@/app/state'
import { InfoPanel } from '@/shared/components/InfoPanel'
import { DonatingCard } from '@/shared/components/DonatingCard'
import { InfoPanelType } from '@/shared/types'

export const Footer = () => {
  const [infoPanelState, setInfoPanelState] = useAtom(infoPanelStateAtom)

  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: true }))
    },
    [setInfoPanelState],
  )

  const handleCloseInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: false }))
    },
    [setInfoPanelState],
  )

  return (
    <>
      <InfoPanel
        openState={infoPanelState.donate}
        title="支持这个项目"
        icon={IconCoffee}
        buttonClassName="bg-amber-500 hover:bg-amber-400"
        iconClassName="bg-amber-100 text-amber-500"
        onClose={() => handleCloseInfoPanel('donate')}
      >
        <p className="indent-4 text-sm text-gray-500">
          如果 Qwerty Learner 在背单词、练打字或者复习拼写时帮到了你，欢迎通过赞助支持这个项目继续维护下去。
          <br />
          你的支持会直接用于持续开发、修复问题和补充内容。
          <br />
        </p>
        <br />
        <p className="indent-4 text-sm text-gray-700 dark:text-gray-200">
          无论是一次性支持，还是把 Qwerty Learner 推荐给更多朋友，都会是很实在的帮助。
        </p>
        <br />
        <DonatingCard />
      </InfoPanel>

      <footer className="mt-4 mb-1 flex items-center justify-center gap-2.5 text-sm ease-in">
        <a
          href="https://github.com/lihongzy/qwerty-learner"
          target="_blank"
          rel="noreferrer"
          aria-label="在 GitHub 上查看项目"
        >
          <IconGitHub className="text-gray-500 hover:text-gray-800" />
        </a>

        <a href="https://x.com/lihongzy6" target="_blank" title="在 X 上关注作者" rel="noreferrer">
          <IconTwitter className="text-gray-500 hover:text-[#1DA1F2]" />
        </a>

        <button
          className="cursor-pointer focus:outline-none"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
          aria-label="打开赞助面板"
        >
          <IconCoffee className="text-gray-500 hover:text-amber-500" />
        </button>

        <button
          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          type="button"
          onClick={(e) => {
            handleOpenInfoPanel('donate')
            e.currentTarget.blur()
          }}
        >
          @ Qwerty Learner
        </button>
      </footer>
    </>
  )
}
