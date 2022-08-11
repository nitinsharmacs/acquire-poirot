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
    player.drawTile();
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
      player.drawTile();
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

const drawTile = (req, res) => {
  const { game } = req;
  const { playerId } = req.session;

  if (game.isPlayerIdle(playerId)) {
    return res.status(400).json({ message: 'Can\'t draw a tile' });
  }

  const tile = game.currentPlayer.drawTile();
  res.json({ data: tile, message: 'Drawn a tile' });
};

const placeTile = (req, res) => {
  const { tileId } = req.body;
  const { gameId, playerId } = req.session;
  const game = req.app.games.find(gameId);

  const player = game.players.find(player => player.id === playerId);
  const tilePos = player.tiles.findIndex((tile) => tile.id === tileId);

  player.tiles.splice(tilePos, 1);
  game.board.placeTile({ id: tileId });
  res.json({ message: 'success' });
};

module.exports = { loadGame, startGame, drawTile, placeTile };
