import { AppError } from './errors.js';

const textOf = (el) => (el?.textContent ?? '').trim();

const parseRssChannel = (channel) => {
  const title = textOf(channel.querySelector(':scope > title'));
  const description = textOf(channel.querySelector(':scope > description'));
  const items = [...channel.querySelectorAll(':scope > item')].map((item) => {
    const itemTitle = textOf(item.querySelector('title'));
    const linkEl = item.querySelector('link');
    const link = linkEl ? textOf(linkEl) : '';
    return { title: itemTitle || link || '—', link };
  });

  return {
    title: title || '—',
    description,
    items: items.filter((i) => i.link),
  };
};

const parseAtomFeed = (feed) => {
  const title = textOf(feed.querySelector(':scope > title'));
  const subtitle = textOf(feed.querySelector(':scope > subtitle'));
  const entries = [...feed.querySelectorAll(':scope > entry')].map((entry) => {
    const entryTitle = textOf(entry.querySelector('title'));
    const linkEl =
      entry.querySelector('link[rel="alternate"]') || entry.querySelector('link');
    const link = linkEl?.getAttribute('href')?.trim() ?? '';
    return { title: entryTitle || link || '—', link };
  });

  return {
    title: title || '—',
    description: subtitle,
    items: entries.filter((i) => i.link),
  };
};

/**
 * Чистая функция: XML-строка → структура фида (без побочных эффектов).
 * @param {string} xmlString
 * @returns {{ title: string, description: string, items: { title: string, link: string }[] }}
 */
export const parseRssXml = (xmlString) => {
  if (typeof xmlString !== 'string' || !xmlString.trim()) {
    throw new AppError('errors.invalidRss');
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');

  if (doc.querySelector('parsererror')) {
    throw new AppError('errors.invalidRss');
  }

  const channel = doc.querySelector('channel');
  if (channel) {
    return parseRssChannel(channel);
  }

  const atomFeed = doc.querySelector('feed');
  if (atomFeed) {
    return parseAtomFeed(atomFeed);
  }

  throw new AppError('errors.invalidRss');
};
