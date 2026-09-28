import { useMemo } from 'react'
import { TEMPLATES } from './data'
import Lantern from './Lantern'

export default function Home({ onStart, onGallery, onAbout }) {
  const hero = useMemo(() => {
    const t = TEMPLATES.find((x) => x.id === 'butterfly-dream') || TEMPLATES[0]
    return t.build()
  }, [])

  return (
    <div className="home">
      <div className="home__glow" aria-hidden="true" />
      <header className="home__top">
        <span className="home__brand">逐影</span>
        <nav className="home__nav">
          <button onClick={onGallery}>逐影画廊</button>
          <button onClick={onAbout}>关于逐影</button>
        </nav>
      </header>

      <div className="home__body">
        <div className="home__lantern">
          <Lantern design={hero} lit rotating />
        </div>
        <div className="home__copy">
          <span className="seal">逐影</span>
          <h1 className="home__title">逐影</h1>
          <p className="home__sub">把故事藏进灯里。</p>
          <p className="home__desc">
            画剪纸、拼灯身、点蜡烛，
            <br />
            亲手做一盏会旋转的走马灯，看故事在光影里流动。
          </p>
          <button className="btn btn--primary btn--start" onClick={onStart}>
            开始创作
          </button>
        </div>
      </div>

      <footer className="home__foot">中国民间美术 · 线上互动创作</footer>
    </div>
  )
}
