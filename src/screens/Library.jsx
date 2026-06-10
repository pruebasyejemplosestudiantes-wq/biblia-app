import React, { useState } from 'react'

export default function Library({ study, onDeleteNote, onToggleBookmark }) {
  const [tab, setTab] = useState('bookmarks')

  return (
    <div style={{ padding:'52px 0 90px', animation:'fadeIn 0.3s ease' }}>
      <div style={{ padding:'0 20px 16px' }}>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'1.8rem', fontWeight:600, color:'var(--text)', marginBottom:'4px' }}>My Library</h1>
        <p style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Your saved verses, highlights & notes</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'1px solid var(--border)', padding:'0 20px' }}>
        {[
          { id:'bookmarks',  label:'🔖 Saved',      count: study.bookmarks.length },
          { id:'highlights', label:'✏️ Highlights',  count: study.highlights.length },
          { id:'notes',      label:'📝 Notes',       count: study.notes.length },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, padding:'12px 4px', fontSize:'0.82rem', fontWeight:tab===t.id?600:400,
            color: tab===t.id ? 'var(--rose)' : 'var(--text-muted)',
            borderBottom: tab===t.id ? '2px solid var(--rose)' : '2px solid transparent',
            transition:'all 0.2s',
          }}>
            {t.label} {t.count > 0 && <span style={{ marginLeft:4, padding:'1px 6px', borderRadius:'100px', background:tab===t.id?'var(--rose-dim)':'var(--bg-elevated)', fontSize:'0.7rem', color:tab===t.id?'var(--rose)':'var(--text-muted)' }}>{t.count}</span>}
          </button>
        ))}
      </div>

      <div style={{ padding:'20px' }}>
        {tab === 'bookmarks' && (
          study.bookmarks.length === 0
            ? <EmptyState icon='🔖' text='No saved verses yet. Tap any verse while reading to bookmark it.' />
            : <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {study.bookmarks.map(b => (
                  <VerseItem key={b.ref} item={b} onDelete={() => onToggleBookmark(b)} deleteLabel='Remove' color='var(--rose)' />
                ))}
              </div>
        )}
        {tab === 'highlights' && (
          study.highlights.length === 0
            ? <EmptyState icon='✏️' text='No highlights yet. Tap any verse while reading to highlight it.' />
            : <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                {study.highlights.map(h => (
                  <VerseItem key={h.ref} item={h} highlight={h.color} />
                ))}
              </div>
        )}
        {tab === 'notes' && (
          study.notes.length === 0
            ? <EmptyState icon='📝' text='No notes yet. Tap any verse while reading and add a personal note.' />
            : <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                {study.notes.map(n => (
                  <div key={n.ref} style={{ padding:'16px', borderRadius:'16px', background:'var(--bg-card)', border:'1px solid var(--border)' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                      <span style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--purple)' }}>{n.ref}</span>
                      <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                        <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{n.date}</span>
                        <button onClick={() => onDeleteNote(n.ref)} style={{ fontSize:'0.75rem', color:'var(--text-muted)', cursor:'pointer', padding:'2px 8px', borderRadius:'100px', border:'1px solid var(--border)', background:'none' }}>Delete</button>
                      </div>
                    </div>
                    <p style={{ fontFamily:'var(--font-serif)', fontSize:'0.9rem', fontStyle:'italic', color:'var(--text-muted)', marginBottom:'10px', lineHeight:1.6 }}>"{n.text?.trim()}"</p>
                    <p style={{ fontSize:'0.88rem', color:'var(--text)', lineHeight:1.65 }}>{n.note}</p>
                  </div>
                ))}
              </div>
        )}
      </div>
    </div>
  )
}

function VerseItem({ item, onDelete, deleteLabel, color, highlight }) {
  return (
    <div style={{ padding:'16px', borderRadius:'16px', background:'var(--bg-card)', border:'1px solid var(--border)', borderLeft: highlight ? `4px solid ${highlight}` : '1px solid var(--border)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
        <span style={{ fontSize:'0.78rem', fontWeight:700, color: color || 'var(--gold)' }}>{item.ref}</span>
        {onDelete && (
          <button onClick={onDelete} style={{ fontSize:'0.75rem', color:'var(--text-muted)', cursor:'pointer', padding:'2px 8px', borderRadius:'100px', border:'1px solid var(--border)', background:'none' }}>{deleteLabel}</button>
        )}
      </div>
      <p style={{ fontFamily:'var(--font-serif)', fontSize:'0.95rem', lineHeight:1.7, color:'var(--text)' }}>{item.text?.trim()}</p>
    </div>
  )
}

function EmptyState({ icon, text }) {
  return (
    <div style={{ textAlign:'center', padding:'60px 20px' }}>
      <div style={{ fontSize:'2.5rem', marginBottom:'16px' }}>{icon}</div>
      <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', lineHeight:1.6 }}>{text}</p>
    </div>
  )
}
