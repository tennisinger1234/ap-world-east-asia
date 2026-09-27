import { Link } from 'react-router-dom'
import { categories, items, meta, practice } from '../lib/content'
import { UNIT_PAGES, resetProgress, unitPercent, useProgress } from '../lib/progress'
import { InkMountains, SealStamp } from '../components/Decor'
import { CategoryIcon, Cloud, TabIcon } from '../components/Illustrations'
import Mascot from '../components/Mascot'

function ProgressRing({ pct, size = 108 }) {
  const r = 42
  const c = 2 * Math.PI * r
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgb(255 255 255 / .22)" strokeWidth="9" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="#fbf3df"
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          className="transition-[stroke-dashoffset] duration-1000"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="font-sans text-3xl font-bold leading-none tracking-tight">{pct}%</p>
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider opacity-80">studied</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, tone, label, value, sub, to }) {
  return (
    <Link to={to} className="card group flex flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
      <span className={`grid h-9 w-9 place-items-center rounded-full ${tone}`}>
        <TabIcon name={icon} className="h-5 w-5" />
      </span>
      <span className="muted text-sm leading-tight">{label}</span>
      <span className="font-sans text-3xl font-bold leading-none tracking-tight">
        {value}
        {sub && <span className="text-lg text-ink-faint">{sub}</span>}
      </span>
    </Link>
  )
}

export default function Home() {
  const p = useProgress()
  const pct = unitPercent(p)
  const resume = p.lastLearn ?? '/learn/political'
  const resumeLabel = p.lastLearn ? 'Resume' : 'Start learning'
  const quizAvg = p.mcq.answered ? `${Math.round((p.mcq.correct / p.mcq.answered) * 100)}%` : '–'
  const viewedCats = categories.filter((c) => p.viewed.includes(c.id)).length
  const mastered = p.mastered.filter((id) => items.some((i) => i.id === id)).length
  const anyProgress = p.pages.length || p.mcq.answered || p.mastered.length || p.saq.length

  return (
    <>
      <div className="mb-6 hidden items-end justify-between md:flex">
        <div>
          <p className="eyebrow mb-1">Home</p>
          <h1 className="text-4xl">Welcome back, scholar</h1>
        </div>
        <Link to="/learn" className="text-sm font-semibold text-celadon-deep hover:underline">
          View all of Learn →
        </Link>
      </div>

      {/* Big unit card */}
      <div className="mb-2 flex items-center justify-between md:hidden">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">Your unit</p>
        <Link to="/learn" className="text-xs font-bold uppercase tracking-wider text-celadon-deep">
          View all ›
        </Link>
      </div>
      <section
        aria-label="Your unit progress"
        className="rise relative mt-14 overflow-visible rounded-[1.75rem] bg-gradient-to-br from-[#4f7f71] to-[#35584e] px-5 pb-5 pt-4 text-paper-card shadow-lift sm:mt-16 sm:px-8 sm:pb-8 sm:pt-10"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.75rem]">
          <InkMountains className="absolute inset-x-0 bottom-0 h-40 w-full opacity-25 mix-blend-soft-light" sun={false} />
          <Cloud className="absolute right-6 top-4 w-24 opacity-30" />
        </div>
        <div className="absolute -top-16 left-3 sm:-top-20 sm:left-auto sm:right-36">
          <Mascot pose="wave" size={124} />
        </div>
        <div className="relative flex flex-col-reverse gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0 flex-1">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[#cfe3da]">{meta.course}</p>
            <h2 className="mt-1 text-3xl leading-tight text-paper-card sm:text-4xl">{meta.title}</h2>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-[#dcebe4]">
              <TabIcon name="learn" className="mt-0.5 h-4 w-4 shrink-0" />
              {UNIT_PAGES.length} lessons · {categories.length} PIRATES lenses · {items.length} developments
            </p>
          </div>
          <div className="flex justify-end">
            <ProgressRing pct={pct} size={100} />
          </div>
        </div>
        <div className="relative mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
          <Link to={resume} className="btn bg-paper-card text-celadon-deep hover:bg-white">
            {resumeLabel}
          </Link>
          <Link to="/practice" className="btn border-2 border-paper-card/80 text-paper-card hover:bg-white/10">
            Practice
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section aria-labelledby="stats-heading" className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="stats-heading" className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
            Unit statistics
          </h2>
          {anyProgress ? (
            <button type="button" onClick={resetProgress} className="faint text-xs hover:underline">
              Reset progress
            </button>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard icon="practice" tone="bg-seal-wash text-seal" label="Quiz average" value={quizAvg} to="/practice/mcq" />
          <StatCard icon="learn" tone="bg-celadon-wash text-celadon-deep" label="Flashcards mastered" value={mastered} sub={`/${items.length}`} to="/practice/flashcards" />
          <StatCard icon="home" tone="bg-ochre-wash text-ochre" label="Categories completed" value={viewedCats} sub="/7" to="/learn" />
          <StatCard icon="sources" tone="bg-paper-deep text-ink-soft" label="SAQs attempted" value={p.saq.length} sub={`/${practice.saq.length}`} to="/practice/saq" />
        </div>
      </section>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link to="/learn/timeline" className="flex items-center gap-3 rounded-2xl bg-celadon-wash/70 px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-celadon-deep transition hover:bg-celadon-wash">
          <TabIcon name="sources" className="h-5 w-5" /> Timeline
        </Link>
        <Link to="/connections" className="flex items-center gap-3 rounded-2xl bg-paper-deep/80 px-4 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-soft transition hover:bg-paper-deep">
          <TabIcon name="connections" className="h-5 w-5" /> Connections
        </Link>
      </div>

      {/* PIRATES */}
      <section aria-labelledby="pirates-heading" className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="pirates-heading" className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-ink-soft">
            PIRATES lessons
          </h2>
          <span className="faint text-xs">{viewedCats}/7 stamped</span>
        </div>
        <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7">
          {categories.map((c) => {
            const done = p.viewed.includes(c.id)
            return (
              <li key={c.id} className="w-32 shrink-0 snap-start sm:w-auto">
                <Link to={`/learn/${c.id}`} className="card relative flex h-full flex-col items-center gap-2 px-3 pb-3 pt-4 text-center transition hover:-translate-y-0.5 hover:shadow-lift">
                  <CategoryIcon id={c.id} size={52} />
                  <span className="font-display text-lg font-semibold leading-tight">{c.name}</span>
                  {done && (
                    <span className="absolute -right-1.5 -top-1.5" title="Viewed">
                      <SealStamp text="閱" size={30} />
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Key concept scroll */}
      <section aria-labelledby="kc-heading" className="mt-10">
        <div className="scroll mx-auto max-w-3xl px-6 py-7 text-center sm:px-10">
          <p id="kc-heading" className="eyebrow">Key concept · College Board</p>
          <p className="mt-3 font-display text-2xl leading-snug sm:text-3xl">{meta.learningObjective.replace(/ College Board.*$/, '')}</p>
          <Link to="/learn" className="btn-primary mt-5">
            Explore Learn →
          </Link>
        </div>
      </section>
    </>
  )
}
