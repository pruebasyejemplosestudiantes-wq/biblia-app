const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

const EMAIL_HTML = (code) => `
  <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#FDF6EE;border-radius:16px;">
    <p style="font-size:0.75rem;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:#B5566A;margin-bottom:6px;">HOLY BIBLE · KJV</p>
    <h1 style="font-size:1.6rem;color:#2D1B0E;margin-bottom:4px;">Your login code 📖</h1>
    <p style="color:#8A7265;margin-bottom:28px;font-size:0.9rem;">Enter this code in the app to sign in.</p>
    <div style="display:flex;justify-content:center;gap:10px;margin-bottom:28px;">
      ${code.split('').map(d =>
        `<span style="display:inline-block;width:48px;height:60px;line-height:60px;text-align:center;font-size:1.8rem;font-weight:700;color:#B5566A;background:#fff;border-radius:12px;border:2px solid #F5E6EA;">${d}</span>`
      ).join('')}
    </div>
    <p style="color:#8A7265;font-size:0.8rem;text-align:center;">Expires in 10 minutes. If you didn't request this, ignore this email.</p>
  </div>
`

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: CORS })
    }

    let email, code
    try {
      ({ email, code } = await request.json())
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } })
    }

    if (!email || !code) {
      return new Response(JSON.stringify({ error: 'email and code are required' }), { status: 400, headers: { ...CORS, 'Content-Type': 'application/json' } })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Holy Bible <onboarding@resend.dev>',
        to: [email],
        subject: 'Your Holy Bible login code',
        html: EMAIL_HTML(code),
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  },
}
