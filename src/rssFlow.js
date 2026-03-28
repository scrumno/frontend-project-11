import { fetchRssXml } from './fetchRss.js';
import { parseRssXml } from './parse.js';
import { validateRssUrl } from './validation.js';

const attachParsed = ({ url, xml }) =>
  Promise.resolve(xml).then(parseRssXml).then((parsed) => ({ url, parsed }));

/**
 * Пайплайн: валидация URL → загрузка XML → парсинг.
 */
export const loadFeedPayload = (registeredUrls, rawInput) =>
  Promise.resolve(rawInput)
    .then((raw) => validateRssUrl(registeredUrls, raw))
    .then((url) => fetchRssXml(url).then((xml) => ({ url, xml })))
    .then(attachParsed);
