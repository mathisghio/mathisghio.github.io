import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { sendNewsletterConfirmation } from "@/lib/emailjs";

// Kit.com responsive newsletter form
const kitUid = window.innerWidth < 1200 ? '7343a67e82' : 'f8b2bd3ed1'
const kitScript = document.createElement('script')
kitScript.async = true
kitScript.dataset.uid = kitUid
kitScript.src = `https://mathis-ghio-wingfoil.kit.com/${kitUid}/index.js`
document.body.appendChild(kitScript)

// Confirmation email after successful Kit.com newsletter subscription
;(function watchKitForms() {
  let savedEmail     = ''
  let savedFirstName = 'there'

  // Kit.com fires this custom event on successful subscription
  window.addEventListener('ck-subscriber-created', (e: Event) => {
    const detail = (e as CustomEvent).detail ?? {}
    const email     = detail.email      || savedEmail
    const firstName = (detail.first_name || savedFirstName).split(' ')[0]
    if (email) sendNewsletterConfirmation(firstName, email)
  })

  // Fallback: watch DOM for Kit.com forms, save values on submit,
  // then detect success via data-status attribute mutation
  new MutationObserver(() => {
    document.querySelectorAll<HTMLElement>('.seva-form, form[data-uid]').forEach(form => {
      if (form.dataset.kitWatched) return
      form.dataset.kitWatched = '1'

      form.addEventListener('submit', () => {
        const emailEl = form.querySelector<HTMLInputElement>('input[name="email_address"]')
        const nameEl  = form.querySelector<HTMLInputElement>('input[name="first_name"]')
        savedEmail     = emailEl?.value ?? ''
        savedFirstName = nameEl?.value?.trim().split(' ')[0] || 'there'
      }, { capture: true })

      new MutationObserver(() => {
        if ((form as HTMLElement).dataset.status === 'success' && savedEmail) {
          sendNewsletterConfirmation(savedFirstName, savedEmail)
          savedEmail = ''
        }
      }).observe(form, { attributes: true, attributeFilter: ['data-status'] })
    })
  }).observe(document.body, { childList: true, subtree: true })
})()

createRoot(document.getElementById("root")!).render(<App />);
