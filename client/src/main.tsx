import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Global a11y + touch-target patch for every Kit form on the page.
// Runs once and watches for Kit's async DOM insertions.
;(function kitA11y() {
  if (!document.getElementById('kit-a11y-style')) {
    const s = document.createElement('style')
    s.id = 'kit-a11y-style'
    s.textContent =
      '.formkit-input{min-height:44px!important}' +
      '.formkit-submit{min-height:44px!important}' +
      '.formkit-container div[role="button"]{min-height:44px!important;min-width:44px!important}'
    document.head.appendChild(s)
  }
  const patch = () =>
    document.querySelectorAll<HTMLElement>('.formkit-container div[role="button"]').forEach(el => {
      if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Subscribe')
    })
  new MutationObserver(patch).observe(document.body, { childList: true, subtree: true })
})()

if (!/Instagram/.test(navigator.userAgent)) {
  const kitUid = window.innerWidth < 1200 ? '7343a67e82' : 'f8b2bd3ed1'
  const kitScript = document.createElement('script')
  kitScript.async = true
  kitScript.dataset.uid = kitUid
  kitScript.src = `https://mathis-ghio-wingfoil.kit.com/${kitUid}/index.js`
  document.body.appendChild(kitScript)
}

createRoot(document.getElementById("root")!).render(<App />);
