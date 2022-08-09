const { Player } = require('../models/player.js');
const { lobbyPage } = require('../views/lobby.js');

const serveGamePage = (dataStore) => {
  const gamePage = dataStore.load('GAME_TEMPLATE_PATH');

  return (req, res, next) => {
    res.type('text/html');
    res.end(gamePage);
  };
};

const joinGame = (req, res) => {
  const { id } = req.params;
  const { playerName, playerId } = req.session;

  const game = req.app.games.find(id);
  if (!game) {
    return res.status(404).send('Game not found');
  }

  const player = new Player(playerId, playerName);
  game.addPlayer(player);

  req.session.gameId = id;
  req.session.save(() => {
    res.redirect('/lobby/' + id);
  });
};

const createGameLink = (host, gameId) => {
  return `http://${host}/lobby/${gameId}`;
};

const serveLobby = (req, res) => {
  const { id } = req.params;

  const game = req.app.games.find(id);
  if (!game) {
    return res.status(404).send('Game not found');
  }

  const { host } = req.headers;
  const gameLink = createGameLink(host, game.id);

  res.type('text/html');
  res.send(lobbyPage(game, gameLink));
};

module.exports = { serveGamePage, joinGame, serveLobby };
