import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { flashElement } from '../components/Notes'

// When a page is opened with ?focus=<element id> (e.g. from search), scroll to it and highlight it.
export function useFocusParam(deps = []) {
  const [params] = useSearchParams()
  const focus = params.get('focus')
  useEffect(() => {
    if (!focus) return
    const t = setTimeout(() => flashElement(document.getElementById(focus)), 350)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, ...deps])
  return focus
}
