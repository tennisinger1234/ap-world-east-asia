// Lists practice questions that rely on an unverified development. Run: npm run verify-report
import { readFileSync } from 'node:fs'

const data = JSON.parse(readFileSync(new URL('../src/data/content.json', import.meta.url), 'utf8'))
const items = Object.fromEntries(data.items.map((i) => [i.id, i]))
const unverifiedIn = (ids) => [...new Set(ids)].filter((id) => items[id] && !items[id].verified)

const rows = []
const { mcq = [], saq = [], ccot = [] } = data.practice
for (const q of mcq) rows.push(['Multiple choice', q.id, q.question, unverifiedIn(q.itemIds)])
for (const q of saq) rows.push(['SAQ', q.id, q.title, unverifiedIn(q.parts.flatMap((p) => p.itemIds))])
for (const q of ccot) rows.push(['Continuity or change?', q.id, q.text, unverifiedIn(q.itemIds)])

const flagged = rows.filter((r) => r[3].length)
console.log(`| Mode | Question id | Question | Unverified development(s) |`)
console.log(`|---|---|---|---|`)
for (const [mode, id, text, ids] of flagged) console.log(`| ${mode} | \`${id}\` | ${text.replace(/\|/g, '\\|')} | ${ids.map((i) => `\`${i}\``).join(', ')} |`)
console.log(`\n${flagged.length} of ${rows.length} authored questions rely on an unverified development.`)
