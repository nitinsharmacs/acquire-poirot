const { createGameDAO } = require('../models/gameDAO.js');
const { getPlayer, getInitialTiles, nextMove } = require('../utils/game.js');

const loadGame = (req, res) => {
  const { game, session: { playerId } } = req;

  if (!game) {
    return res.status(404).send('Game not found');
  }

  res.json({ game: createGameDAO(game, playerId) });
};

const startGame = (req, res) => {
  const { game } = req;

  if (game.host.id !== req.session.playerId) {
    return res.status(400).json({ message: 'Only host can start game' });
  }

  game.players.forEach(player => player.drawTile());

  game.reorder();

  game.players.forEach(player => {
    player.placeFirstTile();
    player.money = 6000;
    getInitialTiles(player);
  });

  game.start();

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
  const {
    game,
    session: { playerId },
    body: { id }
  } = req;

  const player = getPlayer(game.players, playerId);

  const nextStep = nextMove(game, id);
  const tile = player.placeTile({ id });
  res.json({ data: tile, message: 'success', case: nextStep.case });
};

const changeTurn = (req, res) => {
  const { game } = req;
  game.changeTurn();
  res.json({ message: 'success' });
};

module.exports = { loadGame, startGame, drawTile, placeTile, changeTurn };
