import { AppError } from './errors.js'

const textOf = el => (el?.textContent ?? '').trim()

const itemDescriptionFromRss = (item) => {
  const direct = item.querySelector(':scope > description')
  if (direct) return textOf(direct)

  const elements = item.getElementsByTagName('*')
  for (let i = 0; i < elements.length; i += 1) {
    const el = elements[i]
    if (
      el.localName === 'encoded'
      && (el.namespaceURI || '').includes('purl.org/rss/1.0/modules/content')
    ) {
      return textOf(el)
    }
  }
  return ''
}

const itemDescriptionFromAtom = (entry) => {
  const summary = textOf(entry.querySelector(':scope > summary'))
  if (summary) return summary
  return textOf(entry.querySelector(':scope > content'))
}

const parseRssChannel = (channel) => {
  const title = textOf(channel.querySelector(':scope > title'))
  const description = textOf(channel.querySelector(':scope > description'))
  const items = [...channel.querySelectorAll(':scope > item')].map((item) => {
    const itemTitle = textOf(item.querySelector('title'))
    const linkEl = item.querySelector('link')
    const link = linkEl ? textOf(linkEl) : ''
    return {
      title: itemTitle || link || '—',
      link,
      description: itemDescriptionFromRss(item),
    }
  })

  return {
    title: title || '—',
    description,
    items: items.filter(i => i.link),
  }
}

const parseAtomFeed = (feed) => {
  const title = textOf(feed.querySelector(':scope > title'))
  const subtitle = textOf(feed.querySelector(':scope > subtitle'))
  const entries = [...feed.querySelectorAll(':scope > entry')].map((entry) => {
    const entryTitle = textOf(entry.querySelector('title'))
    const linkEl
      = entry.querySelector('link[rel="alternate"]') || entry.querySelector('link')
    const link = linkEl?.getAttribute('href')?.trim() ?? ''
    return {
      title: entryTitle || link || '—',
      link,
      description: itemDescriptionFromAtom(entry),
    }
  })

  return {
    title: title || '—',
    description: subtitle,
    items: entries.filter(i => i.link),
  }
}

/**
 * Чистая функция: XML-строка → структура фида (без побочных эффектов).
 * @param {string} xmlString
 * @returns {{ title: string, description: string, items: { title: string, link: string, description: string }[] }}
 */
export const parseRssXml = (xmlString) => {
  if (typeof xmlString !== 'string' || !xmlString.trim()) {
    throw new AppError('errors.invalidRss')
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(xmlString, 'application/xml')

  if (doc.querySelector('parsererror')) {
    throw new AppError('errors.invalidRss')
  }

  const channel = doc.querySelector('channel')
  if (channel) {
    return parseRssChannel(channel)
  }

  const atomFeed = doc.querySelector('feed')
  if (atomFeed) {
    return parseAtomFeed(atomFeed)
  }

  throw new AppError('errors.invalidRss')
}
