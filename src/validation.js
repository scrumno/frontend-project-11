import * as yup from 'yup'

const trim = value => value.trim()

const buildSchema = feeds =>
  yup
    .string()
    .required()
    .url()
    .test(
      'no-duplicate',
      'validation.duplicate',
      value =>
        new Promise((resolve) => {
          resolve(!feeds.includes(value))
        }),
    )

const validateWithFeeds = feeds => value => buildSchema(feeds).validate(value)

/**
 * Пайплайн: обрезка → асинхронная валидация yup (сообщения — ключи для i18next).
 * @param {string[]} feeds
 * @param {string} rawInput
 * @returns {Promise<string>}
 */
export const validateRssUrl = (feeds, rawInput) =>
  Promise.resolve(rawInput).then(trim).then(validateWithFeeds(feeds))
