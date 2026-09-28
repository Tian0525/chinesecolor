import { useMemo } from 'react'
import { TEMPLATES } from './data'
import Lantern from './Lantern'

export default function Mode({ onFree, onTemplate, onRandom, onBack }) {
  const previews = useMemo(() => TEMPLATES.map((t) => ({ t, design: t.build() })), [])

  return (
    <div className="page mode">
      <h2 className="page__title">开始创作</h2>
      <p className="page__sub">从空白开始，或借一盏灯做引子</p>

      <div className="mode__cards">
        <button className="modecard modecard--free" onClick={onFree}>
          <span className="modecard__glyph">✂</span>
          <b>自由创作</b>
          <small>从空白灯面开始，画你自己的剪纸</small>
        </button>
        <button className="modecard modecard--random" onClick={onRandom}>
          <span className="modecard__glyph">✦</span>
          <b>随机生成</b>
          <small>让灵感自己撞上门来</small>
        </button>
      </div>

      <h3 className="mode__tpl-title">模板灵感</h3>
      <div className="mode__tpls">
        {previews.map(({ t, design }) => (
          <button key={t.id} className="tpl" onClick={() => onTemplate(t)}>
            <Lantern design={design} lit className="tpl__lantern" />
            <b>{t.name}</b>
            <small>{t.desc}</small>
          </button>
        ))}
      </div>

      <button className="btn btn--ghost mode__back" onClick={onBack}>
        返回首页
      </button>
    </div>
  )
}
