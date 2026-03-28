import './style.css';

import i18next from 'i18next';
import { ValidationError } from 'yup';

import { initI18n } from './i18n.js';
import { createState } from './state.js';
import { initFormView } from './view.js';
import { validateRssUrl } from './validation.js';

const mountApp = () => {
  const app = document.querySelector('#app');
  const t = (key) => i18next.t(key);

  app.innerHTML = `
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h1 class="h2 mb-4 text-center" data-i18n="header">${t('header')}</h1>
        <form id="rss-form" class="card shadow-sm" novalidate>
          <div class="card-body p-4">
            <div class="mb-3">
              <label for="rss-url" class="form-label fw-medium" data-i18n="form.rssUrlLabel">${t('form.rssUrlLabel')}</label>
              <input
                type="text"
                class="form-control form-control-lg"
                id="rss-url"
                name="url"
                placeholder="${t('form.placeholder')}"
                autocomplete="off"
                spellcheck="false"
                aria-describedby="rss-url-feedback"
              />
              <div id="rss-url-feedback" class="invalid-feedback" role="alert"></div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg w-100" data-i18n="form.addButton">${t('form.addButton')}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

  const refreshStaticTexts = () => {
    app.querySelector('[data-i18n="header"]').textContent = t('header');
    app.querySelector('[data-i18n="form.rssUrlLabel"]').textContent = t('form.rssUrlLabel');
    app.querySelector('[data-i18n="form.addButton"]').textContent = t('form.addButton');
    app.querySelector('#rss-url').placeholder = t('form.placeholder');
  };

  i18next.on('languageChanged', refreshStaticTexts);

  const state = createState();
  const form = document.querySelector('#rss-form');
  const input = document.querySelector('#rss-url');
  const feedback = document.querySelector('#rss-url-feedback');

  initFormView(state, { input, feedback });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.form.errorKey = null;

    validateRssUrl(state.feeds, input.value)
      .then((url) => {
        state.feeds.push(url);
        state.form.errorKey = null;
        input.value = '';
        input.focus();
        return url;
      })
      .catch((err) => {
        if (err instanceof ValidationError) {
          const [key] = err.errors;
          state.form.errorKey = key;
          return;
        }
        throw err;
      });
  });
};

initI18n().then(() => {
  mountApp();
});
