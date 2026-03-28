import { Modal } from 'bootstrap';
import i18next from 'i18next';
import { subscribe } from 'valtio/vanilla';

const clear = (node) => {
  node.replaceChildren();
};

const renderFeeds = (state, root) => {
  clear(root);
  state.feeds.allIds.forEach((id) => {
    const f = state.feeds.byId[id];
    const item = document.createElement('li');
    item.className = 'list-group-item';

    const title = document.createElement('h3');
    title.className = 'h6 mb-1';
    title.textContent = f.title;

    const desc = document.createElement('p');
    desc.className = 'mb-0 small text-muted';
    desc.textContent = f.description;

    item.append(title, desc);
    root.append(item);
  });
};

const renderPosts = (state, root) => {
  clear(root);
  state.posts.allIds.forEach((id) => {
    const p = state.posts.byId[id];
    const row = document.createElement('li');
    row.className =
      'list-group-item d-flex justify-content-between align-items-center gap-2 flex-wrap';

    const titleLink = document.createElement('a');
    titleLink.href = p.link;
    titleLink.target = '_blank';
    titleLink.rel = 'noopener noreferrer';
    titleLink.className = p.read
      ? 'fw-normal flex-grow-1 text-break text-decoration-none link-secondary'
      : 'fw-bold flex-grow-1 text-break text-decoration-none';
    titleLink.textContent = p.title;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn btn-sm btn-outline-primary flex-shrink-0';
    btn.textContent = i18next.t('posts.preview');
    btn.dataset.postPreview = id;

    row.append(titleLink, btn);
    root.append(row);
  });
};

const syncPreviewModalChrome = (modalEl) => {
  const readFull = modalEl.querySelector('.post-preview-read-full');
  const closeBtn = modalEl.querySelector('.post-preview-close');
  const headerClose = modalEl.querySelector('.modal-header .btn-close');
  if (readFull) readFull.textContent = i18next.t('posts.readFull');
  if (closeBtn) closeBtn.textContent = i18next.t('posts.close');
  if (headerClose) headerClose.setAttribute('aria-label', i18next.t('posts.close'));
};

const fillPreviewBody = (container, text) => {
  container.replaceChildren();
  const raw = (text || '').trim();
  if (!raw) return;
  const parts = raw.split(/\n\n+/);
  parts.forEach((chunk, i) => {
    const p = document.createElement('p');
    p.className = i === parts.length - 1 ? 'mb-0' : 'mb-2';
    p.textContent = chunk.trim();
    container.append(p);
  });
};

export const initListsView = (state, { feedsRoot, postsRoot }) => {
  const modalEl = document.getElementById('modal');
  const modalTitle = modalEl.querySelector('.modal-title');
  const modalBody = modalEl.querySelector('.post-preview-body');
  const readFull = modalEl.querySelector('.post-preview-read-full');

  const bsModal = new Modal(modalEl);

  postsRoot.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-post-preview]');
    if (!btn) return;
    const postId = btn.dataset.postPreview;
    const post = state.posts.byId[postId];
    if (!post) return;

    post.read = true;
    modalTitle.textContent = post.title;
    fillPreviewBody(modalBody, post.description || '');
    readFull.href = post.link;

    bsModal.show();
  });

  const render = () => {
    renderFeeds(state, feedsRoot);
    renderPosts(state, postsRoot);
    syncPreviewModalChrome(modalEl);
  };

  subscribe(state, render);
  i18next.on('languageChanged', render);
  render();
};
