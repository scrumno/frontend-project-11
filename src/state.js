import { proxy } from 'valtio/vanilla';

export const createState = () =>
  proxy({
    feeds: [],
    form: {
      /** @type {string | null} i18n-ключ ошибки yup (не локализованная строка) */
      errorKey: null,
    },
  });
