import { subscribe } from 'valtio/vanilla';

const clear = (node) => {
  node.replaceChildren();
};

const renderFeeds = (state, root) => {
  clear(root);
  state.feeds.allIds.forEach((id) => {
    const f = state.feeds.byId[id];
    const item = document.createElement('div');
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
    const link = document.createElement('a');
    link.className = 'list-group-item list-group-item-action';
    link.href = p.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = p.title;
    root.append(link);
  });
};

export const initListsView = (state, { feedsRoot, postsRoot }) => {
  const render = () => {
    renderFeeds(state, feedsRoot);
    renderPosts(state, postsRoot);
  };

  subscribe(state, render);
  render();
};
