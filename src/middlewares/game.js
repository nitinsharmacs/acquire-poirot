const injectGame = (req, res, next) => {
  const { gameId } = req.session;

  const game = req.app.games.find(gameId);
  if (!game) {
    return res.status(404).render('notFound', { isNotFoundPage: false });
  }

  req.game = game;
  next();
};

const gameStartRestriction = (req, res, next) => {
  const { game } = req;
  if (!game.hasStarted()) {
    return res.redirect(`/lobby/${game.id}`);
  }
  next();
};

module.exports = { injectGame, gameStartRestriction };
