import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { ActionButtonConfig } from './types';

type ResultScreenFooterProps = {
  actionButtons: ActionButtonConfig[];
};

export function ResultScreenFooter({ actionButtons }: ResultScreenFooterProps) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-center gap-2.5 border-t px-4 py-3">
      <TooltipProvider>
        {actionButtons.map((button) => (
          <Tooltip key={button.key}>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="min-w-32" onClick={button.onClick}>
                {button.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{button.tooltip}</TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
