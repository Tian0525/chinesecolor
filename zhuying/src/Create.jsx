import { useState } from 'react'
import PapercutEditor from './PapercutEditor'
import LanternAssembler from './LanternAssembler'
import CandlePanel from './CandlePanel'

const STEPS = [
  { key: 'cut', label: '剪纸', sub: '画 12 帧剪影' },
  { key: 'body', label: '灯身', sub: '拼装轮廓与颜色' },
  { key: 'candle', label: '蜡烛', sub: '选香型与转速' },
]

export default function Create({ design, setDesign, onDone, onBack }) {
  const [step, setStep] = useState(0)

  function next() {
    if (step < 2) setStep(step + 1)
    else onDone()
  }

  return (
    <div className="page create">
      <header className="stepper">
        <button className="btn btn--ghost btn--sm" onClick={onBack}>
          ← 返回
        </button>
        <div className="stepper__steps">
          {STEPS.map((s, i) => (
            <div key={s.key} className={`step ${i === step ? 'step--on' : ''} ${i < step ? 'step--done' : ''}`}>
              <span className="step__dot">{i + 1}</span>
              <span className="step__label">
                <b>{s.label}</b>
                <small>{s.sub}</small>
              </span>
            </div>
          ))}
        </div>
        <button className="btn btn--primary btn--sm" onClick={next}>
          {step < 2 ? '下一步 →' : '去预览 →'}
        </button>
      </header>

      <div className="create__body">
        {step === 0 && (
          <PapercutEditor
            frames={design.frames}
            onChange={(frames) => setDesign((d) => ({ ...d, frames }))}
          />
        )}
        {step === 1 && (
          <LanternAssembler
            design={design}
            onChangeBody={(body) => setDesign((d) => ({ ...d, body }))}
          />
        )}
        {step === 2 && (
          <CandlePanel
            design={design}
            onChangeCandle={(candle) => setDesign((d) => ({ ...d, candle }))}
          />
        )}
      </div>

      <footer className="create__foot">
        <button className="btn btn--ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          ← 上一步
        </button>
        <button className="btn btn--primary" onClick={next}>
          {step < 2 ? '下一步' : '去预览'}
        </button>
      </footer>
    </div>
  )
}
