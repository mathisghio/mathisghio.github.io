declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function trackLead(label: 'partnership_form' | 'sponsorship_kit_download') {
  window.gtag?.('event', 'generate_lead', {
    event_category: 'partnership',
    event_label: label,
    value: 10000,
    currency: 'EUR',
  })
  window.fbq?.('track', 'Lead', {
    content_name: label,
    value: 10000,
    currency: 'EUR',
  })
}

export function trackSponsorsPageView() {
  window.gtag?.('event', 'view_item', { item_name: 'sponsors_page' })
  window.fbq?.('track', 'ViewContent', { content_name: 'Sponsors Page' })
}

export function trackFormStart() {
  window.gtag?.('event', 'form_start', { event_category: 'partnership_form' })
}
