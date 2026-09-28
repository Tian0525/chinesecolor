import { useMemo, useState } from 'react'
import { GALLERY_SEED, TEMPLATES, SCENTS, BODY_COLORS, scentById, colorById, speedById } from './data'
import Lantern from './Lantern'

function Filter({ label, value, options, onChange }) {
  return (
    <label className="filter">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function Detail({ work, onClose, onLike }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="detail" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="detail__lantern">
          <Lantern design={work.design} lit rotating />
        </div>
        <div className="detail__info">
          <h3>{work.title}</h3>
          <p className="detail__meta">
            by {work.author} · {scentById(work.design.candle.scent).name} · {speedById(work.design.candle.speed).name}转速
          </p>
          <button className="btn btn--gold" onClick={onLike}>
            ♥ 点亮 · {work.likes}
          </button>
          <button className="btn btn--ghost" onClick={onClose}>
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Gallery({ userWorks, onLike, onBack }) {
  const [seedCache] = useState(() => GALLERY_SEED.map((w) => ({ ...w, design: w.build() })))
  const works = useMemo(() => [...seedCache, ...userWorks], [seedCache, userWorks])

  const [theme, setTheme] = useState('全部')
  const [scent, setScent] = useState('全部')
  const [color, setColor] = useState('全部')
  const [detail, setDetail] = useState(null)

  const filtered = works.filter((w) => {
    if (theme !== '全部' && w.theme !== theme) return false
    if (scent !== '全部' && scentById(w.design.candle.scent).name !== scent) return false
    if (color !== '全部' && colorById(w.design.body.color).name !== color) return false
    return true
  })

  const themeOpts = ['全部', ...TEMPLATES.map((t) => t.name), '自由创作']
  const scentOpts = ['全部', ...SCENTS.map((s) => s.name)]
  const colorOpts = ['全部', ...BODY_COLORS.map((c) => c.name)]

  return (
    <div className="page gallery">
      <header className="gallery__head">
        <button className="btn btn--ghost btn--sm" onClick={onBack}>
          ← 返回
        </button>
        <h2>逐影画廊</h2>
        <span className="gallery__count">{filtered.length} 盏灯</span>
      </header>

      <div className="filters">
        <Filter label="主题" value={theme} options={themeOpts} onChange={setTheme} />
        <Filter label="香型" value={scent} options={scentOpts} onChange={setScent} />
        <Filter label="颜色" value={color} options={colorOpts} onChange={setColor} />
      </div>

      <div className="gallery__grid">
        {filtered.map((w) => (
          <button key={w.id} className="gcard" onClick={() => setDetail(w)}>
            <Lantern design={w.design} lit className="gcard__lantern" />
            <span className="gcard__title">{w.title}</span>
            <span className="gcard__meta">by {w.author}</span>
            <span className="gcard__like">♥ {w.likes}</span>
          </button>
        ))}
        {filtered.length === 0 && <p className="empty">没有符合条件的灯</p>}
      </div>

      {detail && (
        <Detail
          work={detail}
          onClose={() => setDetail(null)}
          onLike={() => {
            onLike(detail.id)
            setDetail((d) => ({ ...d, likes: d.likes + 1 }))
          }}
        />
      )}
    </div>
  )
}
