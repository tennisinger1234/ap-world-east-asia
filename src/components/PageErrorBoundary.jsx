import { Component } from 'react'
import { EmptyState } from './Loading'

/**
 * Keeps the app from going blank if a page fails to load (for example, a tab left open
 * across a redeploy asks for page files that no longer exist). Shows a reload prompt instead.
 */
export default class PageErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="py-10">
        <EmptyState
          pose="encourage"
          title="This page needs a refresh"
          action={
            <button type="button" className="btn-primary" onClick={() => window.location.reload()}>
              Reload the page
            </button>
          }
        >
          The study guide was updated since this tab was opened. Reloading loads the newest version.
        </EmptyState>
      </div>
    )
  }
}
