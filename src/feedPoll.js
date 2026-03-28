import { fetchRssXml } from './fetchRss.js';
import { parseRssXml } from './parse.js';

const POLL_INTERVAL_MS = 5000;

const collectLinksForFeed = (state, feedId) => {
  const links = new Set();
  state.posts.allIds.forEach((postId) => {
    const post = state.posts.byId[postId];
    if (post.feedId === feedId) {
      links.add(post.link);
    }
  });
  return links;
};

/**
 * Обновляет метаданные фида и добавляет только посты с новыми ссылками.
 */
export const mergePollIntoState = (state, feedId, parsed) => {
  const feed = state.feeds.byId[feedId];
  feed.title = parsed.title;
  feed.description = parsed.description;

  const knownLinks = collectLinksForFeed(state, feedId);

  parsed.items.forEach((item) => {
    if (knownLinks.has(item.link)) return;
    knownLinks.add(item.link);

    const postId = `post-${state.counters.post}`;
    state.counters.post += 1;
    state.posts.byId[postId] = {
      id: postId,
      feedId,
      title: item.title,
      link: item.link,
    };
    state.posts.allIds.push(postId);
  });
};

const pollOneFeed = (state, feedId) => {
  const { url } = state.feeds.byId[feedId];
  return fetchRssXml(url)
    .then(parseRssXml)
    .then((parsed) => {
      mergePollIntoState(state, feedId, parsed);
    })
    .catch(() => {
      /* фон: сбой сети/парсинга не ломает интерфейс */
    });
};

/**
 * Последовательный опрос всех фидов (без гонок по счётчику постов).
 */
export const runPollCycle = (state) => {
  const ids = [...state.feeds.allIds];
  return ids.reduce(
    (chain, feedId) => chain.then(() => pollOneFeed(state, feedId)),
    Promise.resolve(),
  );
};

/**
 * Рекурсивный setTimeout: следующий цикл только после завершения предыдущего.
 * При медленной сети циклы не накладываются (в отличие от setInterval).
 */
export const startFeedPolling = (state) => {
  const scheduleNext = () => {
    setTimeout(() => {
      runPollCycle(state).finally(() => {
        scheduleNext();
      });
    }, POLL_INTERVAL_MS);
  };

  scheduleNext();
};
