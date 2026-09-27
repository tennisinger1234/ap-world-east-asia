import { Link } from 'react-router-dom'
import { buildNotes, categories, eras, itemsByCategory, meta, overview } from '../lib/content'
import { resetProgress, useProgress } from '../lib/progress'
import { InkMountains, SealStamp } from '../components/Decor'
import { CategoryIcon, Cloud } from '../components/Illustrations'
import Mascot from '../components/Mascot'
import LearnTabs from '../components/LearnTabs'
import { Fn, NotesSection } from '../components/Notes'
import { NextSteps } from '../components/ui'

const START = eras[0].start
const END = eras[eras.length - 1].end
const pct = (y) => ((y - START) / (END - START)) * 100

function EraBand() {
  const ticks = [960, 1127, 1200, 1279, 1368, 1450]
  return (
    <div className="card p-4 sm:p-6">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="faint text-xs font-semibold uppercase tracking-wider">China, {START}–{END}</p>
        <p className="faint text-xs">
          <span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-seal align-middle" /> Song focus
          <span className="ml-3 mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-ink-faint/40 align-middle" /> Later context
        </p>
      </div>
      <div className="relative h-14 overflow-hidden rounded-md bg-paper-deep">
        {eras.map((e) => (
          <div
            key={e.id}
            className={`absolute inset-y-0 flex items-center justify-center border-r-2 border-paper-card px-1 text-center text-xs font-bold sm:text-sm ${
              e.focus === 'song' ? (e.id === 'northern-song' ? 'bg-seal/85 text-paper-card' : 'bg-seal text-paper-card') : 'bg-ink-faint/25 text-ink-soft'
            }`}
            style={{ left: `${pct(e.start)}%`, width: `${pct(e.end) - pct(e.start)}%` }}
            title={`${e.name}, ${e.start}–${e.end === 1450 ? '1644' : e.end}`}
          >
            <span className="truncate">{e.name}</span>
          </div>
        ))}
        <div className="absolute inset-y-0 border-l-2 border-dashed border-ink" style={{ left: `${pct(1200)}%` }} title="1200: start of the AP period" />
      </div>
      <div className="relative mt-2 h-4 text-[11px] font-medium">
        {ticks.map((t, i) => (
          <span
            key={t}
            className={`faint absolute ${i === 0 ? '' : i === ticks.length - 1 ? '-translate-x-full' : '-translate-x-1/2'} ${t === 1127 || t === 1368 ? 'hidden sm:inline' : ''}`}
            style={{ left: `${pct(t)}%` }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function LearnHub() {
  const { viewed } = useProgress()
  const song = overview.filter((o) => o.group === 'song')
  const neighborsOv = overview.filter((o) => o.group === 'neighbors')
  const context = overview.filter((o) => o.group === 'context')
  const ordered = [...song, ...neighborsOv, ...context]
  const { numbers, notes } = buildNotes(ordered)
  const fnFor = (o) => numbers[ordered.indexOf(o)]
  const viewedCount = categories.filter((c) => viewed.includes(c.id)).length
  const nextCat = categories.find((c) => !viewed.includes(c.id))
  const primary = nextCat
    ? { to: `/learn/${nextCat.id}`, label: `${viewedCount === 0 ? 'Start with' : 'Continue:'} ${nextCat.name} →` }
    : { to: '/practice', label: 'All 7 viewed. Practice what you learned →' }

  return (
    <>
      <LearnTabs />

      <section className="relative mb-12 overflow-hidden rounded-[1.75rem] border border-ink-line bg-paper-card/70 px-6 pb-40 pt-10 shadow-paper sm:px-12 sm:pb-48 sm:pt-14">
        <InkMountains className="pointer-events-none absolute inset-x-0 bottom-0 h-48 w-full sm:h-64" />
        <Cloud className="pointer-events-none absolute right-10 top-8 hidden w-32 opacity-80 sm:block" />
        <Cloud className="pointer-events-none absolute right-52 top-24 hidden w-20 opacity-60 lg:block" flip />
        <div className="pointer-events-none absolute bottom-6 right-4 sm:bottom-10 sm:right-12">
          <Mascot pose="read" size={130} />
        </div>
        <div className="relative max-w-3xl">
          <p className="eyebrow mb-4">{meta.eyebrow}</p>
          <h1 className="rise text-5xl leading-[0.95] sm:text-7xl">
            {meta.title}
            <span className="mt-2 block font-display text-2xl font-medium italic text-ink-soft sm:text-3xl">{meta.subtitle}</span>
          </h1>
          <p className="rise mt-6 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg" style={{ '--d': '120ms' }}>
            {meta.intro}
          </p>
          <blockquote className="rise mt-6 max-w-2xl border-l-2 border-seal pl-4 text-sm italic text-ink-soft" style={{ '--d': '220ms' }}>
            {meta.learningObjective}
          </blockquote>
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ '--d': '300ms' }}>
            <Link to={primary.to} className="btn-primary">
              {primary.label}
            </Link>
            {nextCat && (
              <Link to="/practice" className="btn-ghost">
                Practice
              </Link>
            )}
          </div>
        </div>
      </section>

      <section id="pirates" aria-labelledby="pirates-heading" className="mb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">PIRATES</p>
            <h2 id="pirates-heading" className="text-3xl sm:text-4xl">
              Seven lenses on Song China
            </h2>
          </div>
          <div className="w-full max-w-xs" aria-label={`${viewedCount} of 7 categories viewed`}>
            <div className="mb-1 flex justify-between text-xs font-semibold">
              <span className="muted">Your progress</span>
              <span className="text-celadon-deep">{viewedCount} of 7 viewed</span>
            </div>
            <div className="flex gap-1">
              {categories.map((c) => (
                <span
                  key={c.id}
                  title={`${c.name}${viewed.includes(c.id) ? ': viewed' : ''}`}
                  className={`h-2 flex-1 rounded-full ${viewed.includes(c.id) ? 'bg-celadon' : 'bg-paper-deep'}`}
                />
              ))}
            </div>
            {viewedCount > 0 && (
              <button type="button" onClick={resetProgress} className="faint mt-1 text-xs hover:underline">
                Reset progress
              </button>
            )}
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c, i) => {
            const songCount = itemsByCategory(c.id, 'song').length
            const done = viewed.includes(c.id)
            return (
              <li key={c.id} className="rise" style={{ '--d': `${i * 50}ms` }}>
                <Link
                  to={`/learn/${c.id}`}
                  className="card group relative flex h-full flex-col gap-3 p-4 transition hover:-translate-y-0.5 hover:border-ink hover:shadow-lift sm:p-5"
                >
                  <CategoryIcon id={c.id} size={56} />
                  {done && (
                    <span className="absolute right-3 top-3" title="Viewed" aria-label="viewed">
                      <SealStamp text="閱" size={34} />
                    </span>
                  )}
                  <div>
                    <h3 className="text-2xl group-hover:underline">{c.name}</h3>
                    <p className="muted mt-1 text-sm leading-snug">{c.blurb}</p>
                  </div>
                  <span className="faint mt-auto text-xs font-semibold">{songCount} Song developments →</span>
                </Link>
              </li>
            )
          })}
          <li className="rise" style={{ '--d': '350ms' }}>
            <Link
              to="/learn/neighbors"
              className="flex h-full flex-col justify-center gap-2 rounded-lg border border-dashed border-ink-line p-4 transition hover:border-ink sm:p-5"
            >
              <span className="font-display text-2xl font-semibold">Japan · Korea · Vietnam →</span>
              <span className="muted text-sm">Chinese influence and local adaptation</span>
            </Link>
          </li>
        </ul>
      </section>

      <section aria-labelledby="overview-heading" className="mb-6">
        <p className="eyebrow mb-2">Regional overview</p>
        <h2 id="overview-heading" className="mb-6 text-3xl sm:text-4xl">
          The Song, its neighbors, and what came after
        </h2>
        <EraBand />

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {song.map((o) => (
            <article key={o.id} className="scroll unroll px-6 py-7 lg:col-span-2">
              <p className="eyebrow mb-1">Focus</p>
              <h3 className="text-3xl">
                {o.name}
                <Fn n={fnFor(o)} />
              </h3>
              <p className="faint text-sm font-medium">{o.dates}</p>
              <p className="mt-3 text-lg leading-relaxed">{o.summary}</p>
            </article>
          ))}
          <div className="grid gap-3">
            {context.map((o) => (
              <article key={o.id} className="rounded-md border border-dashed border-ink-line p-4">
                <p className="faint text-[0.65rem] font-semibold uppercase tracking-wider">After the Song · context</p>
                <h3 className="text-xl">
                  {o.name}
                  <Fn n={fnFor(o)} />
                </h3>
                <p className="faint text-xs font-medium">{o.dates}</p>
                <p className="muted mt-1 text-sm leading-relaxed">{o.summary}</p>
              </article>
            ))}
            <Link to="/connections" className="text-sm font-semibold text-celadon-deep hover:underline">
              How the Yuan and Ming continued or changed Song ways →
            </Link>
          </div>
        </div>

        <h3 className="mb-4 mt-10 text-2xl">Neighbors in the Chinese cultural sphere</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {neighborsOv.map((o) => (
            <article key={o.id} className="card p-5">
              <h4 className="text-xl">
                {o.name}
                <Fn n={fnFor(o)} />
              </h4>
              <p className="faint text-sm font-medium">{o.dates}</p>
              <p className="mt-2 text-sm leading-relaxed">{o.summary}</p>
              <Link to={`/learn/neighbors?society=${o.id.replace(/-.*/, '')}`} className="mt-2 inline-block text-xs font-semibold text-celadon-deep hover:underline">
                Adopted vs. adapted →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <NotesSection notes={notes} />
      <NextSteps
        links={[
          primary,
          { to: '/learn/timeline', label: 'Timeline' },
          ...(nextCat ? [{ to: '/practice', label: 'Practice' }] : [{ to: '/connections', label: 'Connections' }]),
        ]}
      />
    </>
  )
}
