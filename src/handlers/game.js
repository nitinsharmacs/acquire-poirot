const serveGamePage = (dataStore) => {
  const gamePage = dataStore.load('GAME_TEMPLATE_PATH');

  return (req, res, next) => {
    res.type('text/html');
    res.end(gamePage);
  };
};

module.exports = { serveGamePage };
