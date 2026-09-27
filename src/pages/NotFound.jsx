import { Link } from 'react-router-dom'
import { EmptyState } from '../components/Loading'

export default function NotFound() {
  return (
    <div className="py-10">
      <EmptyState
        pose="encourage"
        title="This page isn’t in the scroll"
        action={
          <div className="flex justify-center gap-3">
            <Link to="/" className="btn-primary">Back home</Link>
            <Link to="/learn" className="btn-ghost">Learn</Link>
          </div>
        }
      >
        The link may be old. Try searching, or head back home.
      </EmptyState>
    </div>
  )
}
