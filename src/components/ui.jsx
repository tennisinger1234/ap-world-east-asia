import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getCategory } from '../lib/content'
import { SealStamp } from './Decor'

export function Seal({ categoryId, size = 44, animate }) {
  const cat = getCategory(categoryId)
  if (!cat) return null
  return <SealStamp text={cat.letter} size={size} animate={animate} />
}

export function CategoryChip({ categoryId, link = true }) {
  const cat = getCategory(categoryId)
  if (!cat) return null
  const cls = 'chip bg-celadon-wash text-celadon-deep'
  return link ? (
    <Link to={`/learn/${cat.id}`} className={`${cls} hover:underline`}>
      {cat.letter} · {cat.name}
    </Link>
  ) : (
    <span className={cls}>
      {cat.letter} · {cat.name}
    </span>
  )
}

const CONNECTION_STYLE = {
  'cause/effect': { label: 'Cause → Effect', cls: 'bg-seal-wash text-seal' },
  continuity: { label: 'Continuity', cls: 'bg-celadon-wash text-celadon-deep' },
  change: { label: 'Change', cls: 'bg-ochre-wash text-ochre' },
}

export function ConnectionChip({ type }) {
  const s = CONNECTION_STYLE[type]
  if (!s) return null
  return <span className={`chip ${s.cls}`}>{s.label}</span>
}

const ERA_LABEL = { yuan: 'Yuan', ming: 'Ming' }
export function EraChip({ era }) {
  if (!ERA_LABEL[era]) return null
  return <span className="chip border border-ink-line text-ink-soft">{ERA_LABEL[era]} context</span>
}

export function BackgroundBadge({ show }) {
  if (!show) return null
  return (
    <span className="chip bg-paper-deep text-ink-soft" title="Dated before 1200; shown as continuity into the 1200–1450 period">
      Roots before 1200
    </span>
  )
}

export function PageHeader({ eyebrow, title, children, seal }) {
  return (
    <header className="rise mb-8 flex items-start gap-4 sm:mb-10">
      {seal}
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="brush text-4xl leading-[1.05] sm:text-5xl">{title}</h1>
        {children && <div className="muted mt-4 max-w-3xl text-base leading-relaxed sm:text-lg">{children}</div>}
      </div>
    </header>
  )
}

/** "Where next?" footer so no page is a dead end. */
export function NextSteps({ links }) {
  return (
    <nav aria-label="Next steps" className="mt-14 border-t border-ink-line pt-6">
      <p className="eyebrow mb-3">Keep going</p>
      <div className="flex flex-wrap gap-3">
        {links.map((l, i) => (
          <Link key={l.to} to={l.to} className={i === 0 ? 'btn-primary' : 'btn-ghost'}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

/** Horizontal tab row used under Learn and Practice. */
export function TabRow({ tabs, label }) {
  const ref = useRef(null)
  const activeTo = tabs.find((t) => t.active)?.to
  useEffect(() => {
    const nav = ref.current
    const el = nav?.querySelector('[aria-current="page"]')
    if (nav && el) nav.scrollLeft = el.offsetLeft - nav.clientWidth / 2 + el.clientWidth / 2
  }, [activeTo])
  return (
    <nav ref={ref} aria-label={label} className="-mx-4 mb-8 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex w-max min-w-full gap-0.5 border-b border-ink-line">
        {tabs.map((t) => (
          <li key={t.to}>
            <Link
              to={t.to}
              aria-current={t.active ? 'page' : undefined}
              className={`-mb-px flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2 py-2.5 xl:px-2.5 text-sm font-medium transition ${
                t.active ? 'border-seal text-ink' : 'border-transparent text-ink-soft hover:border-ink-line hover:text-ink'
              }`}
            >
              {t.prefix}
              {t.label}
              {t.done && (
                <span className="text-celadon-deep" aria-label="viewed">
                  ✓
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
