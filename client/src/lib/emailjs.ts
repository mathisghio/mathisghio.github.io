const SERVICE_ID              = 'service_jfw6gre'
const CONTACT_TEMPLATE_ID    = 'template_v0dbiyb'
const NEWSLETTER_TEMPLATE_ID = ''                   // à remplir après création du template
const PUBLIC_KEY              = 'xenyIvBYLTYlcY-Mm'

async function send(templateId: string, firstName: string, toEmail: string) {
  if (!templateId) return
  try {
    await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id:      SERVICE_ID,
        template_id:     templateId,
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

export const sendConfirmation           = (firstName: string, toEmail: string) => send(CONTACT_TEMPLATE_ID,    firstName, toEmail)
export const sendNewsletterConfirmation = (firstName: string, toEmail: string) => send(NEWSLETTER_TEMPLATE_ID, firstName, toEmail)
