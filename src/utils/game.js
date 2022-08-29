const lodash = require('lodash');

const randomInt = (limit) => {
  return Math.floor(Math.random() * limit);
};

const getPlayer = (players, playerId) => {
  return players.find(player => player.id === playerId);
};

const createGameLink = (host, gameId) => {
  return `http://${host}/join/${gameId}`;
};

const generateId = () => {
  return new Date().getTime().toString(16);
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

const haveStocks = (corporations) => {
  return corporations.some(corporation =>
    corporation.areStocksAvailable(1));
};

const nextStep = (game, tileId) => {
  const tiles = game.board.tiles;
  const corporations = game.corporations;

  const placedTiles = findTilesChain(tileId, tiles);

  if (placedTiles.length === 1) {
    if (game.canStocksBeBought()) {
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

    if (game.canStocksBeBought()) {
      game.buyStocksState();
      return { step: 'build' };
    }

    game.drawTileState();
    return { step: 'build' };
  }

  if (activeCorporations.length === 1) {
    if (game.canStocksBeBought()) {
      game.buyStocksState();
      return { step: 'grow', corporations: activeCorporations, tiles: placedTiles };
    }
    game.drawTileState();
    return { step: 'grow', corporations: activeCorporations, tiles: placedTiles };
  }

  if (activeCorporations.length >= 2) {
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

const defunctStocks = (stocks, defunctId) =>
  stocks.find(({ corporationId }) => corporationId === defunctId);

const sortStockHolders = (players) =>
  lodash.sortBy(players, ({ stock }) => stock.count);

const defunctStockHolder = (players, defunctId) => {
  const playerData = [];

  players.forEach(({ id, stocks }) => {
    const stock = defunctStocks(stocks, defunctId);
    if (stock) {
      playerData.push({ id, stock });
    }
  });
  return sortStockHolders(playerData);
};

const isStockCountEqual = (stockHolder1, stockHolder2) =>
  stockHolder1.stock.count === stockHolder2.stock.count;

const findEqualStockHolders = (stockHolders) => {
  let index = stockHolders.length - 1;
  const bonusReceivers = [stockHolders[index]];

  while (index >= 0 && stockHolders[index - 1]) {
    const currentHolder = stockHolders[index];
    const nextHolder = stockHolders[index - 1];

    if (!isStockCountEqual(currentHolder, nextHolder)) {
      return bonusReceivers;
    }
    bonusReceivers.push(nextHolder);
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

const distributeMoney = (stockHolders, money, bonusType) => {
  return stockHolders.map(({ id }) => {
    return { id, money, bonusType };
  });
};

const computeBonus = (stockHolders, bonus) => {
  const { majorityBonus, minorityBonus } = bonus;
  const { majority, minority } = findMajorityMinority(stockHolders);

  const bonusType = {
    majority: 'majority',
    minority: 'minority',
    both: 'majority and minority'
  };

  if (!minority || majority.length >= 2) {
    const money = (majorityBonus + minorityBonus) / majority.length;
    return distributeMoney(majority, money, bonusType.both);
  }

  if (minority.length >= 1) {
    const majorityHolders = distributeMoney(majority, majorityBonus, bonusType.majority);

    const money = minorityBonus / minority.length;
    const minorityHolders = distributeMoney(minority, money, bonusType.minority);

    return [...majorityHolders, ...minorityHolders];
  }
};

const areCorporationsSafe = corporations => {
  if (corporations.length < 1) {
    return false;
  }
  return corporations.every(corporation => corporation.isSafe());
};

const hasMoreThan40Tiles = corporations => {
  return corporations.some(corporation => corporation.getSize() > 40);
};

const safeCorporations = corporations =>
  corporations.filter(corporation => corporation.isSafe());

const areMultipleCorporationsStable = corporations => {
  if (safeCorporations(corporations).length <= 1) {
    return false;
  }
  return true;
};

module.exports = {
  getPlayer,
  createGameLink,
  generateId,
  nextStep,
  findAdjancetTiles,
  findPlacedTiles,
  findTilesChain,
  sortCorporations,
  randomInt,
  createTiles,
  defunctStockHolder,
  computeBonus,
  findMajorityMinority,
  areCorporationsSafe,
  hasMoreThan40Tiles,
  haveStocks,
  sortStockHolders,
  getCorporations,
  areMultipleCorporationsStable
};
