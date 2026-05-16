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

export function trackEmailClick() {
  window.gtag?.('event', 'click', {
    event_category: 'contact',
    event_label: 'email_click',
  })
  window.fbq?.('trackCustom', 'EmailClick', { content_name: 'contact@mathisghio.com' })
}

export function trackGalleryClick(imageAlt: string) {
  window.gtag?.('event', 'select_content', {
    content_type: 'gallery_image',
    item_id: imageAlt,
  })
  window.fbq?.('trackCustom', 'GalleryClick', { content_name: imageAlt })
}

export function trackSocialClick(platform: string) {
  window.gtag?.('event', 'click', {
    event_category: 'social',
    event_label: platform,
  })
  window.fbq?.('trackCustom', 'SocialClick', { platform })
}

export function trackVideoPlay() {
  window.gtag?.('event', 'video_start', { event_category: 'media' })
  window.fbq?.('trackCustom', 'VideoPlay')
}

export function trackVideoEnd() {
  window.gtag?.('event', 'video_complete', { event_category: 'media' })
  window.fbq?.('trackCustom', 'VideoComplete')
}
