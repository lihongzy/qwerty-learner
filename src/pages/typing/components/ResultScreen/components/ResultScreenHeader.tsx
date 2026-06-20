import { DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { RESULT_SCREEN_COPY } from '../copy';
import { AuthorButton, ResultScreenIconButton } from './ResultScreenParts';
import type { UtilityButtonConfig } from './types';

type ResultScreenHeaderProps = {
  chapterTitle: string;
  utilityButtons: UtilityButtonConfig[];
};

export function ResultScreenHeader({ chapterTitle, utilityButtons }: ResultScreenHeaderProps) {
  return (
    <div className="border-b px-4 py-3 sm:px-5 lg:px-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <DialogTitle className="text-[1.8rem] font-semibold sm:text-[2.15rem] lg:text-[2.35rem]">
            {chapterTitle}
          </DialogTitle>
          <DialogDescription className="max-w-2xl text-[0.85rem]">
            {RESULT_SCREEN_COPY.sessionDescription}
          </DialogDescription>
        </div>

        <div className="flex items-center gap-1.5 pr-10">
          {utilityButtons.map((button) => {
            if (!button.onClick && !button.href) {
              return (
                <div key={button.key} className="inline-flex h-9 w-9 items-center justify-center">
                  {button.key === 'author' ? <AuthorButton /> : button.icon}
                </div>
              );
            }

            return (
              <ResultScreenIconButton
                key={button.key}
                title={button.title}
                icon={button.icon}
                className={button.className}
                onClick={button.onClick}
                href={button.href}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
