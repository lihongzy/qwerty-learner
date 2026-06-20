import { useSharedPreferencesStore } from '@/shared/stores';
import { Word, WordWithIndex } from '@/shared/types';

export type PhoneticProps = {
  word: WordWithIndex | Word;
};

export const Phonetic = ({ word }: PhoneticProps) => {
  const phoneticConfig = useSharedPreferencesStore((state) => state.phoneticConfig);

  return (
    <div className="text-text-muted mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-center text-xs font-medium tracking-[0.08em] transition-colors duration-300">
      {phoneticConfig.type === 'us' && word.usphone && word.usphone.length > 1 && (
        <span>{`AmE:[${word.usphone}]`}</span>
      )}
      {phoneticConfig.type === 'uk' && word.ukphone && word.ukphone.length > 1 && <span>{`BrE:${word.ukphone}`}</span>}
    </div>
  );
};
