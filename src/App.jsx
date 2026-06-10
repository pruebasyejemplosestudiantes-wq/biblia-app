import React, { useState } from 'react'
import { useStudy } from './hooks/useStudy'
import Home    from './screens/Home'
import Bible   from './screens/Bible'
import Plans   from './screens/Plans'
import Library from './screens/Library'
import Quiz    from './screens/Quiz'

const NAV = [
  { id:'home',    icon:'🏠', label:'Home'    },
  { id:'bible',   icon:'📖', label:'Bible'   },
  { id:'plans',   icon:'📋', label:'Plans'   },
  { id:'library', icon:'🔖', label:'Library' },
  { id:'quiz',    icon:'🎯', label:'Quiz'    },
]

export default function App() {
  const [screen, setScreen] = useState('home')
  const studyHook = useStudy()
  const { study, toggleBookmark, toggleHighlight, saveNote, deleteNote, markDayComplete, markChapterRead, isBookmarked, isHighlighted, getNote } = studyHook

  // Expose methods via study object so Bible can call them directly
  const studyWithMethods = {
    ...study,
    toggleBookmark, toggleHighlight, saveNote, deleteNote,
    isBookmarked, isHighlighted, getNote,
  }

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <div style={{ paddingBottom:'72px' }}>
        {screen === 'home'    && <Home    study={studyWithMethods} onNavigate={setScreen} />}
        {screen === 'bible'   && <Bible   study={studyWithMethods} onToggleBookmark={toggleBookmark} onToggleHighlight={toggleHighlight} onSaveNote={saveNote} onMarkRead={markChapterRead} />}
        {screen === 'plans'   && <Plans   study={studyWithMethods} onMarkDay={markDayComplete} />}
        {screen === 'library' && <Library study={studyWithMethods} onDeleteNote={deleteNote} onToggleBookmark={toggleBookmark} />}
        {screen === 'quiz'    && <Quiz />}
      </div>

      {/* Bottom navigation */}
      <nav style={{
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
