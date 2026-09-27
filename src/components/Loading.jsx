import Mascot from './Mascot'

/** Loading screen shown while a page's code arrives. */
export default function Loading({ label = 'Unrolling the scroll…' }) {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-live="polite">
      <div className="text-center">
        <Mascot pose="read" size={150} className="mx-auto" />
        <p className="mt-3 font-display text-2xl">{label}</p>
        <div className="mx-auto mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-paper-deep">
          <div className="h-full w-1/3 animate-[loadbar_1.1s_ease-in-out_infinite] rounded-full bg-celadon" />
        </div>
      </div>
    </div>
  )
}

/** Friendly empty state with the mascot. */
export function EmptyState({ pose = 'think', title, children, action }) {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center px-6 py-10 text-center">
      <Mascot pose={pose} size={130} />
      <p className="mt-3 font-display text-2xl">{title}</p>
      {children && <div className="muted mt-1 text-sm">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
