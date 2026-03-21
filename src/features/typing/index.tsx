import { DonateCard } from '@/features/typing/components/DonateCard'
import { Header } from '@/app/layout/Header'
import { Layout } from '@/app/layout/Layout'
import { SimpleTooltip as Tooltip } from '@/shared/ui/tooltip'
import { DictChapterButton } from './components/DictChapterButton'
import { PronunciationSwitcher } from './components/PronunciationSwitcher'
import { ResultScreen } from './components/ResultScreen'
import Speed from './components/Speed'
import { StartButton } from './components/StartButton'
import { Switcher } from './components/Switcher'
import { WordList } from './components/WordList'
import { WordPanel } from './components/WordPanel'
import { TypingContext } from './store'
import { useTypingSession } from './useTypingSession'

const TypingPage = () => {
  const session = useTypingSession()

  return (
    <TypingContext.Provider value={{ state: session.state, dispatch: session.dispatch }}>
      {session.state.isFinished && <DonateCard />}
      { <ResultScreen />}

      <Layout>
        <Header>
          <DictChapterButton />
          <PronunciationSwitcher />
          <Switcher />
          <StartButton isLoading={session.isLoading} />

          <Tooltip content="跳过这个单词">
            <button
              className={`${session.state.isShowSkip ? 'bg-orange-400' : 'invisible w-0 bg-gray-300 px-0 opacity-0'} my-btn-primary transition-all duration-300`}
              onClick={session.skipWord}
            >
              跳过
            </button>
          </Tooltip>
        </Header>

        <div className="container mx-auto flex h-full flex-1 flex-col items-center justify-center">
          <div className="relative container mx-auto flex h-full flex-col items-center">
            <div className="container flex grow items-center justify-center">
              {session.isLoading ? (
                <div className="text-center">
                  <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-dashed border-yellow-500" />
                  <h2 className="mt-4 text-zinc-900 dark:text-white">加载中...</h2>
                </div>
              ) : (
                !session.state.isFinished && <WordPanel />
              )}
            </div>

            <Speed />
          </div>
        </div>
      </Layout>

      <WordList />
    </TypingContext.Provider>
  )
}

export default TypingPage

