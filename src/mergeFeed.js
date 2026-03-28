/**
 * Нормализованное добавление фида и его постов в состояние.
 */
export const mergeFeedAndPosts = (state, url, parsed) => {
  const feedId = `feed-${state.counters.feed}`;
  state.counters.feed += 1;

  state.feeds.byId[feedId] = {
    id: feedId,
    url,
    title: parsed.title,
    description: parsed.description,
  };
  state.feeds.allIds.push(feedId);

  parsed.items.forEach((item) => {
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
