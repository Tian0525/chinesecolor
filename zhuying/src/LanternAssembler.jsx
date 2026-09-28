import { OUTLINES, BODY_COLORS, SURFACES, BASES, FILMS } from './data'
import Lantern from './Lantern'

function Group({ title, children }) {
  return (
    <div className="group">
      <h4 className="group__title">{title}</h4>
      <div className="group__row">{children}</div>
    </div>
  )
}

export default function LanternAssembler({ design, onChangeBody }) {
  const body = design.body
  const set = (key, val) => onChangeBody({ ...body, [key]: val })

  return (
    <div className="assembler">
      <div className="assembler__panel">
        <Group title="轮廓">
          {OUTLINES.map((o) => (
            <button key={o.id} className={`pick ${body.outline === o.id ? 'pick--on' : ''}`} onClick={() => set('outline', o.id)}>
              <span className="pick__name">{o.name}</span>
              <span className="pick__sub">{o.sub}</span>
            </button>
          ))}
        </Group>

        <Group title="颜色">
          {BODY_COLORS.map((c) => (
            <button key={c.id} className={`pick pick--color ${body.color === c.id ? 'pick--on' : ''}`} onClick={() => set('color', c.id)}>
              <span className="swatch-dot" style={{ background: c.hex }} />
              <span>{c.name}</span>
            </button>
          ))}
        </Group>

        <Group title="表面处理">
          {SURFACES.map((s) => (
            <button key={s.id} className={`pick ${body.surface === s.id ? 'pick--on' : ''}`} onClick={() => set('surface', s.id)}>
              {s.name}
            </button>
          ))}
        </Group>

        <Group title="底座">
          {BASES.map((b) => (
            <button key={b.id} className={`pick ${body.base === b.id ? 'pick--on' : ''}`} onClick={() => set('base', b.id)}>
              {b.name}
            </button>
          ))}
        </Group>

        <Group title="透光片">
          {FILMS.map((f) => (
            <button key={f.id} className={`pick ${body.film === f.id ? 'pick--on' : ''}`} onClick={() => set('film', f.id)}>
              {f.name}
            </button>
          ))}
        </Group>
      </div>

      <div className="assembler__preview">
        <div className="assembler__stage">
          <Lantern design={design} lit rotating />
        </div>
        <p className="assembler__tip">左右参数即点即换，灯身实时更新</p>
      </div>
    </div>
  )
}
