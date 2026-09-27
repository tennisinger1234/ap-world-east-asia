import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { search } from '../lib/content'

function SearchIcon({ className = 'h-4 w-4' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8.5" cy="8.5" r="5.5" />
      <path d="M13 13l4.5 4.5" strokeLinecap="round" />
    </svg>
  )
}

/** Search box with live results. `onDone` closes a surrounding overlay after navigating. */
export default function Search({ autoFocus = false, onDone, className = '' }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const results = useMemo(() => search(q, 8), [q])
  const navigate = useNavigate()
  const listId = useId()
  const box = useRef(null)

  useEffect(() => {
    const close = (e) => box.current && !box.current.contains(e.target) && setOpen(false)
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  const go = (href) => {
    navigate(href)
    setOpen(false)
    setQ('')
    onDone?.()
  }

  const onKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[active]) go(results[active].href)
      else if (q.trim()) go(`/search?q=${encodeURIComponent(q.trim())}`)
    } else if (e.key === 'Escape') {
      setOpen(false)
      onDone?.()
    }
  }

  const showList = open && q.trim().length >= 2

  return (
    <div ref={box} className={`relative ${className}`}>
      <label className="flex items-center gap-2 rounded-full border border-ink-line bg-paper-card px-3 py-1.5 text-ink-soft focus-within:border-ink">
        <SearchIcon />
        <span className="sr-only">Search the study guide</span>
        <input
          type="search"
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value)
            setOpen(true)
            setActive(0)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          placeholder="Search: Zhu Xi, Champa rice…"
          className="w-full min-w-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
        />
      </label>
      {showList && (
        <div
          id={listId}
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-full min-w-[18rem] overflow-hidden rounded-lg border border-ink-line bg-paper-card shadow-lift sm:w-[26rem]"
        >
          {results.length === 0 ? (
            <p className="faint px-4 py-3 text-sm">No matches for “{q}”.</p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto py-1">
              {results.map((r, i) => (
                <li key={r.key} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r.href)}
                    className={`block w-full px-4 py-2.5 text-left ${i === active ? 'bg-celadon-wash/70' : ''}`}
                  >
                    <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-seal">{r.kind}</span>
                    <span className="block text-sm font-semibold text-ink">{r.title}</span>
                    {r.snippet && <span className="faint line-clamp-2 block text-xs">{r.snippet}</span>}
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}
            className={`block w-full border-t border-ink-line px-4 py-2 text-left text-xs font-semibold text-celadon-deep ${active === results.length ? 'bg-celadon-wash/70' : ''}`}
          >
            See all results for “{q.trim()}” →
          </button>
        </div>
      )}
    </div>
  )
}

export { SearchIcon }
