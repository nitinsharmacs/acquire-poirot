const getPlayer = (players, playerId) => {
  return players.find(player => player.id === playerId);
};

const getInitialTiles = (player) => {
  for (let index = 0; index < 6; index++) {
    player.getTile();
  }
};

const createGameLink = (host, gameId) => {
  return `http://${host}/join/${gameId}`;
};

const findAdjancetTiles = (tileId, tiles) => {
  const adjancentTiles = [];
  const tilePos = tiles.findIndex(tile => tile.id === tileId);
  const rowSize = 12;
  const colSize = 9;

  if (tilePos % rowSize !== 0) {
    const leftTile = tiles[tilePos - 1];
    adjancentTiles.push(leftTile);
  }

  if (tilePos % rowSize !== rowSize - 1) {
    const rightTile = tiles[tilePos + 1];
    adjancentTiles.push(rightTile);
  }

  if (tilePos - rowSize >= 0) {
    const topTile = tiles[tilePos - rowSize];
    adjancentTiles.push(topTile);
  }

  if (tilePos + rowSize < rowSize * colSize) {
    const bottomTile = tiles[tilePos + rowSize];
    adjancentTiles.push(bottomTile);
  }

  return adjancentTiles;
};

const findPlacedTiles = (tiles) => tiles.filter(tile => tile.placed);

const findInactiveCorporations = (corporations) =>
  corporations.filter(corporation => !corporation.active);

const areTilesBelongto = (tiles, corporations) => tiles.some(tile =>
  corporations.find(corporation => corporation.tiles.includes(tile)));

const nextMove = (game, tileId) => {
  const tiles = game.board.tiles;
  const corporations = game.corporations;

  const adjancetTiles = findAdjancetTiles(tileId, tiles);
  const placedTiles = findPlacedTiles(adjancetTiles);

  if (placedTiles.length < 1) {
    return { noEffect: true };
  }

  if (!areTilesBelongto(placedTiles, corporations)) {
    return { buildCorporation: true };
  }
};

const buildCorporation = (player, corporations, placedTiles, tile) => {
  const inactiveCorporations = findInactiveCorporations(corporations);
  const corporation = inactiveCorporations[0];
  corporation.active = true;
  corporation.tiles.push(tile, ...placedTiles);

  player.addStocks(corporation, 1);
};

module.exports = { getPlayer, getInitialTiles, createGameLink, nextMove, buildCorporation, findAdjancetTiles };
