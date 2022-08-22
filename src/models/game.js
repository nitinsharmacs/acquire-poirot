const lodash = require('lodash');
const { Corporation } = require('./corporation.js');
const { createBoard } = require('./board.js');
const {
  findTilesChain,
  sortCorporations, createTiles, randomInt,
  defunctStockHolder,
  findMajorityMinority
} = require('../utils/game.js');
const { informationCard } = require('./informationCard.js');
const { Turn } = require('./turn.js');

const getSameRowTiles = (letter, tiles) => {
  return tiles.filter(tile => tile.id.includes(letter));
};

const isBetween = (number, { min, max }) => number >= min && number <= max;

const findNearestTile = (tiles) => {
  const sortedTilesByLetter = lodash.sortBy(tiles, ({ id }) => {
    const letter = id.slice(-1);
    return letter;
  });

  const nearestLetter = sortedTilesByLetter[0].id.slice(-1);
  const sameRowTiles = getSameRowTiles(nearestLetter, sortedTilesByLetter);
  const sortedTiles = lodash.sortBy(sameRowTiles, ({ id }) => {
    const num = +id.slice(0, id.length - 1);
    return num;
  });
  return sortedTiles[0];
};

class Game {
  constructor({ id,
    players,
    board,
    cluster,
    corporations,
    host,
    gameSize,
    informationCard
  }) {
    this.id = id;
    this.players = players;
    this.board = board;
    this.cluster = cluster;
    this.corporations = corporations;
    this.host = host;
    this.gameSize = gameSize;
    this.logs = [];
    this.started = false;
    this.informationCard = informationCard;
  }

  start() {
    this.started = true;
    this.turn = new Turn(this.players[0]);
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayers() {
    return this.players;
  }

  findCorporation(corporationId) {
    return this.corporations.find(({ id }) => id === corporationId);
  }

  reorder() {
    const playersTiles = this.players.map(player => player.tiles[0]);
    const nearestTile = findNearestTile(playersTiles);
    const nearestTilePos = playersTiles.findIndex((tile) => tile.id === nearestTile.id);
    this.players = this.players.slice(nearestTilePos).concat(this.players.slice(0, nearestTilePos));
  }

  changeTurn() {
    const currentPlayerPosition = this.players.findIndex(player => {
      return player.id === this.turn.player.id;
    });
    const totalPlayers = this.players.length;
    const nextPlayerPosition = (currentPlayerPosition + 1) % totalPlayers;
    this.turn = new Turn(this.players[nextPlayerPosition]);
  }

  isPlayerIdle(playerId) {
    return this.turn.player.id !== playerId;
  }

  hasStarted() {
    return this.started;
  }

  giveTile(player) {
    const tileIndex = randomInt(this.cluster.length);
    const tile = this.cluster[tileIndex];

    this.cluster.splice(tileIndex, 1);
    player.addTile(tile);
    return tile;
  }

  placeTile({ id }) {
    this.turn.player.removeTile(id);
    const tile = this.board.placeTile(id);
    this.logs.push(`${this.turn.player.name} placed ${id}`);
    return tile;
  }

  drawTile() {
    this.logs.push(`${this.turn.player.name} drew a tile`);
    return this.giveTile(this.turn.player);
  }

  calculateStockPrice(corporation) {
    const corporationSize = corporation.getSize();

    const corporationColumn = this.informationCard.find(column =>
      column.corporations.includes(corporation.id));

    const priceBySize = corporationColumn.pricesBySize.find(({ range }) => {
      return isBetween(corporationSize, range);
    });
    return priceBySize.stockPrice;
  }

  sellStocks(stocks) {
    const player = this.turn.player;
    const stockLogs = [];

    stocks.forEach(({ corporationId, numOfStocks }) => {
      const corporation = this.findCorporation(corporationId);
      corporation.reduceStocks(numOfStocks);
      player.addStocks(corporation, numOfStocks);
      player.deductMoney(this.calculateStockPrice(corporation) * numOfStocks);
      stockLogs.push(`${numOfStocks} stocks of ${corporation.name}`);
    });
    this.logs.push(`${player.name} bought ` + stockLogs.join(', '));
  }

  choosenStocksCost(stocks) {
    return stocks.reduce((requireMoney, { corporationId, numOfStocks }) => {
      const corporation = this.findCorporation(corporationId);
      const stockPrice = this.calculateStockPrice(corporation);
      return stockPrice * numOfStocks;
    }, 0);
  }

  isMoneySufficient(playerId, stocks) {
    const playerMoney = this.getPlayer(playerId).getMoney();
    const requiredMoney = this.choosenStocksCost(stocks);
    return playerMoney >= requiredMoney;
  }

  getPlayer(playerId) {
    return this.players.find(player => player.id === playerId);
  }

  playerExists(playerId) {
    return this.getPlayer(playerId) ? true : false;
  }

  getCorporation(corporationId) {
    return this.corporations.find(corporation =>
      corporation.id === corporationId);
  }

  buildCorporation(corporationId, tileId, playerId) {
    const corporation = this.getCorporation(corporationId);
    const player = this.getPlayer(playerId);

    const tiles = findTilesChain(tileId, this.board.tiles);
    corporation.addTiles(tiles);
    corporation.activate();

    const stocksCount = 1;
    if (corporation.areStocksAvailable(stocksCount)) {
      player.addStocks(corporation, stocksCount);
      corporation.reduceStocks(stocksCount);
    }
    this.logs.push(`${player.name} built ${corporation.name} on ${tileId}`);

    return corporation;
  }

  determineSafe(corporation) {
    if (corporation.isSafeCorporation()) {
      this.logs.push(`${corporation.name} is safe`);
    }
  }

  buildState() {
    this.turn.buildState();
  }

  mergeState() {
    this.turn.mergeState();
  }

  buyStocksState() {
    this.turn.buyStocksState();
  }

  drawTileState() {
    this.turn.drawTileState();
  }

  isAnyCorporationActive() {
    return this.corporations.some(corporation => corporation.active);
  }

  isAnyCorporationInactive() {
    return this.corporations.some(corporation => !corporation.active);
  }

  skipBuy() {
    this.turn.player.skipBuy();
  }

  skipBuild() {
    this.turn.player.skipBuild();
  }

  // merge corporations ---------

  #calculateBonus(corporation) {
    const corporationSize = corporation.getSize();

    const corporationColumn = this.informationCard.find(column =>
      column.corporations.includes(corporation.id));

    const priceBySize = corporationColumn.pricesBySize.find(({ range }) => {
      return isBetween(corporationSize, range);
    });

    const { majority, minority } = priceBySize;
    return { majorityBonus: majority, minorityBonus: minority };
  }

