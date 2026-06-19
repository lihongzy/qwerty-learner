import { usePracticeSessionStore } from '@/shared/stores';
import {
  generateNewWordReviewRecord,
  putWordReviewRecord,
  useGetLatestReviewRecord,
} from '@/shared/lib/db/review-record';
import type { Dictionary } from '@/shared/types/resource';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import MdiRobotAngry from '~icons/mdi/robot-angry';
import type { TErrorWordData } from './hooks/useErrorWords';

function timeStamp2String(timeStamp: number) {
  return new Date(timeStamp * 1000).toLocaleString('zh-CN', { hour12: false });
}

export function ReviewDetail({ errorData, dict }: { errorData: TErrorWordData[]; dict: Dictionary }) {
  const latestReviewRecord = useGetLatestReviewRecord(dict.id);
  const setReviewModeInfo = usePracticeSessionStore((s) => s.setReviewModeInfo);
  const setCurrentDictId = usePracticeSessionStore((s) => s.setCurrentDictId);
  const navigate = useNavigate();
  const setCurrentChapter = usePracticeSessionStore((s) => s.setCurrentChapter);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const startReview = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setCurrentDictId(dict.id);
    setCurrentChapter(-1);
    try {
      if (latestReviewRecord && !latestReviewRecord.isFinished) {
        await putWordReviewRecord({ ...latestReviewRecord, isFinished: true });
      }
      const record = await generateNewWordReviewRecord(dict.id, errorData);
      setReviewModeInfo({ isReviewMode: true, reviewRecord: record });
      navigate('/');
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueReview = () => {
    if (!latestReviewRecord || isSubmitting) return;
    setCurrentDictId(dict.id);
    setCurrentChapter(-1);
    setReviewModeInfo({ isReviewMode: true, reviewRecord: latestReviewRecord });
    navigate('/');
  };

  const progress = latestReviewRecord
    ? Math.round((latestReviewRecord.index / latestReviewRecord.words.length) * 100)
    : 0;

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 py-6 md:px-12">
      <div className="max-w-2xl text-center">
        <MdiRobotAngry fontSize={28} className="text-destructive mx-auto mb-3" />
        <blockquote className="text-muted-foreground text-sm leading-7 md:text-base">
          复习模式会把当前词库里输错过的单词重新整理出来，方便你集中补练。
          <br />
          最适合在一轮正常练习结束后立刻使用，先把高频错误快速清掉。
        </blockquote>
      </div>

      <div className="mt-8 flex w-full max-w-2xl flex-col items-center">
        {latestReviewRecord && !latestReviewRecord.isFinished ? (
          <div className="w-full rounded-lg border p-4">
            <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs">
              <span>上次复习进度</span>
              <span className="font-mono">
                {latestReviewRecord.index}/{latestReviewRecord.words.length}
              </span>
            </div>
            <Progress value={progress} className="h-1.5" />
            <div className="text-muted-foreground mt-2 text-sm">
              创建于 {timeStamp2String(latestReviewRecord.createTime)}
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">当前有 {errorData.length} 个错词可用于复习</div>
        )}

        <div className="mt-5 flex gap-3">
          {latestReviewRecord && !latestReviewRecord.isFinished && (
            <Button variant="outline" onClick={continueReview} disabled={isSubmitting}>
              继续复习
            </Button>
          )}
          <Button onClick={() => void startReview()} disabled={errorData.length === 0 || isSubmitting}>
            {latestReviewRecord && !latestReviewRecord.isFinished ? '重新开始' : '开始复习'}
          </Button>
        </div>
      </div>
    </div>
  );
}
