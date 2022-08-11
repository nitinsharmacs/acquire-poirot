const { nextMove, buildCorporation } = require('../utils/nextMove.js');

const onPlaceTiles = (game, player, tileId) => {
  const result = nextMove(game, tileId);
  const tile = game.board.tiles.find(tile => tile.id === tileId);

  if (result.buildCorporation) {
    buildCorporation(player, game.corporations, result.placedTiles, tile);
  }
};

module.exports = { onPlaceTiles };
