import { useCallback } from 'react';
import IconCoffee from '~icons/mdi/coffee';
import IconGitHub from '~icons/mdi/github';
import IconTwitter from '~icons/mdi/twitter';
import { useInfoPanelStore } from '@/app/stores';
import { InfoPanel } from '@/shared/components/InfoPanel';
import { DonatingCard } from '@/shared/components/DonatingCard';

export const Footer = () => {
  const infoPanelState = useInfoPanelStore((state) => state.infoPanelState);
  const setInfoPanelState = useInfoPanelStore((state) => state.setInfoPanelState);

  const openDonatePanel = useCallback(() => {
    setInfoPanelState((state) => ({ ...state, donate: true }));
  }, [setInfoPanelState]);

  const closeDonatePanel = useCallback(() => {
    setInfoPanelState((state) => ({ ...state, donate: false }));
  }, [setInfoPanelState]);

  return (
    <>
      <InfoPanel
        openState={infoPanelState.donate}
        title="支持这个项目"
        icon={IconCoffee}
        buttonClassName="bg-accent-warn hover:bg-accent-warn"
        iconClassName="bg-accent-warn-soft text-accent-warn"
        onClose={closeDonatePanel}
      >
        <div className="space-y-4">
          <p className="text-text-muted text-sm leading-6">
            如果 Qwerty Learner 在背单词、练打字或复习拼写时帮到了你，欢迎通过赞助支持这个项目继续维护。
          </p>
          <p className="text-text-main text-sm leading-6">
            你的支持会直接用于持续开发、修复问题和补充内容。无论是一次性赞助，还是把 Qwerty Learner
            推荐给更多朋友，都会是很实在的帮助。
          </p>
          <DonatingCard />
        </div>
      </InfoPanel>

      <footer className="text-text-muted mt-4 mb-1 flex items-center justify-center gap-2 text-sm">
        <a
          href="https://github.com/lihongzy/qwerty-learner"
          target="_blank"
          rel="noreferrer"
          aria-label="在 GitHub 上查看项目"
          className="hover:text-text-strong focus-visible:ring-accent-cool/40 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2"
        >
          <IconGitHub className="h-5 w-5" />
        </a>

        <a
          href="https://x.com/lihongzy6"
          target="_blank"
          rel="noreferrer"
          aria-label="在 X 上关注作者"
          className="focus-visible:ring-accent-cool/40 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors duration-150 hover:text-sky-500 focus:outline-none focus-visible:ring-2"
        >
          <IconTwitter className="h-5 w-5" />
        </a>

        <button
          className="hover:text-accent-warn focus-visible:ring-accent-cool/40 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 focus:outline-none focus-visible:ring-2"
          type="button"
          onClick={(e) => {
            openDonatePanel();
            e.currentTarget.blur();
          }}
          aria-label="打开赞助面板"
        >
          <IconCoffee className="h-5 w-5" />
        </button>

        <span className="text-text-faint ml-1 text-xs font-medium tracking-[0.08em]">Qwerty Learner</span>
      </footer>
    </>
  );
};
