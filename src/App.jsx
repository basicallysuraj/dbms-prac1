import React, { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  Clipboard,
  Code2,
  Copy,
  Database,
  ExternalLink,
  FileText,
  Home,
  Menu,
  Moon,
  Printer,
  Search,
  Sun,
  X,
} from 'lucide-react'

const PASSWORD_HASH = '83f010e7a778dfcf793864a424ba4efa9e9bf0b290a2e9bde9da798c474eb8dc'

const keywordSet = new Set([
  'select', 'from', 'where', 'create', 'table', 'alter', 'add', 'modify', 'drop', 'column', 'rename', 'to',
  'insert', 'into', 'values', 'update', 'set', 'delete', 'commit', 'rollback', 'grant', 'revoke', 'on', 'as',
  'primary', 'key', 'foreign', 'references', 'not', 'null', 'inner', 'left', 'right', 'full', 'outer', 'join',
  'group', 'by', 'order', 'having', 'and', 'or', 'from', 'number', 'varchar2', 'constraint', 'identified', 'user',
])

function highlightSQL(code) {
  const tokenPattern = /(--[^\n]*|'(?:''|[^'])*'|\b\d+(?:\.\d+)?\b|\b[A-Z_][A-Z0-9_]*\b)/gi
  let lastIndex = 0
  const tokens = []
  let match
  while ((match = tokenPattern.exec(code)) !== null) {
    tokens.push(escapeHtml(code.slice(lastIndex, match.index)))
    const token = match[0]
    const lower = token.toLowerCase()
    const className = token.startsWith('--')
      ? 'sql-comment'
      : token.startsWith("'")
        ? 'sql-string'
        : /^\d/.test(token)
          ? 'sql-number'
          : keywordSet.has(lower)
            ? 'sql-keyword'
            : 'sql-function'
    tokens.push(`<span class="${className}">${escapeHtml(token)}</span>`)
    lastIndex = match.index + token.length
  }
  tokens.push(escapeHtml(code.slice(lastIndex)))
  return tokens.join('')
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

async function matchesAccessPassword(value) {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
  return hash === PASSWORD_HASH
}

function App() {
  const [unlocked, setUnlocked] = useState(false)
  const [practicals, setPracticals] = useState(null)

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const unlock = async (password) => {
    const valid = await matchesAccessPassword(password)
    if (valid) {
      const module = await import('./data/practicals.js')
      setPracticals(module.practicals)
      setUnlocked(true)
    }
    return valid
  }

  if (!unlocked) return <PasswordGate unlock={unlock} />
  if (!practicals) return <LoadingScreen />
  return <Dashboard practicals={practicals} />
}

function PasswordGate({ unlock }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    if (!password) {
      setError('Enter the access password to continue.')
      return
    }
    setChecking(true)
    setError('')
    const valid = await unlock(password)
    if (!valid) {
      setError('Incorrect password. The practical content remains locked.')
      setPassword('')
    }
    setChecking(false)
  }

  return <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#10101a] px-5 py-10 text-white">
    <div className="pointer-events-none fixed -left-24 -top-24 h-72 w-72 rounded-full border-[30px] border-violet-500/10" />
    <div className="pointer-events-none fixed -bottom-32 -right-20 h-80 w-80 rounded-full border-[30px] border-violet-500/10" />
    <section className="relative w-full max-w-md rounded-[28px] border border-white/10 bg-[#171725] p-7 shadow-2xl shadow-black/30 sm:p-10">
      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-950/60"><Database size={27} /></div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Private study resource</p>
      <h1 className="text-3xl font-black tracking-tight">DBMS Practical<br />Solutions</h1>
      <p className="mt-4 text-sm leading-6 text-slate-400">Enter the access password to open the Oracle 10g practical guide.</p>
      <form onSubmit={submit} className="mt-8">
        <label htmlFor="access-password" className="mb-2 block text-sm font-bold text-slate-200">Access password</label>
        <input id="access-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus autoComplete="off" className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-slate-500 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20" placeholder="Enter password" />
        {error && <p role="alert" className="mt-3 text-sm font-semibold text-rose-300">{error}</p>}
        <button type="submit" disabled={checking} className="mt-5 flex h-12 w-full items-center justify-center rounded-xl bg-violet-600 text-sm font-extrabold text-white transition hover:bg-violet-500 disabled:cursor-wait disabled:opacity-60">{checking ? 'Verifying…' : 'Unlock practicals'}</button>
      </form>
      <p className="mt-6 text-center text-xs text-slate-500">Protected Oracle 10g examination material</p>
    </section>
  </main>
}

