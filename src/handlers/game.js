const { Player } = require('../models/player.js');
const { createGameLink } = require('../utils/game.js');
const { savePage, restorePage } = require('../views/saveGame.js');

const serveLandingPage = (req, res) => {
  const { playerName } = req.session;
  res.render('index', { playerName });
};
const serveInstructionPage = (req, res) => {
  const { playerName } = req.session;
  res.render('howToPlay', { playerName });
};

const serveGamePage = (req, res) => {
  res.render('gamePage');
};

const joinGame = (req, res) => {
  const {
    session: { playerId, playerName },
    params: { id }
  } = req;

  const game = req.app.games.find(id);

  if (!game) {
    return res.status(404).render('notFound', { isNotFoundPage: false });
  }

  const playerExists = game.playerExists(playerId);

  if (playerExists && game.hasStarted()) {
    req.session.gameId = id;
    req.session.save(() => {
      res.redirect('/game');
    });
    return;
  }

  if (!playerExists && game.hasStarted()) {
    return res.redirect('/');
  }

  if (!playerExists) {
    const player = new Player({ id: playerId, name: playerName });
    game.addPlayer(player);
  }

  req.session.gameId = id;
  req.session.save(() => {
    res.redirect('/lobby/' + id);
  });
};

const serveLobby = (req, res) => {
  const {
    session: { playerName },
    params: { id }
  } = req;

  const game = req.app.games.find(id);
  if (!game) {
    return res.status(404).render('gameNotFound');
  }

  const { host } = req.headers;
  const gameLink = createGameLink(host, game.id);

  res.render('lobby', { game, gameLink, playerName });
};

// only for developers. DON'T POKE HOLES :)
const serveSavePage = (req, res) => {
  const { session: { playerName } } = req;

  res.type('text/html');
  res.end(savePage(playerName));
};

const serveRestorePage = (req, res) => {
  const { session: { playerName },
    app: { games },
  } = req;

  res.type('text/html');
  res.end(restorePage(games.savedGamesEntries(), playerName));
};

const saveGame = (req, res) => {
  const { session: { gameId },
    app: { games },
    body: { title }
  } = req;
  games.save(gameId, title);

  res.send('saved game');
};

const restoreGame = (req, res) => {
  const { body: { gameId }, app: { games } } = req;

  games.restore(gameId);
  req.session.gameId = gameId;
  req.session.save(() => {
    res.redirect('/game');
  });
};

module.exports = {
  serveLandingPage,
  serveGamePage,
  serveSavePage,
  serveRestorePage,
  joinGame,
  serveLobby,
  saveGame,
  restoreGame,
  serveInstructionPage
};
