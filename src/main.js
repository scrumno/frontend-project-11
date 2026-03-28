import './style.css';

import { ValidationError } from 'yup';

import { createState } from './state.js';
import { initFormView } from './view.js';
import { validateRssUrl } from './validation.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h1 class="h2 mb-4 text-center">RSS Агрегатор</h1>
        <form id="rss-form" class="card shadow-sm" novalidate>
          <div class="card-body p-4">
            <div class="mb-3">
              <label for="rss-url" class="form-label fw-medium">Ссылка RSS</label>
              <input
                type="text"
                class="form-control form-control-lg"
                id="rss-url"
                name="url"
                placeholder="https://example.com/feed.xml"
                autocomplete="off"
                spellcheck="false"
                aria-describedby="rss-url-feedback"
              />
              <div id="rss-url-feedback" class="invalid-feedback" role="alert"></div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg w-100">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

const state = createState();
const form = document.querySelector('#rss-form');
const input = document.querySelector('#rss-url');
const feedback = document.querySelector('#rss-url-feedback');

initFormView(state, { input, feedback });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  state.form.error = null;

  validateRssUrl(state.feeds, input.value)
    .then((url) => {
      state.feeds.push(url);
      state.form.error = null;
      input.value = '';
      input.focus();
      return url;
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        const [message] = err.errors;
        state.form.error = message;
        return;
      }
      throw err;
    });
});
