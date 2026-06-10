import React, { useState } from 'react'
import { DAILY_VERSES, DEVOTIONALS } from '../data/bible'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default function Home({ study, onNavigate }) {
  const today = DAYS[new Date().getDay()]
  const devIdx = DEVOTIONALS.findIndex(d => d.date === today)
  const devotional = DEVOTIONALS[devIdx >= 0 ? devIdx : 0]
  const verseIdx = new Date().getDate() % DAILY_VERSES.length
  const verse = DAILY_VERSES[verseIdx]
  const [devTab, setDevTab] = useState('morning')

  return (
    <div style={{ padding: '0 0 90px', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div className="screen-header" style={{
        padding: '52px 24px 28px',
        background: 'linear-gradient(160deg, #F9EDE8 0%, #F5E8F0 100%)',
        borderBottom: '1px solid var(--border)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position:'absolute', top:'-20px', right:'-20px', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(181,86,106,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-40px', left:'10%', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(123,94,167,0.05)', pointerEvents:'none' }} />
        <p style={{ fontSize:'0.78rem', fontWeight:600, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'6px' }}>
          {new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}
        </p>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'2rem', fontWeight:600, color:'var(--text)', lineHeight:1.2 }}>
          Good morning,<br />beloved. 🌸
        </h1>
        {/* Streak */}
        {study.streak > 0 && (
          <div style={{ marginTop:'14px', display:'inline-flex', alignItems:'center', gap:'6px', padding:'6px 14px', borderRadius:'100px', background:'rgba(255,255,255,0.7)', border:'1px solid var(--border)' }}>
            <span>🔥</span>
            <span style={{ fontSize:'0.82rem', fontWeight:600, color:'var(--text)' }}>{study.streak}-day streak</span>
          </div>
        )}
      </div>

      <div style={{ padding:'24px' }}>
        {/* Verse of the day */}
        <div style={{
          borderRadius:'20px', padding:'24px',
          background:'linear-gradient(135deg, var(--rose) 0%, #9B3A5A 100%)',
          marginBottom:'20px', position:'relative', overflow:'hidden',
        }}>
          <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', borderRadius:'50%', background:'rgba(255,255,255,0.07)' }} />
          <p style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'rgba(255,255,255,0.7)', marginBottom:'14px' }}>
            ✦ VERSE OF THE DAY
          </p>
          <p style={{ fontFamily:'var(--font-serif)', fontSize:'1.25rem', fontStyle:'italic', color:'#FFF', lineHeight:1.65, marginBottom:'16px' }}>
            "{verse.text}"
          </p>
          <p style={{ fontSize:'0.82rem', fontWeight:600, color:'rgba(255,255,255,0.8)' }}>— {verse.ref}</p>
          <button
            onClick={() => onNavigate('bible')}
            style={{ marginTop:'16px', padding:'8px 18px', borderRadius:'100px', background:'rgba(255,255,255,0.15)', color:'#fff', fontSize:'0.8rem', fontWeight:500, cursor:'pointer', border:'1px solid rgba(255,255,255,0.25)' }}>
            Read more in Bible →
          </button>
        </div>

        {/* Today's devotional */}
        <div style={{ borderRadius:'20px', background:'var(--bg-card)', border:'1px solid var(--border)', overflow:'hidden', marginBottom:'20px' }}>
          <div style={{ padding:'20px 20px 0' }}>
            <p style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--purple)', marginBottom:'8px' }}>
              TODAY'S DEVOTIONAL
            </p>
            <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', fontWeight:600, color:'var(--text)', marginBottom:'4px' }}>
              {devotional.title}
            </h2>
            <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:'16px' }}>
              {devotional.verse} — {devotional.date}
            </p>
            {/* Tabs */}
            <div style={{ display:'flex', borderBottom:'1px solid var(--border)' }}>
              {['morning','evening'].map(t => (
                <button key={t} onClick={() => setDevTab(t)} style={{
                  flex:1, padding:'10px', fontSize:'0.82rem', fontWeight:devTab===t?600:400,
                  color: devTab===t ? 'var(--rose)' : 'var(--text-muted)',
                  borderBottom: devTab===t ? '2px solid var(--rose)' : '2px solid transparent',
                  textTransform:'capitalize', transition:'all 0.2s',
                }}>
                  {t === 'morning' ? '🌅 Morning' : '🌙 Evening'}
                </button>
              ))}
            </div>
          </div>
          <div style={{ padding:'20px' }}>
            <p style={{ fontFamily:'var(--font-serif)', fontSize:'0.95rem', fontStyle:'italic', color:'var(--rose)', marginBottom:'14px', lineHeight:1.6 }}>
              "{devotional.verseText}"
            </p>
            <p style={{ fontSize:'0.9rem', color:'var(--text)', lineHeight:1.8, whiteSpace:'pre-line' }}>
              {devTab === 'morning' ? devotional.morning : devotional.evening}
            </p>
          </div>
        </div>

        {/* Quick nav */}
        <p style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'12px' }}>
          QUICK ACCESS
        </p>
        <div className="grid-quick" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
          {[
            { icon:'📖', label:'Read Bible',     sub:'KJV · All 66 books',          screen:'bible',  color:'#B5566A' },
            { icon:'📋', label:'Reading Plans',  sub:'3 plans available',            screen:'plans',  color:'#7B5EA7' },
            { icon:'🔖', label:'My Library',     sub:`${study.bookmarks.length} saved`,screen:'library',color:'#C08B45' },
            { icon:'🎯', label:'Bible Quiz',     sub:'Test your knowledge',          screen:'quiz',   color:'#4A9B7A' },
          ].map(item => (
            <QuickCard key={item.screen} item={item} onClick={() => onNavigate(item.screen)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function QuickCard({ item, onClick }) {
  const [h, setH] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ padding:'18px', borderRadius:'16px', cursor:'pointer', transition:'all 0.2s',
        background: h ? 'var(--bg-elevated)' : 'var(--bg-card)',
        border:`1px solid ${h ? item.color+'40' : 'var(--border)'}`,
        transform: h ? 'translateY(-2px)' : 'none',
      }}>
      <div style={{ fontSize:'1.6rem', marginBottom:'8px' }}>{item.icon}</div>
      <div style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text)', marginBottom:'3px' }}>{item.label}</div>
      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{item.sub}</div>
    </div>
  )
}
