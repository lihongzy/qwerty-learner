import logo from '@/assets/logo.svg'
import handPositionImage from '@/assets/standard_typing_hand_position.png'
import shareImage1 from '@/assets/sharePic/image-1.png'
import shareImage5 from '@/assets/sharePic/image-5.png'
import shareImage8 from '@/assets/sharePic/image-8.png'
import { useEffect, useState } from 'react'

const officialUrl = 'https://qwerty.kaiyi.cool/'
const vscodeUrl = 'https://marketplace.visualstudio.com/items?itemName=Kaiyi.qwerty-learner'

const slides = [
  {
    image: shareImage8,
    title: '把背单词变成键盘训练',
    label: 'Typing Console',
    alt: 'Qwerty Learner 主界面截图',
  },
  {
    image: shareImage1,
    title: '即时看到速度、准确率和结果',
    label: 'Instant Feedback',
    alt: 'Qwerty Learner 练习结果截图',
  },
  {
    image: shareImage5,
    title: '章节化训练，适合长期积累',
    label: 'Structured Practice',
    alt: 'Qwerty Learner 分享海报截图',
  },
]

const featureCards = [
  {
    title: '音标、发音、拼写同步建立记忆',
    description: '练习时同时看到音标、听到发音、敲出单词，把读音、手感和拼写绑定在一起。',
    image: shareImage8,
  },
  {
    title: '默写模式巩固每一章',
    description: '练完整章之后继续默写，不让记忆停留在“看见会拼”，而是真正过一遍输出。',
    image: handPositionImage,
  },
  {
    title: '程序员词库更贴近日常工作',
    description: '除了考试词汇，还覆盖技术英语、API 名称和常见编程语境，适合长期在键盘前工作的人。',
    image: shareImage1,
  },
]

const stats = [
  { value: '20k+', label: 'GitHub Stars' },
  { value: '100k+', label: '月度练习用户' },
  { value: '4.8/5', label: '社区口碑评分' },
]

const libraryGroups = [
  {
    title: '考试与通用英语',
    items: ['CET-4 / CET-6', 'IELTS / TOEFL', 'GRE / SAT', '考研英语'],
  },
  {
    title: '程序员专属词库',
    items: ['Coder Dict', 'JavaScript API', 'Node.js API', 'Linux 命令'],
  },
  {
    title: '训练能力',
    items: ['默写模式', '错词复习', '速度统计', '按键音效'],
  },
]

const coderHighlights = ['程序员词库', 'API 练习', '错词复习', '按键音效系统']

const badges = ['实时反馈', '默写模式', '程序员词库', '完全开源']

