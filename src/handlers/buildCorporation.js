const { findPlacedTiles } = require('../utils/game.js');

const buildCorporation = (req, res, next) => {
  const { id, corporationId } = req.body;
  const { gameId, playerId } = req.session;
  const game = req.app.games.find(gameId);

  const player = game.players.find(player => player.id === playerId);
  const tile = game.board.tiles.find((tile) => tile.id === id);

  const corporation = game.corporations.find(corporation =>
    corporation.id === corporationId);

  corporation.active = true;
  const stocksCount = 1;
  game.logs.push(`${player.name} has built ${corporation.name}`);

  if (corporation.areStocksAvailable(stocksCount)) {
    player.addStocks(corporation, stocksCount);
    corporation.reduceStocks(stocksCount);
  }

  const placedTiles = findPlacedTiles(id, game.board.tiles);
  corporation.addTiles([tile, ...placedTiles]);
  res.json(corporation);
};

module.exports = { buildCorporation };
