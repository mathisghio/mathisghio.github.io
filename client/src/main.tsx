import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Prevent browser from restoring scroll position on reload (avoids downward drift)
history.scrollRestoration = 'manual'

// On reload: restore position after all resources have loaded (images affect layout height)
window.addEventListener('load', () => {
  const saved = sessionStorage.getItem('mg-scroll-y')
  if (saved) {
    window.scrollTo(0, parseInt(saved, 10))
    sessionStorage.removeItem('mg-scroll-y')
  }
}, { once: true })
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('mg-scroll-y', String(window.scrollY))
})

// On resize: preserve fractional scroll position (vh-based section heights change with window width).
// _isResizing flag prevents the scroll event triggered by window.scrollTo from updating _scrollFrac
// mid-restore, which caused an oscillation loop on repeated resize events.
let _scrollFrac = 0
let _isResizing = false
let _resizeDebounce: ReturnType<typeof setTimeout> | null = null
window.addEventListener('scroll', () => {
  if (_isResizing) return
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max > 0) _scrollFrac = window.scrollY / max
}, { passive: true })
window.addEventListener('resize', () => {
  if (!_isResizing) _isResizing = true
  if (_resizeDebounce !== null) clearTimeout(_resizeDebounce)
  _resizeDebounce = setTimeout(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (max > 0) window.scrollTo(0, Math.round(_scrollFrac * max))
    _resizeDebounce = null
    requestAnimationFrame(() => {
      _isResizing = false
      const max2 = document.documentElement.scrollHeight - window.innerHeight
      if (max2 > 0) _scrollFrac = window.scrollY / max2
    })
  }, 150)
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