  #distributeBonus(stockHolder, bonus) {
    if (!stockHolder) {
      return;
    }
    stockHolder.forEach(({ id }) => {
      const player = this.getPlayer(id);
      if (player) {
        player.money += bonus / stockHolder.length;
      }
    });
  }

  merge(corporations, tiles) {
    const [smallCorp, bigCorp] = sortCorporations(corporations);
    this.logs.push(`${bigCorp.name} acquired ${smallCorp.name}`);

    const stockHolders = defunctStockHolder(this.players, smallCorp.id);
    const { majority, minority } = findMajorityMinority(stockHolders);
    const { majorityBonus, minorityBonus } = this.#calculateBonus(smallCorp);

    this.#distributeBonus(majority, majorityBonus);
    this.#distributeBonus(minority, minorityBonus);
    bigCorp.grow(tiles);
    smallCorp.defunct();
  }

  // getters ---------------

  get state() {
    return this.turn.state;
  }

  isHost(playerId) {
    return this.host.id === playerId;
  }

  drawInitialTiles() {
    this.players.forEach(player => {
      this.logs.push(`${player.name} drew a tile`);
      this.giveTile(player);
    });
  }

  setup() {
    this.players.forEach(player => {
      const tile = player.placeFirstTile();
      this.board.placeTile(tile.id);
      this.logs.push(`${player.name} placed ${tile.id}`);
      player.addMoney(6000);

      for (let index = 0; index < 6; index++) {
        this.giveTile(player);
      }
    });
  }
}

const createCorporations = () => {
  const corporations = [
    {
      id: 'america',
      name: 'America'
    },
    {
      id: 'hydra',
      name: 'Hydra'
    },
    {
      id: 'fusion',
      name: 'Fusion'
    },
    {
      id: 'zeta',
      name: 'Zeta'
    },
    {
      id: 'quantum',
      name: 'Quantum'
    },
    {
      id: 'phoenix',
      name: 'Phoenix'
    },
    {
      id: 'sackson',
      name: 'Sackson'
    }
  ];

  return corporations.map(corporation =>
    new Corporation(
      corporation.id,
      corporation.name
    ));
};

const newGame = (id, host, gameSize) => {
  const board = createBoard();
  const cluster = createTiles();
  const corporations = createCorporations();

  return new Game({
    id,
    host,
    players: [],
    board,
    cluster,
    corporations,
    gameSize,
    informationCard
  });
};

module.exports = { Game, newGame, createCorporations };
