import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { buildNotes, categories, getCategory, itemsByCategory } from '../lib/content'
import { markViewed } from '../lib/progress'
import { useFocusParam } from '../lib/useFocusParam'
import ItemCard, { ContextCard } from '../components/ItemCard'
import LearnTabs from '../components/LearnTabs'
import { NotesSection } from '../components/Notes'
import { Seal } from '../components/ui'
import { SealStamp } from '../components/Decor'
import { CategoryIcon, Cloud } from '../components/Illustrations'
import Mascot from '../components/Mascot'
import NotFound from './NotFound'

function SectionTitle({ eyebrow, title, children }) {
  return (
    <div className="mb-5 mt-12 first:mt-0">
      <p className="eyebrow mb-1">{eyebrow}</p>
      <h2 className="text-3xl">{title}</h2>
      {children && <p className="muted mt-1 max-w-2xl text-sm">{children}</p>}
    </div>
  )
}

export default function Category() {
  const { id } = useParams()
  const cat = getCategory(id)
  useEffect(() => {
    if (cat) markViewed(cat.id)
  }, [cat])
  useFocusParam([id])
  if (!cat) return <NotFound />

  const song = itemsByCategory(id, 'song')
  const abroad = itemsByCategory(id, 'neighbors')
  const context = itemsByCategory(id, 'context')
  const { numbers, notes } = buildNotes([...song, ...abroad, ...context])
  const idx = categories.findIndex((c) => c.id === id)
  const prev = categories[idx - 1]
  const next = categories[idx + 1]

  return (
    <>
      <LearnTabs />
      <div className="relative mb-10 overflow-hidden rounded-[1.75rem] border border-ink-line/70 bg-paper-card/70 px-5 py-6 shadow-paper sm:px-8">
        <Cloud className="pointer-events-none absolute -right-4 top-3 w-28 opacity-70" />
        <div className="relative flex items-center gap-4 sm:gap-6">
          <div className="relative shrink-0">
            <span className="grid h-20 w-20 place-items-center rounded-2xl bg-celadon-wash sm:h-24 sm:w-24">
              <CategoryIcon id={cat.id} size={64} />
            </span>
            <span className="absolute -bottom-2 -right-3" title="Stamped: you've viewed this category">
              <SealStamp text="閱" size={34} animate />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="eyebrow mb-1">PIRATES · {cat.letter} · {idx + 1} of 7</p>
            <h1 className="text-4xl leading-none sm:text-5xl">{cat.name}</h1>
            <p className="muted mt-2 max-w-2xl text-sm leading-relaxed sm:text-base">{cat.blurb}</p>
          </div>
          <Mascot pose="read" size={120} className="hidden shrink-0 sm:block" />
        </div>
      </div>

      <SectionTitle eyebrow="Song China" title={`${cat.name} developments in the Song`} />
      <div className="grid gap-7 md:grid-cols-2">
        {song.map((item, i) => (
          <ItemCard key={item.id} item={item} fn={numbers[i]} index={i} />
        ))}
      </div>

      {abroad.length > 0 && (
        <>
          <SectionTitle eyebrow="Chinese influence and local adaptation" title="Across East Asia">
            How Japan, Korea, and Vietnam adopted and adapted, or resisted. Full comparison on the{' '}
            <Link to="/learn/neighbors" className="font-semibold text-celadon-deep hover:underline">
              Japan · Korea · Vietnam
            </Link>{' '}
            page.
          </SectionTitle>
          <div className="grid gap-7 md:grid-cols-2">
            {abroad.map((item, i) => (
              <ItemCard key={item.id} item={item} fn={numbers[song.length + i]} index={i} />
            ))}
          </div>
        </>
      )}

      {context.length > 0 && (
        <>
          <SectionTitle eyebrow="After the Song" title="Yuan and Ming context">
            Brief context for continuity and change after 1279. Explore it fully on{' '}
            <Link to="/connections" className="font-semibold text-celadon-deep hover:underline">
              Connections
            </Link>
            .
          </SectionTitle>
          <ul className="grid gap-3 md:grid-cols-2">
            {context.map((item, i) => (
              <ContextCard key={item.id} item={item} fn={numbers[song.length + abroad.length + i]} />
            ))}
          </ul>
        </>
      )}

      <nav className="mt-14 grid gap-3 border-t border-ink-line pt-6 sm:grid-cols-2" aria-label="Previous and next category">
        {prev ? (
          <Link to={`/learn/${prev.id}`} className="card group flex items-center gap-3 p-4 transition hover:border-ink">
            <span className="faint text-xl">←</span>
            <Seal categoryId={prev.id} size={36} />
            <span>
              <span className="faint block text-xs font-semibold uppercase tracking-wider">Previous category</span>
              <span className="font-display text-xl font-semibold group-hover:underline">{prev.name}</span>
            </span>
          </Link>
        ) : (
          <Link to="/" className="card group flex items-center gap-3 p-4 transition hover:border-ink">
            <span className="faint text-xl">←</span>
            <span>
              <span className="faint block text-xs font-semibold uppercase tracking-wider">Back to</span>
              <span className="font-display text-xl font-semibold group-hover:underline">Learn overview</span>
            </span>
          </Link>
        )}
        {next ? (
          <Link to={`/learn/${next.id}`} className="card group flex items-center justify-end gap-3 p-4 text-right transition hover:border-ink">
            <span>
              <span className="faint block text-xs font-semibold uppercase tracking-wider">Next category</span>
              <span className="font-display text-xl font-semibold group-hover:underline">{next.name}</span>
            </span>
            <Seal categoryId={next.id} size={36} />
            <span className="faint text-xl">→</span>
          </Link>
        ) : (
          <Link to="/learn/neighbors" className="card group flex items-center justify-end gap-3 p-4 text-right transition hover:border-ink">
            <span>
              <span className="faint block text-xs font-semibold uppercase tracking-wider">Next</span>
              <span className="font-display text-xl font-semibold group-hover:underline">Japan · Korea · Vietnam</span>
            </span>
            <span className="faint text-xl">→</span>
          </Link>
        )}
      </nav>
      <p className="mt-4 text-center text-sm">
        <Link to={`/practice/sort`} className="font-semibold text-celadon-deep hover:underline">
          Test yourself: sort developments into PIRATES →
        </Link>
      </p>

      <NotesSection notes={notes} />
    </>
  )
}
