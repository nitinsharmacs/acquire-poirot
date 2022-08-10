const loadGame = (req, res) => {
  const { gameId } = req.session;

  const game = req.app.games.find(gameId);
  if (!game) {
    return res.status(404).send('Game not found');
  }

  res.json({
    game: {
      ...game,
      players: game.players.map(player => {
        return { ...player, game: undefined };
      }),
      currentPlayer: { ...game.currentPlayer, game: undefined },
    },
    playerId: req.session.playerId
  });
};

const getInitialTiles = (player) => {
  for (let index = 0; index < 6; index++) {
    player.getTile();
  }
};

const startGame = (req, res) => {
  const { gameId } = req.session;

  const game = req.app.games.find(gameId);
  if (!game) {
    return res.status(404).send('Game not found');
  }

  if (game.host.id === req.session.playerId) {
    game.players.forEach(player => {
      player.getTile();
    });

    game.reorder();

    game.players.forEach(player => {
      player.placeTile();
      player.money = 6000;
      getInitialTiles(player);
    });
  }
  res.json({ message: 'success' });
};

module.exports = { loadGame, startGame };
