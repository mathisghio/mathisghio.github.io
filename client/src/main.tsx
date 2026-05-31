import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Prevent browser from restoring scroll position on reload (avoids downward drift)
history.scrollRestoration = 'manual'

// On reload: restore fractional position after load + 400 ms delay.
// Delay is needed because async content (Kit form, lazy images) loads after window.load
// and adds height to the page — restoring too early lands at the wrong section.
window.addEventListener('load', () => {
  const saved = sessionStorage.getItem('mg-scroll-frac')
  if (saved) {
    const frac = parseFloat(saved)
    sessionStorage.removeItem('mg-scroll-frac')
    setTimeout(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max > 0 && frac > 0) {
        document.documentElement.style.scrollBehavior = 'auto'
        window.scrollTo(0, Math.round(frac * max))
        document.documentElement.style.scrollBehavior = ''
      }
    }, 400)
  }
}, { once: true })
window.addEventListener('beforeunload', () => {
  // Save fraction (not absolute pixels) so page-height changes on reload don't drift position
  const max = document.documentElement.scrollHeight - window.innerHeight
  if (max > 0) sessionStorage.setItem('mg-scroll-frac', String(window.scrollY / max))
})

// On resize: preserve fractional scroll position (section heights change when window width changes).
// _stableFrac is only written after 100 ms of scroll inactivity, so resize-caused scroll
// events (browser clamping scrollY) cannot corrupt the pre-resize value.
// When resize fires we cancel any pending scroll update before it can overwrite _stableFrac.
let _stableFrac = 0
let _scrollTimer: ReturnType<typeof setTimeout> | null = null
let _resizeTimer: ReturnType<typeof setTimeout> | null = null
window.addEventListener('scroll', () => {
  if (_scrollTimer !== null) clearTimeout(_scrollTimer)
  _scrollTimer = setTimeout(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (max > 0) _stableFrac = window.scrollY / max
    _scrollTimer = null
  }, 100)
}, { passive: true })
window.addEventListener('resize', () => {
  if (_scrollTimer !== null) { clearTimeout(_scrollTimer); _scrollTimer = null }
  if (_resizeTimer !== null) clearTimeout(_resizeTimer)
  _resizeTimer = setTimeout(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    if (max > 0) {
      // Disable smooth scroll during instant restore so CSS scroll-behavior: smooth
      // doesn't animate the jump to the correct position
      document.documentElement.style.scrollBehavior = 'auto'
      window.scrollTo(0, Math.round(_stableFrac * max))
      document.documentElement.style.scrollBehavior = ''
    }
    _resizeTimer = null
  }, 200)
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
