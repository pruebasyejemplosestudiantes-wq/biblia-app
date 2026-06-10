import React, { useState, useRef, useEffect } from 'react'

export default function Login({ onSendOTP, onVerifyOTP, sending, verifying, error, setError }) {
  const [step,  setStep]  = useState('email')   // 'email' | 'otp'
  const [email, setEmail] = useState('')
  const [digits, setDigits] = useState(['','','','','',''])
  const inputRefs = useRef([])

  useEffect(() => { setError('') }, [step])

  /* ── Email step ── */
  async function handleSendCode(e) {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) { setError('Enter a valid email address.'); return }
    const ok = await onSendOTP(email.trim().toLowerCase())
    if (ok) setStep('otp')
  }

  /* ── OTP step ── */
  function handleDigit(idx, val) {
    const char = val.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[idx] = char
    setDigits(next)
    if (char && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  function handleKeyDown(idx, e) {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const next = [...digits]; next[idx] = ''; setDigits(next)
      } else if (idx > 0) {
        inputRefs.current[idx - 1]?.focus()
      }
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!text) return
    const next = [...digits]
    text.split('').forEach((c, i) => { next[i] = c })
    setDigits(next)
    inputRefs.current[Math.min(text.length, 5)]?.focus()
  }

  function handleVerify(e) {
    e.preventDefault()
    onVerifyOTP(digits.join(''))
  }

  const otpFull = digits.every(d => d !== '')

  return (
    <div style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      background:'linear-gradient(160deg, #F9EDE8 0%, #F5E8F0 50%, #EAE8F5 100%)',
      padding:'24px',
    }}>
      {/* Decorative circles */}
      <div style={{ position:'fixed', top:'-80px', right:'-80px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(181,86,106,0.07)', pointerEvents:'none' }} />
      <div style={{ position:'fixed', bottom:'-60px', left:'-60px', width:'240px', height:'240px', borderRadius:'50%', background:'rgba(123,94,167,0.06)', pointerEvents:'none' }} />

      {/* Card */}
      <div style={{
        width:'100%', maxWidth:'380px',
        background:'rgba(255,255,255,0.85)', backdropFilter:'blur(20px)',
        borderRadius:'24px', padding:'36px 32px',
        boxShadow:'0 8px 40px rgba(45,27,14,0.10)',
        border:'1px solid rgba(255,255,255,0.9)',
        animation:'fadeUp 0.4s ease',
      }}>

        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:'28px' }}>
          <div style={{ fontSize:'2.2rem', marginBottom:'10px' }}>📖</div>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'1.6rem', fontWeight:600, color:'var(--text)', marginBottom:'4px' }}>
            Holy Bible
          </h1>
          <p style={{ fontSize:'0.78rem', color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase', fontWeight:600 }}>
            King James Version
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendCode}>
            <p style={{ fontSize:'0.88rem', color:'var(--text-muted)', marginBottom:'20px', textAlign:'center', lineHeight:1.5 }}>
              Enter your email and we'll send you a one-time login code.
            </p>

            <label style={{ display:'block', fontSize:'0.75rem', fontWeight:600, color:'var(--text-muted)', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'7px' }}>
              Email address
            </label>
            <input
              type='email'
              placeholder='you@example.com'
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              autoFocus
              style={{
                width:'100%', padding:'13px 16px', borderRadius:'14px',
                border:`1.5px solid ${error ? 'var(--rose)' : 'var(--border)'}`,
                background:'var(--bg)', color:'var(--text)', fontSize:'0.95rem',
                outline:'none', marginBottom:'14px', transition:'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--rose)'}
              onBlur={e => e.target.style.borderColor = error ? 'var(--rose)' : 'var(--border)'}
            />

            {error && <p style={{ fontSize:'0.8rem', color:'var(--rose)', marginBottom:'12px', textAlign:'center' }}>{error}</p>}

            <button
              type='submit'
              disabled={sending}
              style={{
                width:'100%', padding:'14px', borderRadius:'14px',
                background: sending ? 'var(--border)' : 'var(--rose)',
                color: sending ? 'var(--text-muted)' : '#fff',
                fontWeight:700, fontSize:'0.95rem', cursor: sending ? 'default' : 'pointer',
                border:'none', fontFamily:'var(--font-sans)', transition:'all 0.2s',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
              }}
            >
              {sending ? (
                <>
                  <span style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(0,0,0,0.15)', borderTopColor:'var(--text-muted)', animation:'spin 0.7s linear infinite', display:'inline-block' }} />
                  Sending…
                </>
              ) : 'Send Login Code →'}
            </button>
          </form>

        ) : (
          <form onSubmit={handleVerify}>
            <div style={{ textAlign:'center', marginBottom:'20px' }}>
              <p style={{ fontSize:'0.88rem', color:'var(--text)', marginBottom:'4px' }}>
                Code sent to
              </p>
              <p style={{ fontSize:'0.88rem', fontWeight:600, color:'var(--rose)' }}>{email}</p>
            </div>

            {/* 6-digit boxes */}
            <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginBottom:'20px' }} onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={d}
                  onChange={e => handleDigit(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  style={{
                    width:44, height:52, textAlign:'center',
                    fontSize:'1.4rem', fontWeight:700, color:'var(--text)',
                    borderRadius:'12px',
                    border: `2px solid ${d ? 'var(--rose)' : 'var(--border)'}`,
                    background: d ? 'var(--rose-soft)' : 'var(--bg)',
                    outline:'none', transition:'all 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--rose)'}
                  onBlur={e => e.target.style.borderColor = d ? 'var(--rose)' : 'var(--border)'}
                />
              ))}
            </div>

            {error && <p style={{ fontSize:'0.8rem', color:'var(--rose)', marginBottom:'12px', textAlign:'center' }}>{error}</p>}

            <button
              type='submit'
              disabled={!otpFull || verifying}
              style={{
                width:'100%', padding:'14px', borderRadius:'14px',
                background: (!otpFull || verifying) ? 'var(--border)' : 'var(--rose)',
                color: (!otpFull || verifying) ? 'var(--text-muted)' : '#fff',
                fontWeight:700, fontSize:'0.95rem',
                cursor: (!otpFull || verifying) ? 'default' : 'pointer',
                border:'none', fontFamily:'var(--font-sans)', transition:'all 0.2s',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
              }}
            >
              {verifying ? (
                <>
                  <span style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(0,0,0,0.15)', borderTopColor:'var(--text-muted)', animation:'spin 0.7s linear infinite', display:'inline-block' }} />
                  Verifying…
                </>
              ) : 'Sign In ✓'}
            </button>

            <button
              type='button'
              onClick={() => { setStep('email'); setDigits(['','','','','','']); setError('') }}
              style={{ width:'100%', marginTop:'12px', padding:'10px', borderRadius:'12px', background:'transparent', border:'none', color:'var(--text-muted)', fontSize:'0.83rem', cursor:'pointer', fontFamily:'var(--font-sans)' }}
            >
              ← Use a different email
            </button>
          </form>
        )}

        {/* Verse decoration */}
        <p style={{ textAlign:'center', marginTop:'28px', fontFamily:'var(--font-serif)', fontSize:'0.82rem', fontStyle:'italic', color:'var(--text-muted)', lineHeight:1.6 }}>
          "Your word is a lamp to my feet<br />and a light to my path."<br />
          <span style={{ fontStyle:'normal', fontWeight:600, fontSize:'0.75rem', letterSpacing:'0.5px' }}>Psalm 119:105</span>
        </p>
      </div>
    </div>
  )
}
