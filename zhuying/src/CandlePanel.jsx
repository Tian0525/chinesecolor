import { useEffect } from 'react'
import { SCENTS, FLAMES, SPEEDS } from './data'
import Lantern from './Lantern'
import * as sound from './sound'

function Group({ title, children }) {
  return (
    <div className="group">
      <h4 className="group__title">{title}</h4>
      <div className="group__row">{children}</div>
    </div>
  )
}

export default function CandlePanel({ design, onChangeCandle }) {
  const candle = design.candle
  const set = (key, val) => onChangeCandle({ ...candle, [key]: val })

  useEffect(() => () => sound.stopCrackle(), [])

  function toggleLight() {
    const lit = !candle.lit
    onChangeCandle({ ...candle, lit })
    if (lit) sound.playIgnite()
    else sound.stopCrackle()
  }

  return (
    <div className="candle">
      <div className="candle__panel">
        <Group title="香型">
          {SCENTS.map((s) => (
            <button key={s.id} className={`pick pick--scent ${candle.scent === s.id ? 'pick--on' : ''}`} onClick={() => set('scent', s.id)}>
              <span className="pick__name">{s.name}</span>
              <span className="pick__sub">{s.note}</span>
            </button>
          ))}
        </Group>

        <Group title="烛光颜色">
          {FLAMES.map((f) => (
            <button key={f.id} className={`pick pick--color ${candle.flame === f.id ? 'pick--on' : ''}`} onClick={() => set('flame', f.id)}>
              <span className="swatch-dot swatch-dot--flame" style={{ background: f.hex }} />
              <span>{f.name}</span>
            </button>
          ))}
        </Group>

        <Group title="旋转速度">
          {SPEEDS.map((s) => (
            <button key={s.id} className={`pick pick--speed ${candle.speed === s.id ? 'pick--on' : ''}`} onClick={() => set('speed', s.id)}>
              <span className="pick__name">{s.name} · {s.rpm}rpm</span>
              <span className="pick__sub">{s.hint}</span>
            </button>
          ))}
        </Group>

        <button className={`btn btn--primary btn--ignite ${candle.lit ? 'btn--lit' : ''}`} onClick={toggleLight}>
          {candle.lit ? '🕯 熄灭' : '🔥 点燃'}
        </button>
        <p className="candle__tip">
          {candle.lit ? '蜡烛已点亮，灯开始缓缓转动，可听到轻微的烛火噼啪' : '点燃蜡烛，看剪纸在光影里流动'}
        </p>
      </div>

      <div className="candle__preview">
        <div className="candle__stage">
          <Lantern design={design} lit={candle.lit} rotating />
        </div>
      </div>
    </div>
  )
}
