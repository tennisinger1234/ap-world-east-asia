import { useLocation } from 'react-router-dom'
import { categories } from '../lib/content'
import { useProgress } from '../lib/progress'
import { TabRow } from './ui'

export default function LearnTabs() {
  const { pathname } = useLocation()
  const { viewed } = useProgress()
  const tabs = [
    { to: '/learn', label: 'Overview', active: pathname === '/learn' },
    ...categories.map((c) => ({
      to: `/learn/${c.id}`,
      label: c.name,
      prefix: <span className="font-display font-bold text-seal">{c.letter}</span>,
      active: pathname === `/learn/${c.id}`,
      done: viewed.includes(c.id),
    })),
    { to: '/learn/neighbors', label: 'Japan · Korea · Vietnam', active: pathname === '/learn/neighbors' },
    { to: '/learn/timeline', label: 'Timeline', active: pathname === '/learn/timeline' },
  ]
  return <TabRow tabs={tabs} label="Learn sections" />
}
