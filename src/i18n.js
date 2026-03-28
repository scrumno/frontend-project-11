import i18next from 'i18next';
import { setLocale } from 'yup';

import ru from './locales/ru.json';

const applyYupLocaleKeys = () => {
  setLocale({
    mixed: {
      required: 'validation.empty',
    },
    string: {
      url: 'validation.invalidUrl',
    },
  });
};

export const initI18n = () =>
  i18next
    .init({
      lng: 'ru',
      fallbackLng: 'ru',
      resources: {
        ru: { translation: ru },
      },
      interpolation: { escapeValue: false },
    })
    .then(() => {
      applyYupLocaleKeys();
      return i18next;
    });
