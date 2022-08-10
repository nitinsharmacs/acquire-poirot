const fs = require('fs');
const { newGame } = require('../models/game.js');
const { Player } = require('../models/player.js');

const generateId = () => {
  return new Date().getTime().toString(16);
};

const hostGame = (dataStore) => (req, res) => {
  if (!req.session.playerId) {
    res.redirect('/login?ref=host');
    return;
  }

  const { noOfPlayers } = req.body;
  const { playerName, playerId } = req.session;

  if (!noOfPlayers || !isFinite(noOfPlayers)) {
    const hostPage = dataStore.load('HOST_TEMPLATE_PATH');
    const errorHost = hostPage.replace('_MESSAGE_', 'Please enter valid number of players');
    res.type('text/html');
    res.end(errorHost);
    return;
  }

  const game = newGame(generateId(),
    {
      name: playerName,
      id: playerId
    },
    +noOfPlayers);
  const gameHost = new Player(playerId, playerName, game);
  game.addPlayer(gameHost);

  req.app.games.add(game);

  req.session.gameId = game.id;
  req.session.save(() => {
    res.redirect('/lobby/' + game.id);
  });
};

module.exports = { hostGame };
