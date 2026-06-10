import React, { useState } from 'react'
import { QUIZ_QUESTIONS } from '../data/bible'

export default function Quiz() {
  const [phase, setPhase] = useState('start')   // start | playing | done
  const [qIdx, setQIdx]   = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [questions, setQuestions] = useState([])

  function startQuiz() {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10)
    setQuestions(shuffled)
    setQIdx(0); setSelected(null); setAnswered(false); setScore(0); setAnswers([])
    setPhase('playing')
  }

  function pick(i) {
    if (answered) return
    setSelected(i); setAnswered(true)
    const correct = i === questions[qIdx].ans
    if (correct) setScore(s => s + 1)
    setAnswers(a => [...a, { correct }])
  }

  function next() {
    if (qIdx < questions.length - 1) {
      setQIdx(i => i+1); setSelected(null); setAnswered(false)
    } else { setPhase('done') }
  }

  if (phase === 'start') return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', textAlign:'center', animation:'fadeIn 0.4s ease' }}>
      <div style={{ fontSize:'3rem', marginBottom:'16px' }}>🎯</div>
      <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'2rem', fontWeight:600, color:'var(--text)', marginBottom:'12px' }}>Bible Quiz</h1>
      <p style={{ color:'var(--text-muted)', marginBottom:'12px', lineHeight:1.65, maxWidth:'300px' }}>
        Test your knowledge of scripture with 10 questions.
      </p>
      <div style={{ display:'flex', gap:'12px', justifyContent:'center', marginBottom:'32px', flexWrap:'wrap' }}>
        {['👶 Beginner friendly','📖 KJV based','✨ 15 questions in pool'].map(t => (
          <span key={t} style={{ padding:'6px 12px', borderRadius:'100px', background:'var(--bg-elevated)', border:'1px solid var(--border)', fontSize:'0.78rem', color:'var(--text-muted)' }}>{t}</span>
        ))}
      </div>
      <button onClick={startQuiz} style={{ padding:'16px 40px', borderRadius:'100px', background:'var(--rose)', color:'#fff', fontWeight:700, fontSize:'1rem', cursor:'pointer', fontFamily:'var(--font-sans)', boxShadow:'0 6px 20px rgba(181,86,106,0.3)' }}>
        Start Quiz
      </button>
    </div>
  )

  if (phase === 'done') {
    const pct = Math.round((score / questions.length) * 100)
    const msg = pct === 100 ? '🏆 Perfect score! You know your scripture!' : pct >= 70 ? '⭐ Great job! Keep reading!' : '💪 Keep studying — you\'re growing!'
    return (
      <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', textAlign:'center', animation:'fadeUp 0.4s ease' }}>
        <div style={{ fontSize:'3.5rem', marginBottom:'16px' }}>{pct === 100 ? '🏆' : pct >= 70 ? '⭐' : '📖'}</div>
        <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'2rem', fontWeight:600, color:'var(--text)', marginBottom:'8px' }}>Quiz Complete!</h2>
        <p style={{ color:'var(--text-muted)', marginBottom:'24px' }}>{msg}</p>
        <div style={{ width:120, height:120, borderRadius:'50%', background:'var(--rose-soft)', border:'4px solid var(--rose)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 24px' }}>
          <span style={{ fontFamily:'var(--font-serif)', fontSize:'2.2rem', fontWeight:600, color:'var(--rose)', lineHeight:1 }}>{score}</span>
          <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>out of {questions.length}</span>
        </div>
        <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginBottom:'32px' }}>
          {answers.map((a, i) => (
            <div key={i} style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem',
              background: a.correct ? 'rgba(74,155,122,0.15)' : 'rgba(181,86,106,0.15)',
              border: `2px solid ${a.correct ? '#4A9B7A' : 'var(--rose)'}`,
              color: a.correct ? '#4A9B7A' : 'var(--rose)',
            }}>{a.correct ? '✓' : '✗'}</div>
          ))}
        </div>
        <button onClick={startQuiz} style={{ padding:'14px 36px', borderRadius:'100px', background:'var(--rose)', color:'#fff', fontWeight:700, fontSize:'0.95rem', cursor:'pointer', fontFamily:'var(--font-sans)' }}>
          Try Again
        </button>
      </div>
    )
  }

  const q = questions[qIdx]
  const progress = ((qIdx + 1) / questions.length) * 100

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--bg)' }}>
      {/* Progress bar */}
      <div style={{ height:4, background:'var(--border)' }}>
        <div style={{ height:'100%', background:'var(--rose)', width:`${progress}%`, transition:'width 0.3s' }} />
      </div>

      <div style={{ padding:'24px 20px 90px', flex:1, display:'flex', flexDirection:'column', maxWidth:420, margin:'0 auto', width:'100%' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'28px' }}>
          <span style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)' }}>Question {qIdx+1} of {questions.length}</span>
          <span style={{ padding:'4px 12px', borderRadius:'100px', background:'var(--rose-dim)', color:'var(--rose)', fontSize:'0.8rem', fontWeight:600 }}>Score: {score}</span>
        </div>

        <h2 style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem', fontWeight:600, color:'var(--text)', marginBottom:'28px', lineHeight:1.35, flex:1 }}>
          {q.question}
        </h2>

        <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'20px' }}>
          {q.opts.map((opt, i) => {
            let bg = 'var(--bg-card)', border = 'var(--border)', color = 'var(--text)'
            if (answered) {
              if (i === q.ans)         { bg='rgba(74,155,122,0.1)'; border='#4A9B7A'; color='#4A9B7A' }
              else if (i === selected) { bg='var(--rose-dim)'; border='var(--rose)'; color='var(--rose)' }
            } else if (selected === i) { bg='var(--bg-elevated)'; border='var(--rose)' }
            return (
              <button key={i} onClick={() => pick(i)} style={{
                padding:'14px 18px', borderRadius:'14px', textAlign:'left',
                background:bg, border:`2px solid ${border}`, color,
                fontWeight:500, fontSize:'0.95rem', cursor:answered?'default':'pointer',
                fontFamily:'var(--font-sans)', transition:'all 0.2s', lineHeight:1.4,
              }}>
                <span style={{ display:'inline-flex', width:24, height:24, borderRadius:'50%', alignItems:'center', justifyContent:'center', fontSize:'0.75rem', fontWeight:700, marginRight:10, background:answered&&i===q.ans?'rgba(74,155,122,0.2)':answered&&i===selected?'var(--rose-dim)':'rgba(0,0,0,0.05)', border:`1px solid ${answered&&i===q.ans?'#4A9B7A':answered&&i===selected?'var(--rose)':'rgba(0,0,0,0.1)'}`, verticalAlign:'middle' }}>
                  {answered&&i===q.ans?'✓':answered&&i===selected&&i!==q.ans?'✗':String.fromCharCode(65+i)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        {answered && (
          <button onClick={next} style={{ padding:'16px', borderRadius:'14px', background:'var(--rose)', color:'#fff', fontWeight:700, fontSize:'1rem', cursor:'pointer', fontFamily:'var(--font-sans)', border:'none', animation:'fadeIn 0.3s ease' }}>
            {qIdx < questions.length - 1 ? 'Next Question →' : 'See Results →'}
          </button>
        )}
      </div>
    </div>
  )
}
