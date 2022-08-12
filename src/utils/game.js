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

const findPlacedTiles = (tileId, tiles) => {
  const adjancetTiles = findAdjancetTiles(tileId, tiles);
  return adjancetTiles.filter(tile => tile.placed);
};

const areTilesBelongto = (tiles, corporations) => tiles.some(tile =>
  corporations.find(corporation => corporation.tiles.includes(tile)));

const nextMove = (game, tileId) => {
  const tiles = game.board.tiles;
  const corporations = game.corporations;

  const placedTiles = findPlacedTiles(tileId, tiles);

  if (placedTiles.length < 1) {
    return { case: 'noEffect' };
  }

  if (!areTilesBelongto(placedTiles, corporations)) {
    return { case: 'build' };
  }
};

module.exports = { getPlayer, getInitialTiles, createGameLink, nextMove, findAdjancetTiles, findPlacedTiles };
