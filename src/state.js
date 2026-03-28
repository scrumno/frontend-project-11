import { proxy } from 'valtio/vanilla';

export const createState = () =>
  proxy({
    feeds: [],
    form: {
      error: null,
    },
  });
