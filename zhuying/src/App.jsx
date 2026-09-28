import { useEffect, useState } from 'react'
import { emptyDesign, randomDesign } from './data'
import * as sound from './sound'
import Home from './Home'
import Mode from './Mode'
import Create from './Create'
import Preview from './Preview'
import Gallery from './Gallery'
import About from './About'
import './App.css'

const DESIGN_KEY = 'zhuying:design'
const GALLERY_KEY = 'zhuying:gallery'

function loadJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key))
    return v ?? fallback
  } catch {
    return fallback
  }
}

export default function App() {
  const [view, setView] = useState('home')
  const [design, setDesign] = useState(() => loadJSON(DESIGN_KEY, emptyDesign()))
  const [userWorks, setUserWorks] = useState(() => loadJSON(GALLERY_KEY, []))
  const [source, setSource] = useState('自由创作')
  const [muted, setMuted] = useState(() => sound.loadMuted())

  useEffect(() => {
    try { localStorage.setItem(DESIGN_KEY, JSON.stringify(design)) } catch { /* 忽略 */ }
  }, [design])

  useEffect(() => {
    try { localStorage.setItem(GALLERY_KEY, JSON.stringify(userWorks)) } catch { /* 忽略 */ }
  }, [userWorks])

  function startFree() {
    setDesign(emptyDesign())
    setSource('自由创作')
    setView('create')
  }

  function startTemplate(t) {
    setDesign(t.build())
    setSource(t.name)
    setView('create')
  }

  function startRandom() {
    setDesign(randomDesign())
    setSource('自由创作')
    setView('create')
  }

  function submitToGallery() {
    const title = design.story.title.trim() || '一盏无名灯'
    const work = {
      id: 'u-' + Date.now(),
      title,
      author: '我',
      likes: 0,
      theme: source,
      createdAt: Date.now(),
      design,
    }
    setUserWorks((prev) => [work, ...prev])
    sound.playLike()
    setView('gallery')
  }

  function like(id) {
    setUserWorks((prev) => prev.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w)))
    sound.playLike()
  }

  function toggleMute() {
    const next = !muted
    setMuted(next)
    sound.setMuted(next)
  }

  return (
    <div className="app">
      {view !== 'home' && (
        <header className="topbar">
          <button className="topbar__brand" onClick={() => setView('home')}>
            逐影
          </button>
          <nav className="topbar__nav">
            <button onClick={() => setView('gallery')}>画廊</button>
            <button onClick={() => setView('about')}>关于</button>
            <button className="topbar__mute" onClick={toggleMute} aria-label={muted ? '开启音效' : '静音'}>
              {muted ? '🔇' : '🔊'}
            </button>
          </nav>
        </header>
      )}

      <main className="app__main">
        {view === 'home' && <Home onStart={() => setView('mode')} onGallery={() => setView('gallery')} onAbout={() => setView('about')} />}
        {view === 'mode' && (
          <Mode onFree={startFree} onTemplate={startTemplate} onRandom={startRandom} onBack={() => setView('home')} />
        )}
        {view === 'create' && (
          <Create design={design} setDesign={setDesign} onDone={() => setView('preview')} onBack={() => setView('mode')} />
        )}
        {view === 'preview' && (
          <Preview design={design} setDesign={setDesign} onSubmit={submitToGallery} onBack={() => setView('create')} />
        )}
        {view === 'gallery' && <Gallery userWorks={userWorks} onLike={like} onBack={() => setView('home')} />}
        {view === 'about' && <About onBack={() => setView('home')} />}
      </main>
    </div>
  )
}
