import i18next from 'i18next';
import { subscribeKey } from 'valtio/vanilla/utils';

/**
 * Слой View: вотчеры Valtio → классы Bootstrap и текст ошибки через i18next.
 */
export const initFormView = (state, { input, feedback }) => {
  const sync = (errorKey) => {
    if (errorKey) {
      input.classList.add('is-invalid');
      feedback.textContent = i18next.t(errorKey);
    } else {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
    }
  };

  subscribeKey(state.form, 'errorKey', sync);
  sync(state.form.errorKey);

  i18next.on('languageChanged', () => {
    sync(state.form.errorKey);
  });
};
