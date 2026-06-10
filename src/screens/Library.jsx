import React, { useState } from 'react'

const TABS = [
  { id:'bookmarks',  label:'🔖 Saved'      },
  { id:'highlights', label:'✏️ Highlights'  },
  { id:'notes',      label:'📝 Notes'       },
  { id:'topics',     label:'🏷️ Topics'      },
]

export default function Library({
  study,
  onDeleteNote, onToggleBookmark,
  onSaveJournalNote, onUpdateJournalNote, onDeleteJournalNote,
  onSaveTopic, onDeleteTopic,
}) {
  const [tab, setTab] = useState('bookmarks')

  const journalNotes = study.journalNotes || []
  const topics       = study.topics       || []

  const totalNotes = study.notes.length + journalNotes.length

  return (
    <div className="screen-header" style={{ padding:'52px 0 90px', animation:'fadeIn 0.3s ease' }}>
      <div style={{ padding:'0 20px 16px' }}>
        <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'1.8rem', fontWeight:600, color:'var(--text)', marginBottom:'4px' }}>My Library</h1>
        <p style={{ fontSize:'0.85rem', color:'var(--text-muted)' }}>Your saved verses, highlights, notes & topics</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'1px solid var(--border)', padding:'0 20px', overflowX:'auto', gap:'0' }}>
        {TABS.map(t => {
          const count =
            t.id === 'bookmarks'  ? study.bookmarks.length :
            t.id === 'highlights' ? study.highlights.length :
            t.id === 'notes'      ? totalNotes :
            topics.length
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flexShrink:0, padding:'12px 10px', fontSize:'0.82rem', fontWeight:tab===t.id?600:400,
              color: tab===t.id ? 'var(--rose)' : 'var(--text-muted)',
              borderBottom: tab===t.id ? '2px solid var(--rose)' : '2px solid transparent',
              whiteSpace:'nowrap', transition:'all 0.2s',
            }}>
              {t.label}{count > 0 && (
                <span style={{ marginLeft:5, padding:'1px 6px', borderRadius:'100px', background:tab===t.id?'var(--rose-dim)':'var(--bg-elevated)', fontSize:'0.7rem', color:tab===t.id?'var(--rose)':'var(--text-muted)' }}>{count}</span>
              )}
            </button>
          )
        })}
      </div>

      <div style={{ padding:'20px' }}>
        {tab === 'bookmarks'  && <BookmarksTab study={study} onToggleBookmark={onToggleBookmark} />}
        {tab === 'highlights' && <HighlightsTab study={study} />}
        {tab === 'notes'      && (
          <NotesTab
            study={study}
            journalNotes={journalNotes}
            topics={topics}
            onDeleteNote={onDeleteNote}
            onSaveJournalNote={onSaveJournalNote}
            onUpdateJournalNote={onUpdateJournalNote}
            onDeleteJournalNote={onDeleteJournalNote}
          />
        )}
        {tab === 'topics' && (
          <TopicsTab
            topics={topics}
            journalNotes={journalNotes}
            verseNotes={study.notes}
            bookmarks={study.bookmarks}
            onSaveTopic={onSaveTopic}
            onDeleteTopic={onDeleteTopic}
          />
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   BOOKMARKS TAB
───────────────────────────────────────── */
function BookmarksTab({ study, onToggleBookmark }) {
  if (study.bookmarks.length === 0) return <EmptyState icon='🔖' text='No saved verses yet. Tap any verse while reading the Bible to bookmark it.' />
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
      {study.bookmarks.map(b => (
        <VerseItem key={b.ref} item={b} onDelete={() => onToggleBookmark(b)} deleteLabel='Remove' color='var(--rose)' />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   HIGHLIGHTS TAB
───────────────────────────────────────── */
function HighlightsTab({ study }) {
  if (study.highlights.length === 0) return <EmptyState icon='✏️' text='No highlights yet. Tap any verse while reading to highlight it.' />
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
      {study.highlights.map(h => (
        <VerseItem key={h.ref} item={h} highlight={h.color} />
      ))}
    </div>
  )
}

/* ─────────────────────────────────────────
   NOTES TAB
───────────────────────────────────────── */
function NotesTab({ study, journalNotes, topics, onDeleteNote, onSaveJournalNote, onUpdateJournalNote, onDeleteJournalNote }) {
  const [showForm, setShowForm]   = useState(false)
  const [editId, setEditId]       = useState(null)
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formTopic, setFormTopic] = useState('')

  function openNew() {
    setEditId(null); setFormTitle(''); setFormContent(''); setFormTopic('')
    setShowForm(true)
  }

  function openEdit(note) {
    setEditId(note.id); setFormTitle(note.title); setFormContent(note.content); setFormTopic(note.topicId || '')
    setShowForm(true)
  }

  function handleSave() {
    if (!formContent.trim()) return
    if (editId) {
      onUpdateJournalNote(editId, formTitle, formContent, formTopic)
    } else {
      onSaveJournalNote(formTitle, formContent, formTopic)
    }
    setShowForm(false); setFormTitle(''); setFormContent(''); setFormTopic(''); setEditId(null)
  }

  function handleCancel() {
    setShowForm(false); setFormTitle(''); setFormContent(''); setFormTopic(''); setEditId(null)
  }

  const topicOf = id => topics.find(t => t.id === id)

  return (
    <div>
      {/* New note button */}
      {!showForm && (
        <button onClick={openNew} style={{
          width:'100%', padding:'13px', borderRadius:'14px',
          border:'2px dashed var(--border)', background:'transparent',
          color:'var(--text-muted)', fontSize:'0.88rem', fontWeight:500,
          cursor:'pointer', marginBottom:'20px', transition:'all 0.2s',
          display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--rose)'; e.currentTarget.style.color='var(--rose)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)' }}
        >
          + New Note
        </button>
      )}

      {/* Note form */}
      {showForm && (
        <div style={{ borderRadius:'16px', background:'var(--bg-card)', border:'1px solid var(--rose)', padding:'18px', marginBottom:'20px', animation:'fadeIn 0.2s ease' }}>
          <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--rose)', marginBottom:'12px' }}>
            {editId ? 'Edit Note' : 'New Note'}
          </p>
          <input
            placeholder='Title (optional)'
            value={formTitle}
            onChange={e => setFormTitle(e.target.value)}
            style={{ width:'100%', padding:'10px 12px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'0.9rem', marginBottom:'10px', outline:'none' }}
          />
          <textarea
            placeholder='Write your note or reflection here…'
            value={formContent}
            onChange={e => setFormContent(e.target.value)}
            rows={5}
            style={{ width:'100%', padding:'10px 12px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'0.9rem', fontFamily:'var(--font-sans)', resize:'vertical', outline:'none', marginBottom:'10px' }}
          />
          {topics.length > 0 && (
            <select
              value={formTopic}
              onChange={e => setFormTopic(e.target.value)}
              style={{ width:'100%', padding:'9px 12px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg)', color: formTopic ? 'var(--text)' : 'var(--text-muted)', fontSize:'0.88rem', marginBottom:'12px', outline:'none', cursor:'pointer' }}
            >
              <option value=''>No topic</option>
              {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          )}
          <div style={{ display:'flex', gap:'8px' }}>
            <button
              onClick={handleSave}
              disabled={!formContent.trim()}
              style={{ flex:1, padding:'10px', borderRadius:'10px', background:'var(--rose)', color:'#fff', fontWeight:600, fontSize:'0.88rem', cursor: formContent.trim() ? 'pointer' : 'not-allowed', opacity: formContent.trim() ? 1 : 0.5, border:'none' }}
            >
              {editId ? 'Update' : 'Save Note'}
            </button>
            <button onClick={handleCancel} style={{ padding:'10px 16px', borderRadius:'10px', background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text-muted)', fontSize:'0.88rem', cursor:'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Journal notes */}
      {journalNotes.length > 0 && (
        <div style={{ marginBottom: study.notes.length > 0 ? 24 : 0 }}>
          {journalNotes.length > 0 && study.notes.length > 0 && (
            <p style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'10px' }}>MY NOTES</p>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {journalNotes.map(n => {
              const topic = n.topicId ? topicOf(n.topicId) : null
              return (
                <div key={n.id} style={{ padding:'16px', borderRadius:'16px', background:'var(--bg-card)', border:'1px solid var(--border)' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'8px' }}>
                    <div>
                      <span style={{ fontSize:'0.92rem', fontWeight:600, color:'var(--text)' }}>{n.title}</span>
                      {topic && (
                        <span style={{ marginLeft:8, padding:'2px 8px', borderRadius:'100px', background: topic.color + '20', color: topic.color, fontSize:'0.7rem', fontWeight:600 }}>
                          {topic.name}
                        </span>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:'6px', alignItems:'center' }}>
                      <span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{n.date}</span>
                      <button onClick={() => openEdit(n)} style={{ fontSize:'0.72rem', color:'var(--purple)', cursor:'pointer', padding:'2px 8px', borderRadius:'100px', border:'1px solid var(--border)', background:'none' }}>Edit</button>
                      <button onClick={() => onDeleteJournalNote(n.id)} style={{ fontSize:'0.72rem', color:'var(--text-muted)', cursor:'pointer', padding:'2px 8px', borderRadius:'100px', border:'1px solid var(--border)', background:'none' }}>Delete</button>
                    </div>
                  </div>
                  <p style={{ fontSize:'0.9rem', color:'var(--text)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{n.content}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Verse notes (from Bible reader) */}
      {study.notes.length > 0 && (
        <div>
          {journalNotes.length > 0 && (
            <p style={{ fontSize:'0.7rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'10px' }}>VERSE NOTES</p>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
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
        </div>
      )}

      {journalNotes.length === 0 && study.notes.length === 0 && !showForm && (
        <EmptyState icon='📝' text='No notes yet. Tap "+ New Note" to write one, or tap any verse in the Bible to add a verse note.' />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────
   TOPICS TAB
───────────────────────────────────────── */
function TopicsTab({ topics, journalNotes, verseNotes, bookmarks, onSaveTopic, onDeleteTopic }) {
  const [showForm, setShowForm]   = useState(false)
  const [topicName, setTopicName] = useState('')
  const [expanded, setExpanded]   = useState(null)

  function handleSave() {
    if (!topicName.trim()) return
    onSaveTopic(topicName)
    setTopicName(''); setShowForm(false)
  }

  function countForTopic(id) {
    return (journalNotes.filter(n => n.topicId === String(id) || n.topicId === id)).length
         + (verseNotes.filter(n => n.topicId === String(id) || n.topicId === id)).length
  }

  function notesForTopic(id) {
    return [
      ...journalNotes.filter(n => n.topicId === String(id) || n.topicId === id).map(n => ({ ...n, _type:'journal' })),
      ...verseNotes.filter(n => n.topicId === String(id) || n.topicId === id).map(n => ({ ...n, _type:'verse' })),
    ]
  }

  return (
    <div>
      {/* New topic button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{
          width:'100%', padding:'13px', borderRadius:'14px',
          border:'2px dashed var(--border)', background:'transparent',
          color:'var(--text-muted)', fontSize:'0.88rem', fontWeight:500,
          cursor:'pointer', marginBottom:'20px', transition:'all 0.2s',
          display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--purple)'; e.currentTarget.style.color='var(--purple)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)' }}
        >
          + New Topic
        </button>
      )}

      {/* Topic form */}
      {showForm && (
        <div style={{ borderRadius:'16px', background:'var(--bg-card)', border:'1px solid var(--purple)', padding:'18px', marginBottom:'20px', animation:'fadeIn 0.2s ease' }}>
          <p style={{ fontSize:'0.72rem', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', color:'var(--purple)', marginBottom:'12px' }}>New Topic</p>
          <input
            placeholder='e.g. Faith, Prayer, Salvation…'
            value={topicName}
            onChange={e => setTopicName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            style={{ width:'100%', padding:'10px 12px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'0.9rem', marginBottom:'10px', outline:'none' }}
            autoFocus
          />
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={handleSave} disabled={!topicName.trim()}
              style={{ flex:1, padding:'10px', borderRadius:'10px', background:'var(--purple)', color:'#fff', fontWeight:600, fontSize:'0.88rem', cursor: topicName.trim() ? 'pointer' : 'not-allowed', opacity: topicName.trim() ? 1 : 0.5, border:'none' }}>
              Create Topic
            </button>
            <button onClick={() => { setShowForm(false); setTopicName('') }} style={{ padding:'10px 16px', borderRadius:'10px', background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text-muted)', fontSize:'0.88rem', cursor:'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Topics list */}
      {topics.length === 0 && !showForm
        ? <EmptyState icon='🏷️' text='No topics yet. Create one to organize your notes and verses by theme.' />
        : (
          <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
            {topics.map(topic => {
              const count    = countForTopic(topic.id)
              const isOpen   = expanded === topic.id
              const items    = notesForTopic(topic.id)
              return (
                <div key={topic.id} style={{ borderRadius:'16px', background:'var(--bg-card)', border:`1px solid ${isOpen ? topic.color + '50' : 'var(--border)'}`, overflow:'hidden', transition:'border-color 0.2s' }}>
                  {/* Topic header */}
                  <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'16px', cursor:'pointer' }}
                    onClick={() => setExpanded(isOpen ? null : topic.id)}>
                    <div style={{ width:36, height:36, borderRadius:'10px', background: topic.color + '20', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <span style={{ fontSize:'1.1rem' }}>🏷️</span>
                    </div>
                    <div style={{ flex:1 }}>
                      <span style={{ fontWeight:600, fontSize:'0.92rem', color:'var(--text)' }}>{topic.name}</span>
                      <span style={{ marginLeft:8, fontSize:'0.75rem', color:'var(--text-muted)' }}>{count} {count === 1 ? 'item' : 'items'}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                      <button onClick={e => { e.stopPropagation(); onDeleteTopic(topic.id) }}
                        style={{ fontSize:'0.72rem', color:'var(--text-muted)', cursor:'pointer', padding:'3px 8px', borderRadius:'100px', border:'1px solid var(--border)', background:'none' }}>
                        Delete
                      </button>
                      <span style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}>{isOpen ? '▲' : '▼'}</span>
                    </div>
                  </div>
                  {/* Expanded items */}
                  {isOpen && (
                    <div style={{ borderTop:'1px solid var(--border)', padding:'12px 16px', display:'flex', flexDirection:'column', gap:'10px', animation:'fadeIn 0.2s ease' }}>
                      {items.length === 0
                        ? <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', textAlign:'center', padding:'12px 0' }}>No notes in this topic yet. Assign notes to this topic from the Notes tab.</p>
                        : items.map(item => (
                          <div key={item.id || item.ref} style={{ padding:'12px', borderRadius:'12px', background:'var(--bg-elevated)' }}>
                            {item._type === 'journal' ? (
                              <>
                                <p style={{ fontWeight:600, fontSize:'0.88rem', color:'var(--text)', marginBottom:'4px' }}>{item.title}</p>
                                <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{item.content}</p>
                              </>
                            ) : (
                              <>
                                <p style={{ fontSize:'0.75rem', fontWeight:700, color: topic.color, marginBottom:'4px' }}>{item.ref}</p>
                                <p style={{ fontFamily:'var(--font-serif)', fontSize:'0.88rem', fontStyle:'italic', color:'var(--text-muted)', marginBottom:'6px', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>"{item.text?.trim()}"</p>
                                <p style={{ fontSize:'0.85rem', color:'var(--text)', lineHeight:1.6 }}>{item.note}</p>
                              </>
                            )}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      }
    </div>
  )
}

/* ─────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────── */
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
      <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', lineHeight:1.6, maxWidth:'280px', margin:'0 auto' }}>{text}</p>
    </div>
  )
}
