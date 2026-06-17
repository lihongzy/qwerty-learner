import clsx from 'clsx';
import { DonateCard } from '@/pages/typing/components/DonateCard';
import { Header } from '@/app/layout/Header';
import { Layout } from '@/app/layout/Layout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { DictChapterButton } from './components/DictChapterButton';
import { PronunciationSwitcher } from './components/PronunciationSwitcher';
import { ResultScreen } from './components/ResultScreen';
import Speed from './components/Speed';
import { StartButton } from './components/StartButton';
import { Switcher } from './components/Switcher';
import { WordList } from './components/WordList';
import { WordPanel } from './components/WordPanel';
import { TypingContext } from './store';
import { useTypingSession } from './useTypingSession';

const TypingPage = () => {
  const session = useTypingSession();
  const isFinished = session.state.isFinished;
  // 不再在开局显示加载动画：单词列表与 SETUP_CHAPTER 在同一渲染周期内就绪，
  // 任何空内容状态交由 WordPanel 内部的"按任意键开始"蒙层处理，避免闪屏。

  return (
    <TypingContext.Provider value={{ state: session.state, dispatch: session.dispatch }}>
      {isFinished && <DonateCard />}
      {isFinished && <ResultScreen />}

      <Layout>
        <Header>
          <DictChapterButton />
          <PronunciationSwitcher />
          <Switcher />
          <StartButton isLoading={session.isLoading} />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className={clsx(
                    'my-btn-primary transition-all duration-300',
                    // 显示时使用警示色强调可跳过状态；隐藏时同时移除占位和点击能力，避免影响头部布局。
                    session.state.isShowSkip
                      ? 'border-accent-warn bg-accent-warn opacity-100'
                      : 'pointer-events-none invisible w-0 border-transparent px-0 opacity-0',
                  )}
                  onClick={session.skipWord}
                >
                  跳过
                </button>
              </TooltipTrigger>
              <TooltipContent>跳过这个单词</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Header>

        <div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col items-center justify-center px-4">
          <div className="relative flex h-full w-full flex-col items-center">
            <div className="flex grow items-center justify-center">{!isFinished && <WordPanel />}</div>

            <Speed />
          </div>
        </div>
      </Layout>

      <WordList />
    </TypingContext.Provider>
  );
};

export default TypingPage;
