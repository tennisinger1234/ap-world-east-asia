import { useState } from 'react'
import { Link } from 'react-router-dom'
import { photosForItem } from '../lib/content'
import { Fn } from './Notes'
import Photo from './Photo'
import { BackgroundBadge, CategoryChip, ConnectionChip, EraChip } from './ui'

/** A development, presented as a small hanging scroll that unrolls into view. */
export default function ItemCard({ item, fn, showCategory = false, index = 0 }) {
  return (
    <article id={item.id} className="scroll unroll flex flex-col px-5 pb-6 pt-6 transition sm:px-6" style={{ '--d': `${Math.min(index, 8) * 70}ms` }}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {showCategory && <CategoryChip categoryId={item.category} />}
        <ConnectionChip type={item.connectionType} />
        <EraChip era={item.era} />
        <BackgroundBadge show={item.background} />
      </div>
      <h3 className="text-2xl leading-tight">
        {item.title}
        <Fn n={fn} />
      </h3>
      <p className="faint mt-1 text-sm font-medium">
        {item.date}
        {item.region ? ` · ${item.region}` : ''}
      </p>
      <p className="mt-3 leading-relaxed">{item.summary}</p>
      {photosForItem(item.id).map((ph) => (
        <Photo key={ph.id} photo={ph} className="mt-4" />
      ))}
      <div className="mt-4 border-l-2 border-celadon bg-celadon-wash/50 px-3 py-2 text-sm leading-relaxed">
        <span className="font-semibold text-celadon-deep">Global connection: </span>
        {item.globalConnection}
      </div>
    </article>
  )
}

/** Compact Yuan/Ming context entry: title and date, first sentence, expandable. */
export function ContextCard({ item, fn }) {
  const [open, setOpen] = useState(false)
  const first = item.summary.split(/(?<=\.)\s+/)[0]
  return (
    <li id={item.id} className="rounded-md border border-dashed border-ink-line bg-paper-card/60 p-4 transition">
      <div className="flex flex-wrap items-center gap-2">
        <EraChip era={item.era} />
        <ConnectionChip type={item.connectionType} />
      </div>
      <p className="mt-2 font-display text-lg font-semibold leading-snug">
        {item.title}
        <Fn n={fn} />
        <span className="faint ml-2 font-sans text-xs font-medium">{item.date}</span>
      </p>
      <p className="muted mt-1 text-sm leading-relaxed">{open ? item.summary : first}</p>
      {open && <p className="mt-2 text-sm leading-relaxed"><span className="font-semibold">Global connection: </span>{item.globalConnection}</p>}
      <div className="mt-2 flex flex-wrap gap-3 text-xs font-semibold">
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-celadon-deep hover:underline" aria-expanded={open}>
          {open ? 'Show less' : 'Read more'}
        </button>
        <Link to="/connections" className="text-celadon-deep hover:underline">
          See it on Connections →
        </Link>
      </div>
    </li>
  )
}
