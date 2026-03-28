import './style.css';

import i18next from 'i18next';
import { ValidationError } from 'yup';

import { AppError } from './errors.js';
import { startFeedPolling } from './feedPoll.js';
import { initI18n } from './i18n.js';
import { initListsView } from './listsView.js';
import { mergeFeedAndPosts } from './mergeFeed.js';
import { loadFeedPayload } from './rssFlow.js';
import { createState, getRegisteredFeedUrls } from './state.js';
import { initFormView } from './view.js';

const mountApp = () => {
  const app = document.querySelector('#app');
  const t = (key) => i18next.t(key);

  app.innerHTML = `
  <div class="container py-5">
    <h1 class="h2 mb-4 text-center" data-i18n="header">${t('header')}</h1>
    <div class="row g-4 justify-content-center">
      <div class="col-12 col-xl-10">
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
            <div id="rss-load-alert" class="alert alert-danger d-none mb-3" role="alert"></div>
            <button type="submit" class="btn btn-primary btn-lg w-100" id="rss-submit" data-i18n="form.addButton">${t('form.addButton')}</button>
          </div>
        </form>
      </div>
      <div class="col-12 col-md-6 col-xl-5">
        <h2 class="h5 mb-3">Фиды</h2>
        <div id="feeds-list" class="list-group shadow-sm"></div>
      </div>
      <div class="col-12 col-md-6 col-xl-5">
        <h2 class="h5 mb-3">Посты</h2>
        <div id="posts-list" class="list-group shadow-sm"></div>
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
  const submitBtn = document.querySelector('#rss-submit');
  const loadAlert = document.querySelector('#rss-load-alert');
  const feedsRoot = document.querySelector('#feeds-list');
  const postsRoot = document.querySelector('#posts-list');

  initFormView(state, { input, feedback, submitBtn, loadAlert, form });
  initListsView(state, { feedsRoot, postsRoot });
  startFeedPolling(state);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.form.errorKey = null;
    state.ui.loadErrorKey = null;
    state.ui.loading = true;

    loadFeedPayload(getRegisteredFeedUrls(state), input.value)
      .then(({ url, parsed }) => {
        mergeFeedAndPosts(state, url, parsed);
        state.ui.loadErrorKey = null;
        input.value = '';
        input.focus();
      })
      .catch((err) => {
        if (err instanceof ValidationError) {
          const [key] = err.errors;
          state.form.errorKey = key;
          return;
        }
        if (err instanceof AppError) {
          state.ui.loadErrorKey = err.key;
          return;
        }
        throw err;
      })
      .finally(() => {
        state.ui.loading = false;
      });
  });
};

initI18n().then(() => {
  mountApp();
});
