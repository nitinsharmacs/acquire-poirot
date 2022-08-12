const { findPlacedTiles } = require('../utils/game.js');

const buildCorporation = (req, res, next) => {
  const { tileId, corporationId } = req.body;
  const { gameId, playerId } = req.session;
  const game = req.app.games.find(gameId);

  const player = game.players.find(player => player.id === playerId);
  const tile = player.tiles.find((tile) => tile.id === tileId);

  const corporation = game.corporations.find(corporation =>
    corporation.id === corporationId);

  corporation.active = true;
  const stocksCount = 1;

  if (corporation.areStocksAvailable(stocksCount)) {
    player.addStocks(corporation, stocksCount);
    corporation.reduceStocks(stocksCount);
  }

  const placedTiles = findPlacedTiles(tileId, game.board.tiles);
  corporation.addTiles([tile, ...placedTiles]);

  res.end(corporationId);
};

module.exports = { buildCorporation };
