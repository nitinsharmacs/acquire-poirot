const isBetween = (number, { min, max }) => number >= min && number <= max;

class GameState {
  constructor({ player,
    players,
    board,
    cluster,
    logs,
    corporations,
    gameSize,
    turn,
    informationCard
  }) {
    this.player = player;
    this.players = players;
    this.board = board;
    this.cluster = cluster;
    this.logs = logs;
    this.corporations = corporations;
    this.gameSize = gameSize;
    this.informationCard = informationCard;
    this.turn = turn;
  }

  isMyTurn() {
    return this.player.id === this.turn.playerId;
  }

  isCurrentPlayer(player) {
    return player.id === this.player.id;
  }

  getInactiveCorporation() {
    return this.corporations.find(corporation => !corporation.active);
  }

  buildCorporation(corporationId, marketPrice, tiles) {
    const corporation = this.#findCorporation(corporationId);

    corporation.tiles = tiles;
    corporation.marketPrice = marketPrice;
    corporation.active = true;
    corporation.stocksLeft--;
    this.player.addStocks(corporation, 1);
  }

  drawTile(tileId) {
    const tile = this.cluster.find(tile => tile.id === tileId);
    this.player.drawTile(tile);
  }

  placeTile(tileId) {
    this.player.placeTile(tileId, this.board);
  }

  #findCorporation(corporationId) {
    return this.corporations.find(({ id }) => id === corporationId);
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
    stocks.forEach(({ corporationId, numOfStocks }) => {
      const corporation = this.#findCorporation(corporationId);
      corporation.reduceStocks(numOfStocks);
      this.player.addStocks(corporation, numOfStocks);
      const stockPrice = this.calculateStockPrice(corporation);
      this.player.deductMoney(stockPrice * numOfStocks);
    });
  }

  updateStage(newStage) {
    this.turn.stage = newStage;
  }

  updateCurrentPlayerMoney(money) {
    this.player.money = money;
  }

  updateCorporations(corporations) {
    corporations.forEach(({ id, tiles, active, marketPrice }) => {
      const corporation = this.#findCorporation(id);
      corporation.tiles = tiles;
      corporation.active = active;
      corporation.marketPrice = marketPrice;
    });
  }

  updateLogs(logs) {
    this.logs = logs;
  }

  isInPlaceTileState() {
    return this.turn.stage === 'place-tile';
  }

  isInBuildState() {
    return this.turn.stage === 'build';
  }

  isInPollingState() {
    return this.turn.stage === 'polling';
  }

  isInTransactionState() {
    return this.turn.stage === 'transaction';
  }

  isInBuyState() {
    return this.turn.stage === 'buy-stocks';
  }

  isInDrawTileState() {
    return this.turn.stage === 'draw-tile';
  }

  isInEndGameStage() {
    return this.turn.stage === 'end-game';
  }

  getActiveCorporations() {
    return this.corporations.filter(corporation => corporation.active);
  }

  availableToBuy() {
    return this.getActiveCorporations().filter(
      ({ stocksLeft }) => stocksLeft > 0);
  }
}

class Board {
  constructor({ tiles }) {
    this.tiles = tiles;
  }

  #findTile(tileId) {
    return this.tiles.find(tile => tile.id === tileId);
  }

  placeTile({ id }) {
    const tile = this.#findTile(id);
    tile.placed = true;
  }
}

class Player {
  constructor({ id, name, tiles, money, stocks }) {
    this.id = id;
    this.name = name;
    this.tiles = tiles || [];
    this.money = money;
    this.stocks = stocks;
  }

  #removeTile({ id }) {
    this.tiles = this.tiles.filter(tile => tile.id !== id);
  }

  placeTile(tileId, board) {
    this.#removeTile({ id: tileId });
    board.placeTile({ id: tileId });
  }

  drawTile(tile) {
    this.tiles.push(tile);
  }

  addStocks({ id, name }, noOfStocks = 0) {
    const stocks = this.stocks.find(stock => stock.corporationId === id);

    if (stocks) {
      stocks.count += noOfStocks;
      return;
    }

    this.stocks.push(
      { corporationId: id, corporationName: name, count: noOfStocks });
  }

  deductMoney(toBeDeducted) {
    this.money -= toBeDeducted;
  }
}

const createPlayer = ({ player }) => {
  return new Player({
    id: player.id,
    name: player.name,
    tiles: player.tiles,
    money: player.money,
    stocks: player.stocks,
  });
};

class Corporation {
  constructor({ id, name, stocksLeft, active, tiles, marketPrice }) {
    this.id = id;
    this.name = name;
    this.active = active;
    this.stocksLeft = stocksLeft;
    this.tiles = tiles;
    this.marketPrice = marketPrice;
  }

  reduceStocks(count) {
    this.stocksLeft -= count;
  }

  getSize() {
    return this.tiles.length;
  }
}

const createCorporations = (corporations) => {
  return corporations.map(corporation => new Corporation(corporation));
};

const createState = (game) => {
  return new GameState({
    player: createPlayer(game),
    players: game.players,
    board: new Board(game.board),
    cluster: game.cluster,
    logs: game.logs,
    corporations: createCorporations(game.corporations),
    gameSize: game.gameSize,
    informationCard: game.informationCard,
    turn: game.turn
  });
};

