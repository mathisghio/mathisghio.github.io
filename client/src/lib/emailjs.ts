const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || ''
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || ''

export async function sendConfirmation(firstName: string, toEmail: string) {
  if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) return
  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:      SERVICE_ID,
        template_id:     TEMPLATE_ID,
        user_id:         PUBLIC_KEY,
        template_params: {
          to_email:  toEmail,
          firstName,
          reply_to:  'contact@mathisghio.com',
        },
      }),
    })
  } catch { /* non-fatal */ }
}
