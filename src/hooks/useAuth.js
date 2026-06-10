import { useState } from 'react'

const AUTH_KEY   = 'bible_auth'
const OTP_KEY    = 'bible_otp'
const WORKER_URL = 'https://biblia-auth.biblia-app.workers.dev'

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
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
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
