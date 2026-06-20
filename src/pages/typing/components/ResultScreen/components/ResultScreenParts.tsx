import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
import type { ElementType, ReactNode, SVGAttributes } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import IconExclamationTriangle from '~icons/heroicons/exclamation-triangle-solid';
import IconHandThumbUp from '~icons/heroicons/hand-thumb-up-solid';
import IconHeart from '~icons/heroicons/heart-solid';
import laity from '@/assets/laity.png';
import { selectCurrentDictInfo, usePracticeSessionStore } from '@/shared/stores';
import { getPronunciationTarget } from '@/shared/lib/pronunciation';
import type { WordWithIndex } from '@/shared/types';
import clamp from '@/shared/utils';
import { usePronunciationSound } from '@/pages/typing/hooks/usePronunciation';

export type ConclusionBarProps = {
  mistakeLevel: number;
  mistakeCount: number;
};

export type RemarkRingProps = {
  remark: string;
  caption: string;
  percentage?: number | null;
};

type ResultScreenIconButtonProps = {
  title: string;
  icon: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
};

type ConclusionConfig = {
  icon: ElementType<SVGAttributes<SVGSVGElement>>;
  iconClassName: string;
  panelClassName: string;
  title: string;
  description: (mistakeCount: number) => string;
};

const resultScreenIconButtonClassName =
  'inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors';

const conclusionConfig: ConclusionConfig[] = [
  {
    icon: IconHeart,
    iconClassName: 'text-state-success',
    panelClassName: 'border-state-success bg-bg-panel',
    title: '表现稳定',
    description: (mistakeCount) =>
      mistakeCount > 0
        ? `这一章只错了 ${mistakeCount} 个单词，整体节奏和准确率都很稳。`
        : '这一章没有出现错误，可以直接进入下一章。',
  },
  {
    icon: IconHandThumbUp,
    iconClassName: 'text-accent-primary',
    panelClassName: 'border-accent-primary bg-bg-panel',
    title: '继续巩固',
    description: () => '有少量错误，建议再练一轮，把拼写和节奏彻底压稳。',
  },
  {
    icon: IconExclamationTriangle,
    iconClassName: 'text-accent-warn',
    panelClassName: 'border-accent-warn bg-bg-panel',
    title: '建议重练',
    description: () => '本章错误偏多，先重练一次再进下一章会更稳。',
  },
];

export function AuthorButton() {
  const handleOpenAuthorPage = useCallback(() => {
    window.open('https://github.com/lihongzy', '_blank');
  }, []);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="rounded-full" onClick={handleOpenAuthorPage}>
            <Avatar className="h-7.5 w-7.5 shadow-md">
              <AvatarImage src={laity} alt="Laity Homepage" />
              <AvatarFallback>L</AvatarFallback>
            </Avatar>
          </button>
        </TooltipTrigger>
        <TooltipContent>查看作者主页和更多项目</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ConclusionBar({ mistakeLevel, mistakeCount }: ConclusionBarProps) {
  const { icon: Icon, iconClassName, panelClassName, title, description } = conclusionConfig[mistakeLevel];

  return (
    <div className={clsx('flex items-center gap-3 rounded-[1rem] border px-3 py-2', panelClassName)}>
      <div
        className={clsx('bg-bg-elevated flex h-8 w-8 shrink-0 items-center justify-center rounded-full', iconClassName)}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0">
        <div className="text-text-strong text-[0.92rem] leading-5 font-medium">{title}</div>
        <div className="text-text-muted text-[0.88rem] leading-5">{description(mistakeCount)}</div>
      </div>
    </div>
  );
}

export function RemarkRing({ remark, caption, percentage = null }: RemarkRingProps) {
  const progress = percentage === null ? null : clamp(percentage, 0, 100);

  return (
    <div className="border-border-main bg-bg-panel shadow-app-soft relative flex min-h-[7.75rem] flex-col items-center justify-center overflow-hidden rounded-[1.1rem] border px-2 py-2.5">
      <div className="relative flex h-[3.8rem] w-[3.8rem] items-center justify-center">
        {progress !== null ? (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(var(--accent-primary) ${progress}%, var(--border-main) ${progress}% 100%)`,
            }}
            aria-hidden
          >
            <div className="bg-bg-panel absolute inset-[7px] rounded-full" />
          </div>
        ) : (
          <div className="border-border-main absolute inset-0 rounded-full border-[7px]" />
        )}
        <span className="text-text-strong relative text-[0.9rem] font-semibold tracking-tight">{remark}</span>
      </div>

      <div className="mt-2 text-center">
        <div className="text-text-faint text-[0.64rem] font-semibold tracking-[0.24em] uppercase">{caption}</div>
      </div>
    </div>
  );
}

export function ResultScreenIconButton({ title, icon, className = '', onClick, href }: ResultScreenIconButtonProps) {
  if (href) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`${resultScreenIconButtonClassName} ${className}`}
            >
              {icon}
            </a>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className={`${resultScreenIconButtonClassName} ${className}`} onClick={onClick}>
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent>{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function WordChip({ word }: { word: WordWithIndex }) {
  const currentDictId = usePracticeSessionStore((state) => state.currentDictId);
  const currentDictInfo = useMemo(() => selectCurrentDictInfo(currentDictId), [currentDictId]);
  const pronunciationTarget = getPronunciationTarget(word, currentDictInfo.language);
  const { play, stop } = usePronunciationSound(pronunciationTarget, false);

  const onClickWord = useCallback(() => {
    stop();
    play();
  }, [play, stop]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="h-10 font-mono text-xl font-light md:h-11 md:text-2xl"
            onClick={onClickWord}
          >
            {word.name}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{word.trans.join('；')}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
