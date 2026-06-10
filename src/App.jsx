import React, { useState } from 'react'
import { useStudy } from './hooks/useStudy'
import { useAuth  } from './hooks/useAuth'
import Home    from './screens/Home'
import Bible   from './screens/Bible'
import Plans   from './screens/Plans'
import Library from './screens/Library'
import Quiz    from './screens/Quiz'
import Login   from './screens/Login'

const NAV = [
  { id:'home',    icon:'🏠', label:'Home'    },
  { id:'bible',   icon:'📖', label:'Bible'   },
  { id:'plans',   icon:'📋', label:'Plans'   },
  { id:'library', icon:'🔖', label:'Library' },
  { id:'quiz',    icon:'🎯', label:'Quiz'    },
]

export default function App() {
  const { auth, isLoggedIn, sending, verifying, error, setError, sendOTP, verifyOTP, logout } = useAuth()
  const [screen, setScreen] = useState('home')
  const studyHook = useStudy()
  const {
    study, toggleBookmark, toggleHighlight, saveNote, deleteNote,
    saveJournalNote, updateJournalNote, deleteJournalNote,
    saveTopic, deleteTopic,
    markDayComplete, markChapterRead, isBookmarked, isHighlighted, getNote,
  } = studyHook

  const studyWithMethods = {
    ...study,
    toggleBookmark, toggleHighlight, saveNote, deleteNote,
    isBookmarked, isHighlighted, getNote,
  }

  /* ── Not logged in → show Login ── */
  if (!isLoggedIn) {
    return (
      <Login
        onSendOTP={sendOTP}
        onVerifyOTP={verifyOTP}
        sending={sending}
        verifying={verifying}
        error={error}
        setError={setError}
      />
    )
  }

  /* ── Logged in → main app ── */
  return (
    <div className="app-shell">

      {/* ── Sidebar nav (desktop only) ── */}
      <nav className="app-nav-side">
        <div style={{ paddingBottom:'20px', marginBottom:'8px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ fontFamily:'var(--font-serif)', fontSize:'1.15rem', fontWeight:600, color:'var(--text)', lineHeight:1.2 }}>
            📖 Holy Bible
          </div>
          <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:'3px' }}>King James Version</div>
        </div>

        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`nav-side-item${screen === item.id ? ' active' : ''}`}
          >
            <span style={{ fontSize:'1.1rem' }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}

        {/* User + logout at bottom of sidebar */}
        <div style={{ marginTop:'auto', paddingTop:'20px', borderTop:'1px solid var(--border)' }}>
          <div style={{ padding:'10px 14px', borderRadius:'12px', background:'var(--bg-elevated)', marginBottom:'6px' }}>
            <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:'2px' }}>Signed in as</p>
            <p style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text)', wordBreak:'break-all' }}>{auth.email}</p>
          </div>
          <button
            onClick={logout}
            className="nav-side-item"
            style={{ color:'var(--text-muted)', fontSize:'0.85rem' }}
          >
            <span style={{ fontSize:'1rem' }}>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>

      {/* ── Main content ── */}
      <div className="app-content">
        {screen === 'home'    && <Home    study={studyWithMethods} onNavigate={setScreen} auth={auth} onLogout={logout} />}
        {screen === 'bible'   && <Bible   study={studyWithMethods} onToggleBookmark={toggleBookmark} onToggleHighlight={toggleHighlight} onSaveNote={saveNote} onMarkRead={markChapterRead} />}
        {screen === 'plans'   && <Plans   study={studyWithMethods} onMarkDay={markDayComplete} />}
        {screen === 'library' && <Library
          study={studyWithMethods}
          onDeleteNote={deleteNote}
          onToggleBookmark={toggleBookmark}
          onSaveJournalNote={saveJournalNote}
          onUpdateJournalNote={updateJournalNote}
          onDeleteJournalNote={deleteJournalNote}
          onSaveTopic={saveTopic}
          onDeleteTopic={deleteTopic}
        />}
        {screen === 'quiz'    && <Quiz />}
      </div>

      {/* ── Bottom nav (mobile only) ── */}
      <nav className="app-nav-bottom" style={{
        position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
        width:'100%', maxWidth:'430px',
        background:'rgba(253,246,238,0.97)', backdropFilter:'blur(16px)',
        borderTop:'1px solid var(--border)',
        display:'flex', padding:'8px 0 max(8px, env(safe-area-inset-bottom))',
        zIndex:200,
      }}>
        {NAV.map(item => (
          <button key={item.id} onClick={() => setScreen(item.id)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:'3px',
            padding:'6px 4px', background:'none', border:'none', cursor:'pointer',
          }}>
            <span style={{ fontSize:'1.3rem', filter: screen===item.id ? 'none' : 'grayscale(60%)', transition:'filter 0.2s' }}>
              {item.icon}
            </span>
            <span style={{
              fontSize:'0.62rem', fontWeight:screen===item.id?700:400,
              color: screen===item.id ? 'var(--rose)' : 'var(--text-muted)',
              transition:'color 0.2s',
            }}>{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  )
}
