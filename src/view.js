import i18next from 'i18next';
import { subscribeKey } from 'valtio/vanilla/utils';

const syncLoadAlert = (loadErrorEl, key) => {
  if (key) {
    loadErrorEl.classList.remove('d-none');
    loadErrorEl.textContent = i18next.t(key);
  } else {
    loadErrorEl.classList.add('d-none');
    loadErrorEl.textContent = '';
  }
};

const syncSuccessAlert = (successEl, key) => {
  if (key) {
    successEl.classList.remove('d-none');
    successEl.textContent = i18next.t(key);
  } else {
    successEl.classList.add('d-none');
    successEl.textContent = '';
  }
};

/**
 * Слой View: валидация формы, ошибки загрузки/парсинга, блокировка при запросе.
 */
export const initFormView = (state, { input, feedback, submitBtn, loadAlert, successAlert, form }) => {
  const syncValidation = (errorKey) => {
    if (errorKey) {
      input.classList.add('is-invalid');
      feedback.textContent = i18next.t(errorKey);
    } else {
      input.classList.remove('is-invalid');
      feedback.textContent = '';
    }
  };

  const syncLoading = (loading) => {
    submitBtn.disabled = loading;
    input.disabled = loading;
    form.setAttribute('aria-busy', loading ? 'true' : 'false');
  };

  subscribeKey(state.form, 'errorKey', syncValidation);
  subscribeKey(state.ui, 'loadErrorKey', (key) => syncLoadAlert(loadAlert, key));
  subscribeKey(state.ui, 'successKey', (key) => syncSuccessAlert(successAlert, key));
  subscribeKey(state.ui, 'loading', syncLoading);

  syncValidation(state.form.errorKey);
  syncLoadAlert(loadAlert, state.ui.loadErrorKey);
  syncSuccessAlert(successAlert, state.ui.successKey);
  syncLoading(state.ui.loading);

  const onLang = () => {
    syncValidation(state.form.errorKey);
    syncLoadAlert(loadAlert, state.ui.loadErrorKey);
    syncSuccessAlert(successAlert, state.ui.successKey);
  };
  i18next.on('languageChanged', onLang);
};
