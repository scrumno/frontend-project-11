import { proxy } from 'valtio/vanilla';

export const getRegisteredFeedUrls = (state) =>
  state.feeds.allIds.map((id) => state.feeds.byId[id].url);

export const createState = () =>
  proxy({
    feeds: {
      byId: {},
      allIds: [],
    },
    posts: {
      byId: {},
      allIds: [],
    },
    counters: {
      feed: 1,
      post: 1,
    },
    ui: {
      loading: false,
      /** @type {string | null} */
      loadErrorKey: null,
    },
    form: {
      /** @type {string | null} i18n-ключ ошибки yup */
      errorKey: null,
    },
  });
