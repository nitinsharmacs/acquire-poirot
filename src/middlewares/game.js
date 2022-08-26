const injectGame = (req, res, next) => {
  const { gameId } = req.session;

  const game = req.app.games.find(gameId);
  if (!game) {
    return res.status(404).render('notFound', { isNotFoundPage: false });
  }

  req.game = game;
  next();
};

module.exports = { injectGame };
