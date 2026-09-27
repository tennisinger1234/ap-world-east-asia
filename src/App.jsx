import { lazy } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'

// Pages load on demand; the mascot loading screen shows meanwhile (see Layout's Suspense).
const LearnHub = lazy(() => import('./pages/LearnHub'))
const Category = lazy(() => import('./pages/Category'))
const Neighbors = lazy(() => import('./pages/Neighbors'))
const Timeline = lazy(() => import('./pages/Timeline'))
const Connections = lazy(() => import('./pages/Connections'))
const Sources = lazy(() => import('./pages/Sources'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PracticeHub = lazy(() => import('./pages/practice/PracticeHub'))
const MCQ = lazy(() => import('./pages/practice/MCQ'))
const SAQ = lazy(() => import('./pages/practice/SAQ'))
const Flashcards = lazy(() => import('./pages/practice/Flashcards'))
const SortIt = lazy(() => import('./pages/practice/SortIt'))
const TimelineOrder = lazy(() => import('./pages/practice/TimelineOrder'))
const ContinuityChange = lazy(() => import('./pages/practice/ContinuityChange'))

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
