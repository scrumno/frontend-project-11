import './style.css';

const app = document.querySelector('#app');

app.innerHTML = `
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <h1 class="h2 mb-4 text-center">RSS Агрегатор</h1>
        <form id="rss-form" class="card shadow-sm">
          <div class="card-body p-4">
            <label for="rss-url" class="form-label fw-medium">Ссылка на RSS-поток</label>
            <input
              type="url"
              class="form-control form-control-lg mb-3"
              id="rss-url"
              name="url"
              placeholder="https://example.com/feed.xml"
              required
            />
            <button type="submit" class="btn btn-primary btn-lg w-100">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

const form = document.querySelector('#rss-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = document.querySelector('#rss-url');
  const url = input.value.trim();
  if (!url) return;
  Promise.resolve(url).then(() => {
    // Дальнейшая обработка RSS — в следующих шагах (цепочки .then(), без async/await)
  });
});
