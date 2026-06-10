import React, { useState, useEffect, useRef } from 'react'
import { BOOKS } from '../data/bible'

const HIGHLIGHT_COLORS = ['#FFE066','#A8E6A3','#A8D8F0','#F0A8C8','#C8A8F0']

export default function Bible({ study, onToggleBookmark, onToggleHighlight, onSaveNote, onMarkRead }) {
  const [view, setView] = useState('books')   // books | chapters | reader
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [testament, setTestament] = useState('NT')
  const [activeVerse, setActiveVerse] = useState(null)  // ref for popup
  const [noteMode, setNoteMode] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [fontSize, setFontSize] = useState(18)
  const popupRef = useRef(null)

  async function loadChapter(book, chapter) {
    setLoading(true); setError(null); setVerses([])
    try {
      const query = `${book.id.replace(/([0-9]+)/g, '$1+')}+${chapter}`
      const res = await fetch(`https://bible-api.com/${encodeURIComponent(book.name + ' ' + chapter)}?translation=kjv`)
      const data = await res.json()
      if (data.verses) {
        setVerses(data.verses)
        onMarkRead(book.id, chapter)
      } else { setError('Could not load this chapter. Please check your connection.') }
    } catch { setError('Connection error. Please check your internet connection.') }
    setLoading(false)
  }

  function openBook(book) { setSelectedBook(book); setView('chapters') }
  function openChapter(ch) { setSelectedChapter(ch); setView('reader'); loadChapter(selectedBook, ch) }
  function goBack() { view === 'reader' ? setView('chapters') : setView('books') }

  const otBooks = BOOKS.filter(b => b.testament === 'OT')
  const ntBooks = BOOKS.filter(b => b.testament === 'NT')

  function handleVersePress(verse) {
    const ref = `${selectedBook.name} ${selectedChapter}:${verse.verse}`
    setActiveVerse(activeVerse === ref ? null : ref)
    setNoteText(study.getNote(ref)?.note || '')
    setNoteMode(false)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--bg)', paddingBottom:'90px' }}>
      {/* Top bar */}
      <div className="screen-header" style={{ padding:'52px 20px 16px', borderBottom:'1px solid var(--border)', background:'var(--bg-card)', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          {view !== 'books' && (
            <button onClick={goBack} style={{ width:36, height:36, borderRadius:'50%', background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text)', fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>←</button>
          )}
          <div style={{ flex:1 }}>
            <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', fontWeight:600, color:'var(--text)' }}>
              {view === 'books' ? 'Holy Bible · KJV'
                : view === 'chapters' ? selectedBook.name
                : `${selectedBook.name} ${selectedChapter}`}
            </h1>
            {view === 'books' && <p style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>King James Version</p>}
          </div>
          {view === 'reader' && (
            <div style={{ display:'flex', gap:'6px' }}>
              <button onClick={() => setFontSize(f => Math.max(14, f - 2))} style={iconBtn}>A−</button>
              <button onClick={() => setFontSize(f => Math.min(28, f + 2))} style={iconBtn}>A+</button>
            </div>
          )}
        </div>
      </div>

      {/* Books list */}
      {view === 'books' && (
        <div style={{ padding:'16px 20px', animation:'fadeIn 0.3s ease' }}>
          <div style={{ display:'flex', gap:'8px', marginBottom:'16px' }}>
            {['OT','NT'].map(t => (
              <button key={t} onClick={() => setTestament(t)} style={{
                flex:1, padding:'10px', borderRadius:'12px', fontSize:'0.85rem', fontWeight:testament===t?600:400,
                background: testament===t ? 'var(--rose)' : 'var(--bg-card)',
                color: testament===t ? '#fff' : 'var(--text-muted)',
                border: `1px solid ${testament===t ? 'var(--rose)' : 'var(--border)'}`,
                transition:'all 0.2s',
              }}>{t === 'OT' ? 'Old Testament' : 'New Testament'}</button>
            ))}
          </div>
          <div className="grid-books" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            {(testament === 'OT' ? otBooks : ntBooks).map(book => {
              const readCount = Array.from({length:book.chapters}, (_,i) => i+1).filter(ch => study.readChapters.includes(`${book.id}-${ch}`)).length
              return (
                <div key={book.id} onClick={() => openBook(book)} style={{
                  padding:'14px', borderRadius:'14px', cursor:'pointer',
                  background:'var(--bg-card)', border:'1px solid var(--border)',
                  transition:'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--rose)'; e.currentTarget.style.background='var(--bg-elevated)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg-card)' }}
                >
                  <div style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--text)', marginBottom:'3px' }}>{book.name}</div>
                  <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{book.chapters} chapters</div>
                  {readCount > 0 && (
                    <div style={{ marginTop:'8px', height:'3px', borderRadius:'100px', background:'var(--border)' }}>
                      <div style={{ height:'100%', borderRadius:'100px', background:'var(--rose)', width:`${(readCount/book.chapters)*100}%` }} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Chapters grid */}
      {view === 'chapters' && selectedBook && (
        <div style={{ padding:'20px', animation:'fadeIn 0.3s ease' }}>
          <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'16px' }}>{selectedBook.chapters} chapters</p>
          <div className="grid-chapters" style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:'8px' }}>
            {Array.from({length:selectedBook.chapters}, (_,i) => i+1).map(ch => {
              const read = study.readChapters.includes(`${selectedBook.id}-${ch}`)
              return (
                <button key={ch} onClick={() => openChapter(ch)} style={{
                  padding:'14px 0', borderRadius:'12px', fontSize:'0.9rem', fontWeight:600,
                  background: read ? 'var(--rose-soft)' : 'var(--bg-card)',
                  color: read ? 'var(--rose)' : 'var(--text)',
                  border: `1px solid ${read ? 'rgba(181,86,106,0.25)' : 'var(--border)'}`,
                  cursor:'pointer', transition:'all 0.15s',
                }}>
                  {ch}{read && <span style={{ display:'block', fontSize:'0.5rem' }}>✓</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Chapter reader */}
      {view === 'reader' && (
        <div style={{ padding:'24px 20px', animation:'fadeIn 0.3s ease', flex:1 }}>
          {/* Save hint */}
          {!loading && (
            <div style={{ display:'flex', alignItems:'center', gap:'8px', padding:'9px 14px', borderRadius:'12px', background:'var(--rose-dim)', border:'1px solid rgba(181,86,106,0.15)', marginBottom:'20px' }}>
              <span style={{ fontSize:'0.8rem' }}>💡</span>
              <p style={{ fontSize:'0.78rem', color:'var(--rose)', lineHeight:1.4 }}>
                <strong>Tap any verse</strong> to bookmark it, highlight it, or add a personal note.
              </p>
            </div>
          )}
          {loading && (
            <div style={{ textAlign:'center', padding:'60px 0' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', border:'3px solid var(--border)', borderTopColor:'var(--rose)', animation:'spin 0.8s linear infinite', margin:'0 auto 16px' }} />
              <p style={{ color:'var(--text-muted)', fontSize:'0.875rem' }}>Loading scripture…</p>
            </div>
          )}
          {error && <p style={{ color:'var(--rose)', textAlign:'center', padding:'40px 0', fontSize:'0.9rem' }}>{error}</p>}
          {!loading && !error && verses.map((v) => {
            const ref = `${selectedBook.name} ${selectedChapter}:${v.verse}`
            const isActive = activeVerse === ref
            const highlighted = study.isHighlighted(ref)
            const bookmarked = study.isBookmarked(ref)
            const hasNote = !!study.getNote(ref)
            return (
              <div key={v.verse}>
                <div onClick={() => handleVersePress(v)}
                  style={{
                    padding:'10px 0', cursor:'pointer', position:'relative',
                    background: highlighted ? highlighted.color + '35' : isActive ? 'var(--bg-elevated)' : 'transparent',
                    borderRadius:8, margin:'0 -8px', paddingLeft:8, paddingRight:8,
                    borderLeft: isActive ? '3px solid var(--rose)' : '3px solid transparent',
                    transition:'all 0.15s',
                  }}>
                  <span style={{ fontSize:'0.7rem', fontWeight:700, color:'var(--rose)', marginRight:'8px', verticalAlign:'super' }}>{v.verse}</span>
                  <span style={{ fontFamily:'var(--font-serif)', fontSize:`${fontSize}px`, lineHeight:1.8, color:'var(--text)' }}>{v.text.trim()}</span>
                  {(bookmarked || hasNote) && (
                    <span style={{ marginLeft:6, fontSize:'0.7rem' }}>{bookmarked ? '🔖' : ''}{hasNote ? '📝' : ''}</span>
                  )}
                </div>

                {/* Verse action popup */}
                {isActive && (
                  <div ref={popupRef} style={{ margin:'4px 0 12px', padding:'14px', borderRadius:'14px', background:'var(--bg-card)', border:'1px solid var(--border)', animation:'fadeIn 0.2s ease' }}>
                    <p style={{ fontSize:'0.72rem', fontWeight:600, color:'var(--text-muted)', marginBottom:'10px' }}>{ref}</p>
                    {!noteMode ? (
                      <>
                        {/* Highlight colors */}
                        <div style={{ display:'flex', gap:'8px', marginBottom:'12px', alignItems:'center' }}>
                          <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Highlight:</span>
                          {HIGHLIGHT_COLORS.map(c => (
                            <button key={c} onClick={() => study.toggleHighlight({ ref, text:v.text, book:selectedBook.name, chapter:selectedChapter, verse:v.verse }, c)}
                              style={{ width:22, height:22, borderRadius:'50%', background:c, border: study.isHighlighted(ref)?.color===c ? '2px solid var(--text)' : '2px solid transparent', cursor:'pointer' }} />
                          ))}
                          {study.isHighlighted(ref) && (
                            <button onClick={() => study.toggleHighlight({ ref })} style={{ fontSize:'0.75rem', color:'var(--text-muted)', cursor:'pointer' }}>Remove</button>
                          )}
                        </div>
                        {/* Actions */}
                        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                          <ActionBtn icon={study.isBookmarked(ref) ? '🔖' : '☆'} label={study.isBookmarked(ref) ? 'Saved' : 'Bookmark'}
                            onClick={() => study.toggleBookmark({ ref, text:v.text, book:selectedBook.name, chapter:selectedChapter, verse:v.verse })}
                            active={study.isBookmarked(ref)} />
                          <ActionBtn icon='📝' label='Note' onClick={() => setNoteMode(true)} active={hasNote} />
                          <ActionBtn icon='📤' label='Share' onClick={() => {
                            if (navigator.share) navigator.share({ text:`${v.text.trim()} — ${ref}` })
                            else navigator.clipboard?.writeText(`${v.text.trim()} — ${ref}`)
                          }} />
                        </div>
                      </>
                    ) : (
                      <div>
                        <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder='Write your note here…'
                          style={{ width:'100%', minHeight:80, padding:'10px', borderRadius:'10px', border:'1px solid var(--border)', background:'var(--bg)', color:'var(--text)', fontSize:'0.875rem', fontFamily:'var(--font-sans)', resize:'none', outline:'none' }} />
                        <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
                          <button onClick={() => { study.saveNote({ ref, text:v.text }, noteText); setNoteMode(false) }}
                            style={{ flex:1, padding:'8px', borderRadius:'10px', background:'var(--rose)', color:'#fff', fontWeight:600, fontSize:'0.85rem', cursor:'pointer' }}>Save</button>
                          <button onClick={() => setNoteMode(false)}
                            style={{ padding:'8px 14px', borderRadius:'10px', background:'var(--bg)', border:'1px solid var(--border)', color:'var(--text-muted)', fontSize:'0.85rem', cursor:'pointer' }}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          {/* Chapter navigation */}
          {!loading && verses.length > 0 && (
            <div style={{ display:'flex', gap:'10px', marginTop:'32px' }}>
              {selectedChapter > 1 && (
                <button onClick={() => openChapter(selectedChapter - 1)} style={{ flex:1, padding:'14px', borderRadius:'14px', background:'var(--bg-card)', border:'1px solid var(--border)', color:'var(--text)', fontSize:'0.875rem', cursor:'pointer' }}>← Chapter {selectedChapter - 1}</button>
              )}
              {selectedChapter < selectedBook.chapters && (
                <button onClick={() => openChapter(selectedChapter + 1)} style={{ flex:1, padding:'14px', borderRadius:'14px', background:'var(--rose)', color:'#fff', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', border:'none' }}>Chapter {selectedChapter + 1} →</button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ActionBtn({ icon, label, onClick, active }) {
  return (
    <button onClick={onClick} style={{
      padding:'7px 14px', borderRadius:'100px', fontSize:'0.78rem', fontWeight:500,
      background: active ? 'var(--rose-dim)' : 'var(--bg-elevated)',
      color: active ? 'var(--rose)' : 'var(--text-muted)',
      border: `1px solid ${active ? 'rgba(181,86,106,0.25)' : 'var(--border)'}`,
      cursor:'pointer', display:'flex', alignItems:'center', gap:'5px',
    }}>{icon} {label}</button>
  )
}

const iconBtn = {
  padding:'6px 10px', borderRadius:'8px', background:'var(--bg)', border:'1px solid var(--border)',
  color:'var(--text-muted)', fontSize:'0.8rem', cursor:'pointer', fontWeight:600,
}
