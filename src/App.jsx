import { lazy } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

// Pages load on demand; the mascot loading screen shows meanwhile (see Layout's Suspense).
// If a page file is missing because the site was redeployed while this tab was open,
// reload once to fetch the new version instead of showing a blank screen.
export const RELOAD_KEY = 'ap11-reloaded-for-update'
const lazyPage = (load) =>
  lazy(() =>
    load().catch((err) => {
      try {
        if (!sessionStorage.getItem(RELOAD_KEY)) {
          sessionStorage.setItem(RELOAD_KEY, '1')
          window.location.reload()
          return new Promise(() => {})
        }
      } catch {
        /* storage unavailable: fall through to the error screen */
      }
      throw err
    }),
  )

const LearnHub = lazyPage(() => import('./pages/LearnHub'))
const Category = lazyPage(() => import('./pages/Category'))
const Neighbors = lazyPage(() => import('./pages/Neighbors'))
const Timeline = lazyPage(() => import('./pages/Timeline'))
const Connections = lazyPage(() => import('./pages/Connections'))
const Sources = lazyPage(() => import('./pages/Sources'))
const SearchPage = lazyPage(() => import('./pages/SearchPage'))
const NotFound = lazyPage(() => import('./pages/NotFound'))
const PracticeHub = lazyPage(() => import('./pages/practice/PracticeHub'))
const MCQ = lazyPage(() => import('./pages/practice/MCQ'))
const SAQ = lazyPage(() => import('./pages/practice/SAQ'))
const Flashcards = lazyPage(() => import('./pages/practice/Flashcards'))
const SortIt = lazyPage(() => import('./pages/practice/SortIt'))
const TimelineOrder = lazyPage(() => import('./pages/practice/TimelineOrder'))
const ContinuityChange = lazyPage(() => import('./pages/practice/ContinuityChange'))

function LegacyCategory() {
  const { id } = useParams()
  return <Navigate to={`/learn/${id}`} replace />
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="learn" element={<LearnHub />} />
        <Route path="learn/neighbors" element={<Neighbors />} />
        <Route path="learn/timeline" element={<Timeline />} />
        <Route path="learn/:id" element={<Category />} />
        <Route path="connections" element={<Connections />} />
        <Route path="practice" element={<PracticeHub />} />
        <Route path="practice/mcq" element={<MCQ />} />
        <Route path="practice/saq" element={<SAQ />} />
        <Route path="practice/flashcards" element={<Flashcards />} />
        <Route path="practice/sort" element={<SortIt />} />
        <Route path="practice/order" element={<TimelineOrder />} />
        <Route path="practice/ccot" element={<ContinuityChange />} />
        <Route path="sources" element={<Sources />} />
        <Route path="search" element={<SearchPage />} />
        {/* links from earlier versions of the site */}
        <Route path="category/:id" element={<LegacyCategory />} />
        <Route path="timeline" element={<Navigate to="/learn/timeline" replace />} />
        <Route path="neighbors" element={<Navigate to="/learn/neighbors" replace />} />
        <Route path="quiz" element={<Navigate to="/practice/mcq" replace />} />
        <Route path="flashcards" element={<Navigate to="/practice/flashcards" replace />} />
        <Route path="bibliography" element={<Navigate to="/sources" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
