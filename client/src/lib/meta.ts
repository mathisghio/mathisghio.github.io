import { useEffect } from 'react'

interface MetaConfig {
  title: string
  description: string
  url: string
  schema?: object
}

const OG_IMAGE = 'https://res.cloudinary.com/duacto4ay/image/upload/q_auto,f_auto,w_1200,h_630,c_fill/v1774426876/podium-1_whf6pe.jpg'
const DEFAULT_TITLE = 'Mathis Ghio — 5× Wingfoil World Champion'
const DEFAULT_DESC = 'Mathis Ghio — Professional Wingfoil Athlete. 5× World Champion, 4× European Champion, 41.40 kts Speed Record.'

function upsertMeta(attr: string, value: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${value}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, value)
    document.head.appendChild(el)
  }
  el.content = content
}

function upsertCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = url
}

function upsertSchema(data: object) {
  let el = document.getElementById('page-schema') as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'page-schema'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function useMeta({ title, description, url, schema }: MetaConfig) {
  useEffect(() => {
    document.title = title

    upsertMeta('name', 'description', description)

    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:image', OG_IMAGE)

    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', OG_IMAGE)

    upsertCanonical(url)

    if (schema) upsertSchema(schema)

    return () => {
      document.title = DEFAULT_TITLE
      upsertMeta('name', 'description', DEFAULT_DESC)
    }
  }, [title, description, url, schema])
}
