const lodash = require('lodash');

const randomInt = (limit) => {
  return Math.floor(Math.random() * limit);
};

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

const hasLeftTile = (tilePos, rowSize) => {
  return tilePos % rowSize !== 0;
};

const hasRightTile = (tilePos, rowSize) => {
  return tilePos % rowSize !== rowSize - 1;
};

const hasTopTile = (tilePos, rowSize) => {
  return tilePos - rowSize >= 0;
};

const hasBottomTile = (tilePos, rowSize, colSize) => {
  return tilePos + rowSize < rowSize * colSize;
};

const findAdjancetTiles = (tileId, tiles) => {
  const adjancentTiles = [];
  const tilePos = tiles.findIndex(tile => tile.id === tileId);
  const rowSize = 12;
  const colSize = 9;

  if (hasLeftTile(tilePos, rowSize)) {
    const leftTile = tiles[tilePos - 1];
    adjancentTiles.push(leftTile);
  }

  if (hasRightTile(tilePos, rowSize)) {
    const rightTile = tiles[tilePos + 1];
    adjancentTiles.push(rightTile);
  }

  if (hasTopTile(tilePos, rowSize)) {
    const topTile = tiles[tilePos - rowSize];
    adjancentTiles.push(topTile);
  }

  if (hasBottomTile(tilePos, rowSize, colSize)) {
    const bottomTile = tiles[tilePos + rowSize];
    adjancentTiles.push(bottomTile);
  }

  return adjancentTiles;
};

const findPlacedTiles = (tileId, tiles) => {
  const adjancetTiles = findAdjancetTiles(tileId, tiles);
  return adjancetTiles.filter(tile => tile.placed);
};

const isTileExistIn = (tileId, tiles) =>
  tiles.findIndex(tile => tile.id === tileId) !== -1;

const storeInChain = (tiles, tilesChain) => tiles.forEach(tile => {
  if (isTileExistIn(tile.id, tilesChain)) {
    return;
  }

  tilesChain.push(tile);
});

const findTilesChain = (tileId, tiles) => {
  const tilesChain = [];

  const tile = tiles.find(tile => tile.id === tileId);
  tilesChain.push(tile);

  let index = 0;

  while (index < tilesChain.length) {
    const { id } = tilesChain[index];
    const placedTiles = findPlacedTiles(id, tiles);
    storeInChain(placedTiles, tilesChain);

    index++;
  }

  return tilesChain;
};

const getCorporations = (tiles, corporations) => {
  return corporations.filter(corporation => {
    return tiles.some(tile => corporation.hasTile(tile.id));
  });
};

const nextStep = (game, tileId) => {
  const tiles = game.board.tiles;
  const corporations = game.corporations;

  const placedTiles = findTilesChain(tileId, tiles);

  if (placedTiles.length === 1) {
    if (game.isAnyCorporationActive()) {
      game.buyStocksState();
      return { step: 'noEffect' };
    }
    game.drawTileState();
    return { step: 'noEffect' };
  }

  const activeCorporations = getCorporations(placedTiles, corporations);

  if (activeCorporations.length === 0) {
    if (game.isAnyCorporationInactive()) {
      game.buildState();
      return { step: 'build' };
    }
    game.buyStocksState();
    return { step: 'build' };
  }

  if (activeCorporations.length === 1) {
    game.buyStocksState();
    return { step: 'grow', corporations: activeCorporations, tiles: placedTiles };
  }

  if (activeCorporations.length >= 2) {
    game.buyStocksState();
    return { step: 'merge', corporations: activeCorporations, tiles: placedTiles };
  }

  return { step: '' };
};

const sortCorporations = (corporations) => {
  const sortedCorporations = lodash.sortBy(corporations, ({ tiles }) => {
    return tiles.length;
  });
  return sortedCorporations;
};

const tileLabel = (col, row) => `${col}${row}`;

const tileId = (col, row) => tileLabel(col, row).toLowerCase();

const createTiles = () => {
  const tiles = [];

  const rowId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
    for (let colIndex = 1; colIndex <= 12; colIndex++) {
      tiles.push({
        label: tileLabel(colIndex, rowId[rowIndex]),
        id: tileId(colIndex, rowId[rowIndex]),
        placed: false
      });
    }
  }
  return tiles;
};

const defunctStockHolder = (players, defunctId) => {
  const playerData = [];
  players.forEach(({ id, stocks }) => {
    const stock = stocks.find(({ corporationId }) => corporationId === defunctId);
    if (stock) {
      playerData.push({ id, stock });
    }
  });
  return lodash.sortBy(playerData, ({ stock }) => stock.count);
};

const findEqualStockHolders = (stockHolders) => {
  let index = stockHolders.length - 1;
  const bonusReceivers = [stockHolders[index]];

  while (index >= 0 && stockHolders[index - 1]) {
    if (stockHolders[index].stock.count !== stockHolders[index - 1].stock.count) {
      return bonusReceivers;
    }
    bonusReceivers.push(stockHolders[index - 1]);
    index--;
  }
  return bonusReceivers;
};

const findMajorityMinority = (stockHolders) => {
  const majority = findEqualStockHolders(stockHolders);
  const limit = stockHolders.length - majority.length;
  if (limit === 0) {
    return { majority };
  }
  const remStockHolders = stockHolders.slice(0, limit);
  const minority = findEqualStockHolders(remStockHolders);
  return { majority, minority };
};

module.exports = {
  getPlayer,
  getInitialTiles,
  createGameLink,
  nextStep,
  findAdjancetTiles,
  findPlacedTiles,
  findTilesChain,
  sortCorporations,
  randomInt,
  createTiles,
  defunctStockHolder,
  findMajorityMinority
};
