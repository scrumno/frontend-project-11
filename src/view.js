import { subscribeKey } from 'valtio/vanilla/utils';

/**
 * Слой View: вотчеры Valtio → классы Bootstrap и текст ошибки.
 */
export const initFormView = (state, { input, feedback }) => {
  const sync = (error) => {
    if (error) {
      input.classList.add('is-invalid');
      feedback.textContent = error;
    } else {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
    }
  };

  subscribeKey(state.form, 'error', sync);
  sync(state.form.error);
};
