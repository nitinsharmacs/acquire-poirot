const { newGame } = require('../models/game.js');
const { Player } = require('../models/player.js');
const { generateId } = require('../utils/game.js');
const { hostPage } = require('../views/hostPage.js');

const isPlayersCountValid = (noOfPlayers) =>
  noOfPlayers >= 3 && noOfPlayers <= 6;

const hostGame = (req, res) => {
  if (!req.session.playerId) {
    res.redirect('/login?ref=host');
    return;
  }

  const { noOfPlayers } = req.body;
  const { playerName, playerId } = req.session;

  if (!isPlayersCountValid(noOfPlayers)) {
    const message = 'Please enter valid number of players';
    const hostPageTemplate = hostPage(playerName, message);
    res.type('text/html');
    res.end(hostPageTemplate);
    return;
  }

  const game = newGame(generateId(),
    {
      name: playerName,
      id: playerId
    },
    +noOfPlayers
  );
  const gameHost = new Player({ id: playerId, name: playerName });
  game.addPlayer(gameHost);

  const games = req.app.games;

  const existingGame = games.findByHost(playerId);
  if (existingGame) {
    return res.redirect('/join/' + existingGame.id);
  }
  req.app.games.add(game);

  req.session.gameId = game.id;
  req.session.save(() => {
    res.redirect('/lobby/' + game.id);
  });
};

module.exports = { hostGame };
