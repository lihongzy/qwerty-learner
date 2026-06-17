import IconCoffee from '~icons/mdi/coffee';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DonatingCard } from '@/shared/components/DonatingCard';

type DonateDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DonateDialog = ({ open, onOpenChange }: DonateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-lg">
        <div className="flex flex-col gap-4 px-5 pt-5 pb-4 sm:px-6 sm:pt-6 sm:pb-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="bg-accent-warn-soft text-accent-warn flex size-8 shrink-0 items-center justify-center rounded-full">
                <IconCoffee className="size-4 stroke-current" />
              </span>
              支持这个项目
            </DialogTitle>
            <DialogDescription>
              如果 Qwerty Learner 在背单词、练打字或复习拼写时帮到了你，欢迎通过赞助支持这个项目继续维护。
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-6">
              你的支持会直接用于持续开发、修复问题和补充内容。无论是一次性赞助，还是把 Qwerty Learner
              推荐给更多朋友，都会是很实在的帮助。
            </p>
            <DonatingCard />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