function LoadingScreen() {
  return <main className="flex min-h-screen items-center justify-center bg-[#10101a] text-sm font-semibold text-slate-300">Loading protected practicals…</main>
}

function Dashboard({ practicals }) {
  const [selectedId, setSelectedId] = useState(null)
  const [query, setQuery] = useState('')
  const [completed, setCompleted] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dbms-completed') || '[]')
    } catch {
      return []
    }
  })
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('dbms-theme') !== 'light')
  const [mobileNav, setMobileNav] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('dbms-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('dbms-completed', JSON.stringify(completed))
  }, [completed])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const selected = selectedId ? practicals.find((practical) => practical.id === Number(selectedId)) : null
  const searchMatches = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return []
    return practicals.filter((practical) => {
      const searchable = [
        practical.id,
        practical.title,
        practical.question,
        practical.aim,
        practical.dependency,
        practical.explanation.join(' '),
        practical.sections.map((section) => section.code).join(' '),
      ].join(' ').toLowerCase()
      return searchable.includes(normalized)
    }).slice(0, 7)
  }, [query])

  const openPractical = (id) => {
    setSelectedId(Number(id))
    setQuery('')
    setMobileNav(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goHome = () => {
    setSelectedId(null)
    setQuery('')
    setMobileNav(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toggleComplete = (id) => {
    setCompleted((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }

  const progress = Math.round((completed.length / practicals.length) * 100)
  const currentIndex = selected ? practicals.findIndex((item) => item.id === selected.id) : -1

  return (
    <div className="min-h-screen bg-[#fafaff] text-slate-800 transition-colors dark:bg-[#10101a] dark:text-slate-100">
      <Header
        query={query}
        setQuery={setQuery}
        searchMatches={searchMatches}
        openPractical={openPractical}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openMenu={() => setMobileNav(true)}
        goHome={goHome}
      />
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar
          practicals={practicals}
          selectedId={selectedId}
          openPractical={openPractical}
          goHome={goHome}
          completed={completed}
          progress={progress}
          mobileNav={mobileNav}
          closeMenu={() => setMobileNav(false)}
        />
        <main className="min-w-0 flex-1 px-4 pb-16 pt-7 sm:px-7 lg:px-10 lg:pt-10">
          {selected ? (
            <PracticalDetail
              practical={selected}
              completed={completed}
              toggleComplete={toggleComplete}
              previous={currentIndex > 0 ? practicals[currentIndex - 1] : null}
              next={currentIndex < practicals.length - 1 ? practicals[currentIndex + 1] : null}
              openPractical={openPractical}
              goHome={goHome}
            />
          ) : (
            <HomePage
              practicals={practicals}
              completed={completed}
              progress={progress}
              openPractical={openPractical}
              query={query}
            />
          )}
        </main>
      </div>
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg shadow-violet-300/40 transition hover:-translate-y-1 hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 dark:shadow-violet-950/50 dark:focus:ring-violet-900"
          aria-label="Back to top"
        >
          <ChevronDown className="rotate-180" size={20} />
        </button>
      )}
    </div>
  )
}

function Header({ query, setQuery, searchMatches, openPractical, darkMode, setDarkMode, openMenu, goHome }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#11111c]/90">
      <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-3 px-4 sm:px-7 lg:px-10">
        <button type="button" onClick={openMenu} className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-white/10" aria-label="Open practical navigation">
          <Menu size={22} />
        </button>
        <button type="button" onClick={goHome} className="hidden items-center gap-3 text-left sm:flex" aria-label="Go to home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-200 dark:shadow-violet-950/60"><Database size={21} /></span>
          <span className="hidden leading-tight md:block"><strong className="block text-[15px] font-extrabold tracking-tight text-slate-900 dark:text-white">DBMS Practical</strong><span className="text-xs text-slate-500 dark:text-slate-400">Solutions</span></span>
        </button>
        <div className="relative ml-auto w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search practicals, SQL, commands..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-violet-500 dark:focus:bg-white/10 dark:focus:ring-violet-900/30"
            aria-label="Search practicals"
          />
          {query && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-[#1a1928] dark:shadow-black/30">
              {searchMatches.length ? searchMatches.map((practical) => (
                <button key={practical.id} type="button" onClick={() => openPractical(practical.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-violet-50 dark:hover:bg-violet-500/10">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-500/20 dark:text-violet-300">{String(practical.id).padStart(2, '0')}</span>
                  <span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{practical.title}</span><span className="block truncate text-xs text-slate-500 dark:text-slate-400">{practical.question}</span></span>
                </button>
              )) : <p className="px-3 py-4 text-center text-sm text-slate-500">No practicals found for “{query}”.</p>}
            </div>
          )}
        </div>
        <button type="button" onClick={() => setDarkMode(!darkMode)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-white/10 dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-300" aria-label={darkMode ? 'Use light theme' : 'Use dark theme'}>
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button type="button" onClick={() => window.print()} className="hidden h-11 items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 xl:flex dark:border-white/10 dark:text-slate-300 dark:hover:bg-violet-500/10 dark:hover:text-violet-300" aria-label="Print current page">
          <Printer size={17} /> Print
        </button>
      </div>
    </header>
  )
}

function Sidebar({ practicals, selectedId, openPractical, goHome, completed, progress, mobileNav, closeMenu }) {
  return (
    <>
      {mobileNav && <button type="button" className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={closeMenu} aria-label="Close navigation" />}
      <aside className={`fixed bottom-0 left-0 top-[72px] z-50 flex w-[285px] shrink-0 flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform duration-300 lg:sticky lg:top-[72px] lg:z-20 lg:h-[calc(100vh-72px)] lg:translate-x-0 dark:border-white/10 dark:bg-[#151522] ${mobileNav ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-5 flex items-center justify-between px-2 lg:hidden">
          <span className="text-sm font-bold text-slate-900 dark:text-white">Practical navigation</span>
          <button type="button" onClick={closeMenu} className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white/10" aria-label="Close navigation"><X size={19} /></button>
        </div>
        <button type="button" onClick={goHome} className={`mb-5 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${selectedId === null ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5'}`}>
          <Home size={18} /> Overview
        </button>
        <div className="mb-3 flex items-center justify-between px-3"><span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Practicals</span><span className="text-xs font-semibold text-slate-400">{completed.length}/13</span></div>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto pr-1" aria-label="Practical list">
          {practicals.map((practical) => {
            const isSelected = selectedId === practical.id
            const isDone = completed.includes(practical.id)
            return <button key={practical.id} type="button" onClick={() => openPractical(practical.id)} className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${isSelected ? 'bg-violet-600 text-white shadow-md shadow-violet-200 dark:shadow-violet-950/50' : 'text-slate-600 hover:bg-violet-50 dark:text-slate-300 dark:hover:bg-white/5'}`}>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-extrabold ${isSelected ? 'bg-white/20 text-white' : isDone ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-400'}`}>{isDone && !isSelected ? <Check size={14} strokeWidth={3} /> : String(practical.id).padStart(2, '0')}</span>
              <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{practical.shortTitle}</span>
              {isSelected && <ChevronDown className="-rotate-90 opacity-70" size={16} />}
            </button>
          })}
        </nav>
        <div className="mt-5 rounded-2xl bg-slate-50 p-4 dark:bg-white/5">
          <div className="mb-2 flex items-center justify-between"><span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Your progress</span><span className="text-xs font-bold text-violet-600 dark:text-violet-300">{progress}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full rounded-full bg-violet-600 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">Mark a practical complete as you revise it.</p>
        </div>
      </aside>
    </>
  )
}

function HomePage({ practicals, completed, progress, openPractical, query }) {
  const visiblePracticals = query.trim() ? practicals.filter((practical) => {
    const text = [practical.id, practical.title, practical.question, practical.sections.map((section) => section.code)].join(' ').toLowerCase()
    return text.includes(query.trim().toLowerCase())
  }) : practicals

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative overflow-hidden rounded-[28px] bg-violet-600 px-6 py-8 text-white shadow-xl shadow-violet-200/60 sm:px-10 sm:py-11 lg:px-12 lg:py-14 dark:shadow-violet-950/30">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide text-violet-50"><BookOpen size={14} /> EXAM READY RESOURCE</div>
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">DBMS Practical<br className="hidden sm:block" /> Solutions</h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-violet-100 sm:text-lg">Your complete, focused guide to Oracle 10g database practicals — from DDL basics to advanced joins.</p>
          <div className="mt-8 flex flex-wrap items-center gap-3"><div className="rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-violet-700">13 Practicals</div><div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white">Oracle 10g</div><div className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-bold text-white">SQL Reference</div></div>
        </div>
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[32px] border-white/10" /><div className="pointer-events-none absolute -bottom-36 right-24 h-72 w-72 rounded-full border-[28px] border-white/10" />
        <Database className="absolute bottom-9 right-10 hidden text-white/10 sm:block" size={145} strokeWidth={1} />
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={<FileText size={19} />} label="Total practicals" value="13" detail="Complete question bank" />
        <StatCard icon={<Code2 size={19} />} label="Technology" value="Oracle 10g" detail="Compatible SQL syntax" />
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#171725]"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Revision progress</p><p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{completed.length}<span className="text-base font-semibold text-slate-400"> / 13</span></p></div><span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"><CheckCircle2 size={19} /></span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div><p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{progress}% of your guide reviewed</p></div>
      </section>

      <div className="mb-5 mt-12 flex items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">The complete syllabus</p><h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">Choose a practical</h2></div><span className="hidden text-sm text-slate-500 sm:block">{visiblePracticals.length} of 13 shown</span></div>
      {visiblePracticals.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visiblePracticals.map((practical) => <PracticalCard key={practical.id} practical={practical} done={completed.includes(practical.id)} openPractical={openPractical} />)}</div> : <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-white/20"><Search className="mx-auto text-slate-400" /><p className="mt-3 font-semibold text-slate-600 dark:text-slate-300">No practicals match “{query}”.</p></div>}
      <footer className="mt-14 flex flex-col gap-3 border-t border-slate-200 py-7 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:text-slate-400"><span>Built for focused DBMS practical preparation.</span><span className="flex items-center gap-1.5"><Database size={15} className="text-violet-500" /> Oracle 10g reference guide</span></footer>
    </div>
  )
}

function StatCard({ icon, label, value, detail }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#171725]"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p><p className="mt-1 text-2xl font-black text-slate-900 dark:text-white">{value}</p></div><span className="rounded-xl bg-violet-50 p-2.5 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">{icon}</span></div><p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{detail}</p></div>
}

function PracticalCard({ practical, done, openPractical }) {
  return <button type="button" onClick={() => openPractical(practical.id)} className="group relative flex min-h-[190px] flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-100/70 dark:border-white/10 dark:bg-[#171725] dark:hover:border-violet-500/50 dark:hover:shadow-violet-950/20">
    <div className="flex items-start justify-between"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-sm font-black text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">{String(practical.id).padStart(2, '0')}</span>{done ? <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><Check size={13} /> Done</span> : <ArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500" size={20} />}</div>
    <h3 className="mt-6 text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">{practical.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-500 dark:text-slate-400">{practical.question}</p><div className="mt-auto flex items-center gap-1.5 pt-5 text-xs font-bold text-violet-600 dark:text-violet-300">Open practical <ArrowRight size={14} className="transition group-hover:translate-x-1" /></div>
  </button>
}

function PracticalDetail({ practical, completed, toggleComplete, previous, next, openPractical, goHome }) {
  const isDone = completed.includes(practical.id)
  const stageMeta = {
    setup: { number: '02', title: 'Create Tables / Database Setup' },
    insert: { number: '03', title: 'Insert Sample Data' },
    verify: { number: '04', title: 'Verify Tables and Records' },
    operation: { number: '05', title: 'Execute Practical Operation' },
    cleanup: { number: '—', title: 'Optional Cleanup / Restart' },
  }
  const stageOrder = ['setup', 'insert', 'verify', 'operation', 'cleanup']
  const groupedSections = stageOrder.map((stage) => ({ stage, ...stageMeta[stage], sections: practical.sections.filter((section) => section.stage === stage) })).filter((group) => group.sections.length)

  return <article className="mx-auto max-w-5xl">
    <div className="mb-7 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><button type="button" onClick={goHome} className="font-semibold transition hover:text-violet-600">Overview</button><ChevronDown className="-rotate-90" size={15} /><span>Practical {practical.id}</span></div>
    <header className="mb-8"><div className="flex flex-wrap items-start justify-between gap-5"><div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-lg font-black text-white shadow-lg shadow-violet-200 dark:shadow-violet-950/40">{String(practical.id).padStart(2, '0')}</span><div><p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-violet-600 dark:text-violet-300">Practical {practical.id} of 13</p><h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">{practical.title}</h1></div></div><button type="button" onClick={() => toggleComplete(practical.id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-4 ${isDone ? 'bg-emerald-100 text-emerald-700 focus:ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-300 dark:focus:ring-emerald-900' : 'border border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:text-violet-600 focus:ring-violet-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-violet-500 dark:hover:text-violet-300 dark:focus:ring-violet-900/30'}`}>{isDone ? <CheckCircle2 size={17} /> : <Check size={17} />}{isDone ? 'Completed' : 'Mark complete'}</button></div></header>

    <div className="space-y-8">
      <section><SectionHeading number="01" title="Original Question" /><div className="rounded-2xl border-l-4 border-violet-500 bg-violet-50 px-5 py-5 dark:bg-violet-500/10"><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-violet-700 dark:text-violet-300"><FileText size={15} /> Question from the practical sheet</div><p className="text-base font-semibold leading-7 text-slate-800 dark:text-slate-100">{practical.question}</p></div></section>
      <section><SectionHeading number="01A" title="Aim & Software" /><div className="grid gap-4 sm:grid-cols-2"><InfoCard label="Aim" icon={<BookOpen size={17} />} text={practical.aim} /><InfoCard label="Software required" icon={<Database size={17} />} text="Oracle 10g" /><InfoCard label="Execution sequence" icon={<ExternalLink size={17} />} text={practical.dependency} wide /></div></section>
      <section><SectionHeading number="02–05" title="Complete executable SQL sequence" /><div className="space-y-8">{groupedSections.map((group) => <div key={group.stage}><div className="mb-4 flex items-center gap-3"><span className={`text-xs font-black tracking-wider ${group.stage === 'cleanup' ? 'text-amber-500' : 'text-violet-500'}`}>{group.number}</span><h3 className={`text-lg font-black tracking-tight ${group.stage === 'cleanup' ? 'text-amber-600 dark:text-amber-300' : 'text-slate-900 dark:text-white'}`}>{group.title}</h3><div className="h-px flex-1 bg-slate-200 dark:bg-white/10" /></div><div className="space-y-5">{group.sections.map((section, index) => <CodeBlock key={`${section.heading}-${index}`} section={section} practicalId={practical.id} index={index} />)}</div></div>)}</div></section>
      <section><SectionHeading number="06" title="Expected Output" /><div className="space-y-4">{practical.output.map((output, index) => <OutputBlock key={`${output.label}-${index}`} output={output} />)}</div></section>
      <section><SectionHeading number="07" title="Explanation" /><div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#171725]"><ul className="space-y-4">{practical.explanation.map((item, index) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"><span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">{index + 1}</span><span>{item}</span></li>)}</ul></div></section>
      <section><SectionHeading number="08" title="Result / Conclusion" /><div className="flex gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-500/20 dark:bg-emerald-500/10"><CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-300" size={20} /><p className="text-sm font-semibold leading-6 text-emerald-800 dark:text-emerald-200">{practical.result}</p></div></section>
    </div>
    <div className="mt-12 flex items-center justify-between gap-3 border-t border-slate-200 pt-6 dark:border-white/10"><div>{previous && <button type="button" onClick={() => openPractical(previous.id)} className="group flex items-center gap-2 rounded-xl px-2 py-2 text-left text-sm text-slate-500 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"><ArrowLeft size={17} className="transition group-hover:-translate-x-1" /><span><small className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Previous</small><strong className="block max-w-[130px] truncate text-slate-700 dark:text-slate-200">{previous.title}</strong></span></button>}</div><div className="text-center text-xs font-semibold text-slate-400">{practical.id} / 13</div><div>{next && <button type="button" onClick={() => openPractical(next.id)} className="group flex items-center gap-2 rounded-xl px-2 py-2 text-right text-sm text-slate-500 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"><span><small className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Next</small><strong className="block max-w-[130px] truncate text-slate-700 dark:text-slate-200">{next.title}</strong></span><ArrowRight size={17} className="transition group-hover:translate-x-1" /></button>}</div></div>
  </article>
}

function InfoCard({ label, icon, text, wide }) {
  return <div className={`rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-[#171725] ${wide ? 'sm:col-span-2' : ''}`}><div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-slate-400"><span className="text-violet-500">{icon}</span>{label}</div><p className="text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{text}</p></div>
}

function SectionHeading({ number, title }) {
  return <div className="mb-4 flex items-center gap-3"><span className="text-xs font-black tracking-wider text-violet-500">{number}</span><h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{title}</h2><div className="h-px flex-1 bg-slate-200 dark:bg-white/10" /></div>
}

function CodeBlock({ section, practicalId, index }) {
  const [copied, setCopied] = useState(false)
  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(section.code)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = section.code
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }
  return <div className="overflow-hidden rounded-2xl border border-slate-700/70 bg-[#151522] shadow-xl shadow-slate-200/30 dark:shadow-black/20"><div className="flex items-center justify-between border-b border-white/10 bg-[#1d1d2c] px-4 py-3"><div className="flex min-w-0 items-center gap-3"><span className="flex gap-1.5"><i className="h-2.5 w-2.5 rounded-full bg-rose-400" /><i className="h-2.5 w-2.5 rounded-full bg-amber-400" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-400" /></span><span className="truncate text-xs font-bold text-slate-300">{section.heading}</span><span className="hidden rounded-md bg-violet-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-300 sm:inline">Oracle 10g · SQL</span></div><button type="button" onClick={copyCode} className="ml-3 flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-bold text-slate-300 transition hover:border-violet-400/50 hover:bg-violet-500/10 hover:text-white" aria-label={`Copy SQL for practical ${practicalId}`}><span>{copied ? <Check size={14} /> : <Copy size={14} />}</span>{copied ? 'Copied' : 'Copy code'}</button></div><div className="overflow-x-auto p-4 sm:p-5"><pre className="min-w-max text-[13px] leading-6 text-slate-300"><code dangerouslySetInnerHTML={{ __html: highlightSQL(section.code) }} /></pre></div></div>
}

function OutputBlock({ output }) {
  return <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-white/10 dark:bg-[#171725]"><div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-white/10"><Clipboard size={16} className="text-violet-500" /><h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{output.label}</h3></div>{output.value ? <p className="px-4 py-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{output.value}</p> : <div className="overflow-x-auto"><table className="w-full min-w-max text-left text-sm"><thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 dark:bg-white/5 dark:text-slate-400"><tr>{output.columns.map((column) => <th key={column} className="px-4 py-3 font-bold">{column}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 dark:divide-white/10">{output.rows.map((row, rowIndex) => <tr key={`${output.label}-${rowIndex}`} className="text-slate-600 dark:text-slate-300">{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`} className={`whitespace-nowrap px-4 py-3 ${cell === 'NULL' ? 'italic text-slate-400' : ''}`}>{cell}</td>)}</tr>)}</tbody></table></div>}</div>
}

export default App
