import { useSearchParams } from 'react-router-dom'
import { buildNotes, items, neighbors, photosForSociety } from '../lib/content'
import Photo from '../components/Photo'
import LearnTabs from '../components/LearnTabs'
import { Fn, NotesSection } from '../components/Notes'
import { SealStamp } from '../components/Decor'
import { BackgroundBadge, CategoryChip, NextSteps, PageHeader } from '../components/ui'
import { Link } from 'react-router-dom'

const REGION = { japan: 'Japan', korea: 'Korea', vietnam: 'Vietnam' }
const GLYPH = { japan: '日', korea: '韓', vietnam: '越' }

function Column({ title, tone, entries, numbers, offset }) {
  return (
    <div>
      <h3 className={`mb-3 font-sans text-xs font-bold uppercase tracking-[0.16em] ${tone}`}>{title}</h3>
      <ul className="space-y-2">
        {entries.map((e, i) => (
          <li key={i} className="rounded-md border border-ink-line bg-paper/60 p-3 text-sm leading-relaxed">
            {e.label && <span className="font-semibold">{e.label}: </span>}
            {e.text}
            <Fn n={numbers[offset + i]} />
            {e.background && (
              <span className="mt-2 flex flex-wrap gap-1">
                <BackgroundBadge show />
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Neighbors() {
  const [params, setParams] = useSearchParams()
  const active = params.get('society') ?? 'all'
  const societies = neighbors.societies
  const shown = active === 'all' ? societies : societies.filter((s) => s.id === active)

  const { numbers, notes } = buildNotes(shown.flatMap((s) => [...s.adopted, ...s.adapted]))
  let offset = 0

  return (
    <>
      <LearnTabs />
      <PageHeader eyebrow="Chinese influence and local adaptation" title="Japan, Korea & Vietnam">
        {neighbors.intro}
      </PageHeader>

      <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Society">
        {[{ id: 'all', name: 'All three' }, ...societies].map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active === s.id}
            onClick={() => setParams(s.id === 'all' ? {} : { society: s.id }, { replace: true })}
            className={active === s.id ? 'btn-primary' : 'btn-ghost'}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="space-y-10">
        {shown.map((s) => {
          const adoptedOffset = offset
          offset += s.adopted.length
          const adaptedOffset = offset
          offset += s.adapted.length
          const related = items.filter((i) => i.focus === 'neighbors' && i.region === REGION[s.id])
          return (
            <section key={s.id} className="scroll unroll px-5 py-7 sm:px-8" aria-labelledby={`h-${s.id}`}>
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <SealStamp text={GLYPH[s.id]} size={52} />
                <div>
                  <h2 id={`h-${s.id}`} className="text-3xl">
                    {s.name}
                  </h2>
                  <p className="faint text-sm font-medium">{s.states}</p>
                </div>
              </div>
              {s.summary && <p className="muted mb-6 max-w-3xl leading-relaxed">{s.summary}</p>}
              <div className="grid gap-6 md:grid-cols-2">
                <Column title="Chinese elements adopted" tone="text-seal" entries={s.adopted} numbers={numbers} offset={adoptedOffset} />
                <Column title="Local adaptations" tone="text-celadon-deep" entries={s.adapted} numbers={numbers} offset={adaptedOffset} />
              </div>
              {photosForSociety(s.id).length > 0 && (
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {photosForSociety(s.id).map((ph) => (
                    <Photo key={ph.id} photo={ph} />
                  ))}
                </div>
              )}
              {related.length > 0 && (
                <div className="mt-6 border-t border-ink-line pt-4">
                  <p className="faint mb-2 text-xs font-semibold uppercase tracking-wider">Related developments</p>
                  <ul className="flex flex-wrap gap-2">
                    {related.map((r) => (
                      <li key={r.id}>
                        <Link to={`/learn/${r.category}?focus=${r.id}`} className="inline-flex items-center gap-2 rounded-full border border-ink-line bg-paper-card px-3 py-1 text-sm hover:border-ink">
                          <CategoryChip categoryId={r.category} link={false} />
                          {r.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )
        })}
      </div>

      <NotesSection notes={notes} />
      <NextSteps
        links={[
          { to: '/learn/timeline', label: 'Next: Timeline →' },
          { to: '/connections', label: 'Connections' },
          { to: '/practice/saq', label: 'Practice an SAQ on diffusion' },
        ]}
      />
    </>
  )
}
