import { useState } from 'react';
import IconCoffee from '~icons/mdi/coffee';
import IconGitHub from '~icons/mdi/github';
import { Button } from '@/components/ui/button';
import { DonateDialog } from '@/shared/components/DonateDialog';

export const Footer = () => {
  const [isDonatePanelOpen, setIsDonatePanelOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <>
      <DonateDialog open={isDonatePanelOpen} onOpenChange={setIsDonatePanelOpen} />

      <footer className="text-text-muted mt-4 mb-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm">
        <Button asChild variant="ghost" size="icon">
          <a
            href="https://github.com/lihongzy/qwerty-learner"
            target="_blank"
            rel="noreferrer"
            aria-label="在 GitHub 上查看项目"
          >
            <IconGitHub />
          </a>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          type="button"
          onClick={(e) => {
            setIsDonatePanelOpen(true);
            e.currentTarget.blur();
          }}
          aria-label="打开赞助面板"
        >
          <IconCoffee />
        </Button>

        <span className="bg-border-main mx-1 h-3 w-px" aria-hidden="true" />
        <span className="text-text-faint text-xs font-medium tracking-[0.08em]">© {currentYear} Qwerty Learner</span>
      </footer>
    </>
  );
};
