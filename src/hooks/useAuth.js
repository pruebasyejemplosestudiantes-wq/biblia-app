import { useState } from 'react'

const AUTH_KEY   = 'bible_auth'
const OTP_KEY    = 'bible_otp'
const RESEND_URL = 'https://api.resend.com/emails'
const RESEND_KEY = 're_Hdc5CW3Z_BUKxJNYBqMFMGrhBuxnbt195'

export function useAuth() {
  const [auth, setAuth] = useState(() => {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null') }
    catch { return null }
  })
  const [sending,   setSending]   = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error,     setError]     = useState('')

  async function sendOTP(email) {
    setSending(true); setError('')
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    try {
      const res = await fetch(RESEND_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Holy Bible <onboarding@resend.dev>',
          to: [email],
          subject: 'Your Holy Bible login code',
          html: `
            <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FDF6EE;border-radius:16px;">
              <p style="font-size:0.75rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#B5566A;margin-bottom:6px;">HOLY BIBLE · KJV</p>
              <h1 style="font-size:1.6rem;color:#2D1B0E;margin-bottom:4px;">Your login code 📖</h1>
              <p style="color:#8A7265;margin-bottom:28px;font-size:0.9rem;">Enter this code in the app to sign in.</p>
              <div style="display:flex;justify-content:center;gap:10px;margin-bottom:28px;">
                ${code.split('').map(d => `<span style="display:inline-block;width:48px;height:60px;line-height:60px;text-align:center;font-size:1.8rem;font-weight:700;color:#B5566A;background:#fff;border-radius:12px;border:2px solid #F5E6EA;">${d}</span>`).join('')}
              </div>
              <p style="color:#8A7265;font-size:0.8rem;text-align:center;">Expires in 10 minutes. If you didn't request this, ignore this email.</p>
            </div>
          `,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || `Error ${res.status}`)
      }

      localStorage.setItem(OTP_KEY, JSON.stringify({
        code,
        email,
        expiresAt: Date.now() + 10 * 60 * 1000,
      }))
      return true
    } catch (err) {
      setError(err.message || 'Could not send code. Please try again.')
      return false
    } finally {
      setSending(false)
    }
  }

  function verifyOTP(inputCode) {
    setVerifying(true); setError('')
    try {
      const stored = JSON.parse(localStorage.getItem(OTP_KEY) || 'null')
      if (!stored)                      { setError('No pending code. Request a new one.'); return false }
      if (Date.now() > stored.expiresAt){ setError('Code expired. Request a new one.'); return false }
      if (inputCode !== stored.code)    { setError('Incorrect code. Please try again.'); return false }

      const session = { email: stored.email, loggedInAt: Date.now() }
      localStorage.setItem(AUTH_KEY, JSON.stringify(session))
      localStorage.removeItem(OTP_KEY)
      setAuth(session)
      return true
    } finally {
      setVerifying(false)
    }
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY)
    setAuth(null)
    setError('')
  }

  return { auth, isLoggedIn: !!auth, sending, verifying, error, setError, sendOTP, verifyOTP, logout }
}
