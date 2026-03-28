import axios from 'axios';

import { AppError } from './errors.js';

const buildProxyUrl = (feedUrl) =>
  `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}&_=${Date.now()}`;

/**
 * Загрузка тела RSS через прокси All Origins (уникальный query — без кеша на стороне прокси).
 * @param {string} feedUrl
 * @returns {Promise<string>}
 */
export const fetchRssXml = (feedUrl) => {
  const url = buildProxyUrl(feedUrl);
  return axios
    .get(url, {
      timeout: 20000,
      responseType: 'text',
      transitional: { forcedJSONParsing: false },
    })
    .then((response) => {
      const { data } = response;
      if (typeof data !== 'string') {
        throw new AppError('errors.invalidRss');
      }
      return data;
    })
    .catch((err) => {
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError('errors.network');
    });
};
