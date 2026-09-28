import { useState } from 'react'
import { scentById, speedById } from './data'
import Lantern from './Lantern'
import PosterCard from './PosterCard'

export default function Preview({ design, setDesign, onSubmit, onBack }) {
  const [posterOpen, setPosterOpen] = useState(false)
  const scent = scentById(design.candle.scent)
  const speed = speedById(design.candle.speed)

  return (
    <div className="page preview">
      <h2 className="page__title">预览 · 点燃你的灯</h2>
      <p className="page__sub">看剪纸在光影里流动</p>

      <div className="preview__stage">
        <div className="preview__lantern">
          <Lantern design={design} lit rotating />
        </div>
      </div>

      <div className="preview__info">
        <label className="preview__title-field">
          <span>故事名</span>
          <input
            value={design.story.title}
            onChange={(e) => setDesign((d) => ({ ...d, story: { ...d.story, title: e.target.value } }))}
            placeholder="为你的灯取个名字"
            maxLength={24}
          />
        </label>
        <div className="preview__meta">
          <span className="chip">🕯 {scent.name}</span>
          <span className="chip">🌀 {speed.name} · {speed.rpm}rpm</span>
        </div>
        <div className="preview__actions">
          <button className="btn btn--primary" onClick={() => setPosterOpen(true)}>
            生成卡片
          </button>
          <button className="btn btn--gold" onClick={onSubmit}>
            提交到画廊
          </button>
          <button className="btn btn--ghost" onClick={onBack}>
            返回修改
          </button>
        </div>
      </div>

      {posterOpen && (
        <PosterCard design={design} meta={{ title: design.story.title, author: '我' }} onClose={() => setPosterOpen(false)} />
      )}
    </div>
  )
}
