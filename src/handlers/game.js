const { Player } = require('../models/player.js');
const { createGameLink } = require('../utils/game.js');
const { lobbyPage } = require('../views/lobby.js');
const { landingPage } = require('../views/index.js');
const { gamePage } = require('../views/game.js');

const serveLandingPage = (req, res) => {
  const { playerName } = req.session;

  res.type('html');
  res.send(landingPage(playerName));
};

const serveGamePage = (req, res) => {
  res.type('text/html');
  res.end(gamePage());
};

const joinGame = (req, res) => {
  const {
    session: { playerId, playerName },
    params: { id }
  } = req;

  const game = req.app.games.find(id);

  if (!game) {
    return res.status(404).send('Game not found');
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
    const player = new Player(playerId, playerName);
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
    return res.status(404).send('Game not found');
  }

  const { host } = req.headers;
  const gameLink = createGameLink(host, game.id);

  res.type('text/html');
  res.send(lobbyPage(game, gameLink, playerName));
};

module.exports = {
  serveLandingPage,
  serveGamePage,
  joinGame,
  serveLobby
};
