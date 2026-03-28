import * as yup from 'yup';

const trim = (value) => value.trim();

const buildSchema = (feeds) =>
  yup
    .string()
    .required('Не должно быть пустым')
    .url('Ссылка должна быть валидным URL')
    .test(
      'no-duplicate',
      'RSS уже существует',
      (value) =>
        new Promise((resolve) => {
          resolve(!feeds.includes(value));
        }),
    );

const validateWithFeeds = (feeds) => (value) => buildSchema(feeds).validate(value);

/**
 * Пайплайн: обрезка → асинхронная валидация yup (в т.ч. дубликаты).
 * @param {string[]} feeds
 * @param {string} rawInput
 * @returns {Promise<string>}
 */
export const validateRssUrl = (feeds, rawInput) =>
  Promise.resolve(rawInput).then(trim).then(validateWithFeeds(feeds));
