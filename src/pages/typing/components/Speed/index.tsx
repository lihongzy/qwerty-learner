import { useContext } from 'react';
import { TypingContext } from '@/pages/typing/store';

export default function Speed() {
  const { state } = useContext(TypingContext)!;
  const seconds = state.timerData.time % 60;
  const minutes = Math.floor(state.timerData.time / 60);
  const time = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const inputNumber = state.chapterData.correctCount + state.chapterData.wrongCount;

  const items = [
    { value: time, label: '时间' },
    { value: inputNumber, label: '输入数' },
    { value: state.timerData.wpm, label: 'WPM' },
    { value: state.chapterData.correctCount, label: '正确数' },
    { value: `${state.timerData.accuracy}%`, label: '正确率' },
  ];

  return (
    <div className="mb-8 w-full max-w-5xl border-t px-4 pt-2">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
        {items.map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center py-1">
            <span className="text-lg font-semibold">{value}</span>
            <span className="text-muted-foreground text-xs">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
