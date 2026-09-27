import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { buildNotes, categories, timelineEntries } from '../lib/content'
import { useFocusParam } from '../lib/useFocusParam'
import LearnTabs from '../components/LearnTabs'
import { Fn, NotesSection } from '../components/Notes'
import { BackgroundBadge, CategoryChip, NextSteps, PageHeader } from '../components/ui'

const eraOf = (y) => (y < 1127 ? 'Northern Song' : y < 1279 ? 'Southern Song' : y < 1368 ? 'Yuan' : 'Ming')

export default function Timeline() {
  const [filter, setFilter] = useState('all')
  const [showRoots, setShowRoots] = useState(true)
  useFocusParam()

  const entries = useMemo(
    () =>
      timelineEntries().filter(
        (e) => (showRoots || !e.background) && e.year <= 1450 && (filter === 'all' || e.category === filter),
      ),
    [filter, showRoots],
  )
  const { numbers, notes } = buildNotes(entries)
  let lastEra = null

  return (
    <>
      <LearnTabs />
      <PageHeader eyebrow="Chronology" title="Timeline">
        Song China and its neighbors, c. 1200–1450, with Song roots from before 1200. Filter by PIRATES category.
      </PageHeader>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setFilter('all')} className={filter === 'all' ? 'btn-primary' : 'btn-ghost'} aria-pressed={filter === 'all'}>
          All
        </button>
        {categories.map((c) => (
          <button key={c.id} type="button" onClick={() => setFilter(c.id)} className={filter === c.id ? 'btn-primary' : 'btn-ghost'} aria-pressed={filter === c.id}>
            {c.letter}
            <span className="hidden sm:inline"> · {c.name}</span>
          </button>
        ))}
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium sm:ml-auto">
          <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--seal))]" checked={showRoots} onChange={(e) => setShowRoots(e.target.checked)} />
          Show Song roots before 1200
        </label>
      </div>

      {entries.length === 0 ? (
        <p className="muted">No dated entries in this category.</p>
      ) : (
        <ol className="relative ml-2 border-l-2 border-ink-line sm:ml-36">
          {entries.map((e, i) => {
            const era = eraOf(e.year)
            const showEra = era !== lastEra
            lastEra = era
            return (
              <li key={e.key} className="relative pb-5 pl-6 sm:pl-8">
                {showEra && (
                  <p className="-ml-6 mb-3 pt-3 font-display text-lg font-semibold italic text-seal sm:absolute sm:-left-40 sm:ml-0 sm:w-32 sm:pt-5 sm:text-right">
                    {era}
                  </p>
                )}
                <span
                  aria-hidden="true"
                  className={`absolute -left-[8px] h-3.5 w-3.5 rotate-45 border-2 border-paper ${e.focus === 'context' ? 'bg-ink-faint' : 'bg-seal'}`}
                  style={{ top: showEra ? '4.4rem' : '1.4rem' }}
                />
                <div id={e.key} className="card rise p-4 transition" style={{ '--d': `${Math.min(i, 10) * 30}ms` }}>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-sans text-lg font-bold tabular-nums">{e.date}</span>
                    {e.category && <CategoryChip categoryId={e.category} />}
                    <BackgroundBadge show={e.background} />
                  </div>
                  <p className="mt-1 font-medium">
                    {e.itemId ? (
                      <Link to={`/learn/${e.category}?focus=${e.itemId}`} className="hover:underline">
                        {e.label}
                      </Link>
                    ) : (
                      e.label
                    )}
                    <Fn n={numbers[i]} />
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <NotesSection notes={notes} />
      <NextSteps
        links={[
          { to: '/practice/order', label: 'Practice: put events in order →' },
          { to: '/connections', label: 'Connections' },
        ]}
      />
    </>
  )
}
