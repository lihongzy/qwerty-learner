import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { idDictionaryMap } from '@/shared/resources/dictionary';
import { useCallback, memo, type FC } from 'react';
import DeleteIcon from '~icons/weui/delete-filled';
import { LoadingWordUI } from './LoadingWordUI';
import useGetWord from './hooks/useGetWord';
import { useErrorBookStore } from './store';
import type { groupedWordRecords } from './type';

type Props = {
  record: groupedWordRecords;
  onDelete: (word: string, dict: string) => void | Promise<void>;
};

const ErrorRowComponent: FC<Props> = ({ record, onDelete }) => {
  const setCurrentRowDetail = useErrorBookStore((s) => s.setCurrentRowDetail);
  const dictInfo = idDictionaryMap[record.dict];
  const { word, isLoading, hasError } = useGetWord(record.word, dictInfo);

  return (
    <li
      className="hover:border-primary hover:bg-muted/30 grid w-full cursor-pointer grid-cols-[1.3fr_2.8fr_0.9fr_1.1fr_auto] items-center gap-3 rounded-lg border px-4 py-3 transition-colors"
      onClick={() => setCurrentRowDetail(record)}
    >
      <span className="font-mono text-[0.95rem] font-medium">{record.word}</span>
      <span className="text-muted-foreground min-w-0 text-sm">
        {word ? word.trans.join('；') : <LoadingWordUI isLoading={isLoading} hasError={hasError} />}
      </span>
      <span className="text-destructive justify-self-start font-mono text-[0.95rem] font-semibold">
        {record.wrongCount}
      </span>
      <span className="text-muted-foreground truncate text-sm">{dictInfo?.name}</span>
      <span
        className="justify-self-end"
        onClick={(e) => {
          e.stopPropagation();
          void onDelete(record.word, record.dict);
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="删除记录">
              <DeleteIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>删除记录</TooltipContent>
        </Tooltip>
      </span>
    </li>
  );
};

const ErrorRow = memo(
  ErrorRowComponent,
  (prev, next) =>
    prev.record.word === next.record.word &&
    prev.record.dict === next.record.dict &&
    prev.record.wrongCount === next.record.wrongCount &&
    prev.record.records.length === next.record.records.length &&
    prev.onDelete === next.onDelete,
);

export default ErrorRow;
