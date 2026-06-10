import React, { useState } from 'react'
import { READING_PLANS } from '../data/bible'

export default function Plans({ study, onMarkDay }) {
  const [selected, setSelected] = useState(null)
  const [todayDone, setTodayDone] = useState({})

  if (selected) {
    const plan = READING_PLANS.find(p => p.id === selected)
    const prog = study.planProgress[selected] || { completedDays: [] }
    const completedDays = prog.completedDays || []
    const pct = Math.round((completedDays.length / plan.readings.length) * 100)

    return (
      <div style={{ minHeight:'100vh', background:'var(--bg)', paddingBottom:'90px', animation:'fadeIn 0.3s ease' }}>
        {/* Header */}
        <div className="screen-header" style={{ padding:'52px 20px 20px', background:'var(--bg-card)', borderBottom:'1px solid var(--border)' }}>
          <button onClick={() => setSelected(null)} style={{ display:'flex', alignItems:'center', gap:'6px', color:'var(--text-muted)', fontSize:'0.85rem', cursor:'pointer', marginBottom:'12px' }}>
            ← Back to plans
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'12px' }}>
            <div style={{ width:48, height:48, borderRadius:'14px', background:plan.colorDim, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>
              {plan.icon}
            </div>
            <div>
              <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', fontWeight:600, color:'var(--text)' }}>{plan.title}</h1>
              <p style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{plan.duration} · {completedDays.length}/{plan.readings.length} days done</p>
            </div>
          </div>
          <div style={{ height:6, borderRadius:'100px', background:'var(--border)' }}>
            <div style={{ height:'100%', borderRadius:'100px', background:plan.color, width:`${pct}%`, transition:'width 0.4s' }} />
          </div>
        </div>

        <div style={{ padding:'20px' }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {plan.readings.map((r, i) => {
              const day = i + 1
              const done = completedDays.includes(day)
              return (
                <div key={day} style={{
                  padding:'16px', borderRadius:'14px',
                  background: done ? plan.colorDim : 'var(--bg-card)',
                  border:`1px solid ${done ? plan.color + '30' : 'var(--border)'}`,
                  display:'flex', alignItems:'center', gap:'12px',
                  opacity: done ? 0.8 : 1,
                }}>
                  <div style={{
                    width:36, height:36, borderRadius:'50%', flexShrink:0,
                    background: done ? plan.color : 'var(--bg-elevated)',
                    border:`2px solid ${done ? plan.color : 'var(--border)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize: done ? '1rem' : '0.8rem', fontWeight:600,
                    color: done ? '#fff' : 'var(--text-muted)',
                  }}>
                    {done ? '✓' : day}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:'0.88rem', color:'var(--text)', marginBottom:'2px' }}>Day {day}</div>
                    <div style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{r.ot ? `${r.ot} · ${r.nt}` : r.text}</div>
                  </div>
                  {!done && (
                    <button onClick={() => onMarkDay(plan.id, day)} style={{
                      padding:'7px 14px', borderRadius:'100px',
                      background:plan.color, color:'#fff',
                      fontSize:'0.78rem', fontWeight:600, cursor:'pointer',
                      border:'none', fontFamily:'var(--font-sans)',
                    }}>Done ✓</button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen-header" style={{ padding:'52px 20px 90px', animation:'fadeIn 0.3s ease' }}>
      <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'1.8rem', fontWeight:600, color:'var(--text)', marginBottom:'4px' }}>Reading Plans</h1>
      <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', marginBottom:'24px' }}>Structured paths through scripture</p>

      <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
        {READING_PLANS.map(plan => {
          const prog = study.planProgress[plan.id] || { completedDays: [] }
          const done = (prog.completedDays || []).length
          const pct = Math.round((done / plan.readings.length) * 100)
          return (
            <div key={plan.id} onClick={() => setSelected(plan.id)} style={{
              padding:'20px', borderRadius:'20px', cursor:'pointer',
              background:'var(--bg-card)', border:'1px solid var(--border)',
              transition:'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = plan.color + '50'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ display:'flex', alignItems:'flex-start', gap:'14px' }}>
                <div style={{ width:52, height:52, borderRadius:'16px', background:plan.colorDim, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0, border:`1px solid ${plan.color}30` }}>
                  {plan.icon}
                </div>
                <div style={{ flex:1 }}>
                  <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'1.15rem', fontWeight:600, color:'var(--text)', marginBottom:'4px' }}>{plan.title}</h2>
                  <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'12px', lineHeight:1.5 }}>{plan.desc}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                    <div style={{ flex:1, height:4, borderRadius:'100px', background:'var(--border)' }}>
                      <div style={{ height:'100%', borderRadius:'100px', background:plan.color, width:`${pct}%`, transition:'width 0.4s' }} />
                    </div>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-muted)', whiteSpace:'nowrap' }}>{done}/{plan.readings.length} days</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
