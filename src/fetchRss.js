import axios from 'axios'

import { AppError } from './errors.js'

/**
 * Прокси Hexlet (тот же контракт, что в эталонных решениях и в автотестах).
 * @param {string} feedUrl
 * @returns {string}
 */
const buildProxyUrl = feedUrl => {
  const u = new URL('https://allorigins.hexlet.app/get')
  u.searchParams.set('disableCache', 'true')
  u.searchParams.set('url', feedUrl)
  return u.toString()
}

/**
 * Загрузка тела RSS через прокси (JSON с полем contents).
 * @param {string} feedUrl
 * @returns {Promise<string>}
 */
export const fetchRssXml = feedUrl => {
  const url = buildProxyUrl(feedUrl)
  return axios
    .get(url, {
      timeout: 20000,
    })
    .then(response => {
      const contents = response.data?.contents
      if (typeof contents !== 'string') {
        throw new AppError('errors.invalidRss')
      }
      return contents
    })
    .catch(err => {
      if (err instanceof AppError) {
        throw err
      }
      throw new AppError('errors.network')
    })
}
