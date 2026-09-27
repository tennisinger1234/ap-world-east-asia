import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App, { RELOAD_KEY } from './App'
import './index.css'

// A successful start means any one-time "new version" reload worked; allow it again later.
setTimeout(() => {
  try {
    sessionStorage.removeItem(RELOAD_KEY)
  } catch {
    /* ignore */
  }
}, 5000)

// Vite fires this when a preloaded file is missing (stale tab after a redeploy).
// Reload once; if the file is still missing, let the page show its "reload" screen instead of looping.
window.addEventListener('vite:preloadError', (event) => {
  try {
    if (sessionStorage.getItem(RELOAD_KEY)) return
    sessionStorage.setItem(RELOAD_KEY, '1')
  } catch {
    return
  }
  event.preventDefault()
  window.location.reload()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>,
)