export const MobilePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0)

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setCurrentSlide((previousSlide) => (previousSlide + 1) % slides.length)
    }, 3200)

    return () => window.clearInterval(timerId)
  }, [])

  const activeFeature = featureCards[activeFeatureIndex]

  return (
    <div className="min-h-screen bg-[#f6f0df] text-slate-900">
      <div
        className="pointer-events-none fixed inset-0 opacity-80"
        style={{
          backgroundImage:
            'radial-gradient(circle at 14% 18%, rgba(216,162,60,0.18), transparent 22%), radial-gradient(circle at 85% 10%, rgba(47,107,131,0.16), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.55), rgba(246,240,223,0.95))',
        }}
      />

      <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-[#f6f0df]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-2 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
              <img src={logo} className="h-8 w-8" alt="Qwerty Learner" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-[0.18em] text-slate-800">Qwerty Learner</p>
              <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Keyboard-first English</p>
            </div>
          </div>

          <a
            href={officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            打开官网
          </a>
        </div>
      </header>

      <main className="relative z-10">
        <section className="px-5 pb-12 pt-10">
          <div className="mx-auto max-w-6xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d8a23c]/35 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#8b6320] shadow-[0_10px_20px_rgba(216,162,60,0.08)]">
              <span className="h-2 w-2 rounded-full bg-[#d8a23c]" />
              为键盘工作者设计
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <h1 className="max-w-xl text-4xl font-black leading-[1.02] tracking-tight text-slate-900 sm:text-5xl">
                  把英语单词练习，
                  <span className="block text-[#2f6b83]">做成真正有节奏的键盘训练。</span>
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  Qwerty Learner 把单词记忆、打字速度、错误纠正和发音练习放进同一条工作流里。
                  你不是在被动背词，而是在主动训练一套稳定、可重复的输入记忆。
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {badges.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a
                    href={officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-4 text-base font-semibold text-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
                  >
                    立即开始练习
                  </a>
                  <span className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white/70 px-6 py-4 text-sm text-stone-600">
                    建议使用桌面端获得完整体验
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-3 rounded-[2rem] border border-white/80 bg-white/40 blur-xl" />
                <div className="relative overflow-hidden rounded-[2rem] border border-stone-200 bg-white/90 p-3 shadow-[0_30px_60px_rgba(15,23,42,0.16)]">
                  <div className="mb-3 flex items-center justify-between rounded-[1.4rem] border border-stone-100 bg-stone-50 px-4 py-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{slides[currentSlide].label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{slides[currentSlide].title}</p>
                    </div>
                    <div className="rounded-full bg-[#2f6b83] px-3 py-1 text-xs font-semibold text-white">Live</div>
                  </div>

                  <div className="overflow-hidden rounded-[1.4rem] bg-stone-100">
                    <div
                      className="flex transition-transform duration-500 ease-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {slides.map((slide) => (
                        <img key={slide.title} src={slide.image} alt={slide.alt} className="h-full w-full flex-shrink-0 object-cover" />
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2">
                    {slides.map((slide, index) => (
                      <button
                        key={slide.title}
                        type="button"
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2.5 rounded-full transition-all ${
                          currentSlide === index ? 'w-8 bg-[#2f6b83]' : 'w-2.5 bg-stone-300'
                        }`}
                        aria-label={`切换到第 ${index + 1} 张展示图`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-8">
          <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.75rem] border border-stone-200 bg-white/85 px-5 py-6 shadow-[0_12px_28px_rgba(15,23,42,0.08)]"
              >
                <p className="text-3xl font-black text-[#2f6b83]">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-slate-700">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 py-14">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b6320]">核心功能</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                每个功能都围绕同一件事：
                <span className="block text-[#2f6b83]">让单词记忆真正落到手上。</span>
              </h2>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="space-y-4">
                {featureCards.map((feature, index) => {
                  const isActive = activeFeatureIndex === index

                  return (
                    <button
                      key={feature.title}
                      type="button"
                      onClick={() => setActiveFeatureIndex(index)}
                      className={`w-full rounded-[1.75rem] border px-6 py-6 text-left transition-all duration-300 ${
                        isActive
                          ? 'border-[#2f6b83]/25 bg-white shadow-[0_18px_34px_rgba(15,23,42,0.1)]'
                          : 'border-stone-200 bg-[#fbf7ec] hover:border-stone-300 hover:bg-white'
                      }`}
                    >
                      <p className="text-xl font-bold text-slate-900">{feature.title}</p>
                      <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                    </button>
                  )
                })}
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white/90 p-4 shadow-[0_24px_44px_rgba(15,23,42,0.14)]">
                <img src={activeFeature.image} alt={activeFeature.title} className="h-full w-full rounded-[1.5rem] object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-14">
          <div className="mx-auto max-w-6xl rounded-[2rem] border border-stone-200 bg-white/85 p-6 shadow-[0_18px_38px_rgba(15,23,42,0.08)] sm:p-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b6320]">词库与场景</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                不只覆盖考试词汇，也照顾真正写代码、写文档、做项目的人。
              </h2>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {libraryGroups.map((group) => (
                <div key={group.title} className="rounded-[1.5rem] border border-stone-200 bg-[#fbf7ec] p-5">
                  <h3 className="text-lg font-bold text-slate-900">{group.title}</h3>
                  <div className="mt-4 space-y-3">
                    {group.items.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-slate-700">
                        <span className="h-2 w-2 rounded-full bg-[#d8a23c]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-14">
          <div className="mx-auto max-w-6xl rounded-[2.2rem] bg-slate-900 px-6 py-10 text-white shadow-[0_28px_54px_rgba(15,23,42,0.22)] sm:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-300">For Keyboard Workers</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                如果你每天都在敲键盘，
                <span className="block text-[#d8a23c]">这不是普通背词软件。</span>
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/75 sm:text-base">
                Qwerty Learner 把技术英语、API 名称、拼写速度和错误纠正放在同一条训练链路里。
                它更像一套工作者的语言基础设施，而不是一次性的单词清单。
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {coderHighlights.map((label) => (
                <div key={label} className="rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-5">
                  <p className="text-base font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 pt-8">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.4rem] border border-stone-200 bg-white/90 shadow-[0_26px_50px_rgba(15,23,42,0.14)]">
            <div className="px-6 py-10 text-center sm:px-10">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8b6320]">立即开始</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-5xl">
                在桌面端打开，进入真正的练习节奏。
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                移动端更适合了解产品和查看介绍。完整练习体验、键盘手感、速度反馈和词库操作，建议在桌面浏览器中进行。
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#2f6b83] px-8 py-4 text-base font-semibold text-white shadow-[0_16px_30px_rgba(47,107,131,0.24)] transition-transform hover:-translate-y-0.5 hover:bg-[#25586c]"
                >
                  前往官网开始练习
                </a>
                <a
                  href={vscodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-stone-200 bg-white px-8 py-4 text-base font-semibold text-slate-800 transition-colors hover:bg-stone-50"
                >
                  安装 VSCode 插件
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default MobilePage
