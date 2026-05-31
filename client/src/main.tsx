import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Prevent browser from restoring scroll position on reload (avoids downward drift)
history.scrollRestoration = 'manual'

// On reload: restore exact scroll position saved before unload
;(function restoreScroll() {
  const saved = sessionStorage.getItem('mg-scroll-y')
  if (saved) {
    const y = parseInt(saved, 10)
    // Double rAF: wait for React paint + lazy images to settle
    requestAnimationFrame(() => requestAnimationFrame(() => {
      window.scrollTo(0, y)
      sessionStorage.removeItem('mg-scroll-y')
    }))
  }
})()
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('mg-scroll-y', String(window.scrollY))
})

// On resize: preserve fractional scroll position (vh-based section heights change with window width)
let _scrollFrac = 0
let _resizeRafId: number | null = null
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max > 0) _scrollFrac = window.scrollY / max
}, { passive: true })
window.addEventListener('resize', () => {
  if (_resizeRafId !== null) cancelAnimationFrame(_resizeRafId)
  _resizeRafId = requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (max > 0) window.scrollTo(0, Math.round(_scrollFrac * max))
    _resizeRafId = null
  })
})

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
