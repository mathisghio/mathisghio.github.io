const SERVICE_ID  = 'service_jfw6gre'
const TEMPLATE_ID = 'template_v0dbiyb'
const PUBLIC_KEY  = 'xenyIvBYLTYlcY-Mm'

export async function sendConfirmation(firstName: string, toEmail: string) {
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
