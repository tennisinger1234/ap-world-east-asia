import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { meta } from '../lib/content'
import { markPage } from '../lib/progress'
import { InkMountains, SealStamp } from './Decor'
import { TabIcon } from './Illustrations'
import Loading from './Loading'
import Search, { SearchIcon } from './Search'

export const TABS = [
  { to: '/', label: 'Home', icon: 'home', match: (p) => p === '/' },
  { to: '/learn', label: 'Learn', icon: 'learn', match: (p) => p.startsWith('/learn') },
  { to: '/practice', label: 'Practice', icon: 'practice', match: (p) => p.startsWith('/practice') },
  { to: '/connections', label: 'Connections', icon: 'connections', match: (p) => p.startsWith('/connections') },
  { to: '/sources', label: 'Sources', icon: 'sources', match: (p) => p.startsWith('/sources') },
]

export default function Layout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { pathname, search } = useLocation()
  const current = TABS.find((t) => t.match(pathname))

  useEffect(() => {
    setSearchOpen(false)
    markPage(pathname)
    if (!/focus=|src=/.test(search)) window.scrollTo({ top: 0 })
  }, [pathname, search])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !e.target.closest('input, textarea, select')) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-paper-card focus:px-3 focus:py-2">
        Skip to content
      </a>

      <header className="sticky z-40 border-b border-ink-line/70 bg-paper/90 backdrop-blur-md" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="wrap flex h-16 items-center gap-3">
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label={`${meta.title}: home`}>
            <SealStamp text="宋" size={36} />
            <span className="leading-tight">
              <span className="block font-display text-lg font-bold md:hidden">{current?.label ?? meta.shortTitle}</span>
              <span className="hidden font-display text-lg font-bold md:block">{meta.title}</span>
              <span className="faint hidden text-[0.7rem] font-medium uppercase tracking-wider md:block">{meta.course}</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
            {TABS.map((t) => {
              const active = t.match(pathname)
              return (
                <NavLink
                  key={t.to}
                  to={t.to}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition ${
                    active ? 'bg-celadon-wash text-celadon-deep' : 'text-ink-soft hover:bg-paper-deep hover:text-ink'
                  }`}
                >
                  <TabIcon name={t.icon} className="h-[18px] w-[18px]" />
                  {t.label}
                </NavLink>
              )
            })}
          </nav>

          <Search className="hidden w-52 xl:block xl:w-60" />
          <button
            type="button"
            className="btn-ghost ml-auto h-10 w-10 !px-0 md:ml-0 xl:hidden"
            aria-label="Search"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((o) => !o)}
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
        {searchOpen && (
          <div className="wrap pb-3 xl:hidden">
            <Search autoFocus onDone={() => setSearchOpen(false)} />
          </div>
        )}
      </header>

      <main id="main" className="wrap flex-1 pb-28 pt-6 sm:pt-10 md:pb-12">
        <Suspense fallback={<Loading />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="relative hidden overflow-hidden border-t border-ink-line md:block">
        <InkMountains className="pointer-events-none absolute inset-x-0 bottom-0 h-32 w-full opacity-60" sun={false} />
        <div className="wrap relative flex items-center justify-between gap-3 py-8 text-sm">
          <span className="faint">{meta.footer}</span>
          <nav className="flex flex-wrap gap-x-4 font-medium" aria-label="Footer">
            {TABS.map((t) => (
              <Link key={t.to} to={t.to} className="text-ink-soft hover:text-ink hover:underline">
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>

      {/* Mobile bottom tab bar */}
      <nav
        aria-label="Main"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-line bg-paper-card/95 shadow-[0_-6px_20px_-12px_rgb(var(--ink)/.35)] backdrop-blur md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <ul className="mx-auto grid max-w-md grid-cols-5">
          {TABS.map((t) => {
            const active = t.match(pathname)
            return (
              <li key={t.to}>
                <NavLink
                  to={t.to}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 pb-2 pt-1.5 text-[0.68rem] font-semibold ${active ? 'text-celadon-deep' : 'text-ink-faint'}`}
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full transition ${
                      active ? '-mt-4 bg-celadon-deep text-paper-card shadow-lift ring-4 ring-paper-card' : ''
                    }`}
                  >
                    <TabIcon name={t.icon} className="h-5 w-5" />
                  </span>
                  {t.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
