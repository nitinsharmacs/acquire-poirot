class GameState {
  constructor({ player,
    players,
    board,
    cluster,
    logs,
    currentPlayer,
    corporations,
    gameSize,
    informationCard
  }) {
    this.player = player;
    this.players = players;
    this.board = board;
    this.cluster = cluster;
    this.logs = logs;
    this.currentPlayer = currentPlayer;
    this.corporations = corporations;
    this.step = 1;
    this.gameSize = gameSize;
    this.informationCard = informationCard;
  }

  isMyTurn() {
    return this.player.id === this.currentPlayer.id;
  }

  updateCorporation(id, tiles) {
    const corporation = this.corporations.find(corp => corp.id === id);
    corporation.tiles = tiles;
    corporation.active = true;
    corporation.stocksLeft--;
  }

  findCorporation(corporationId) {
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
      const corporation = this.findCorporation(corporationId);
      corporation.reduceStocks(numOfStocks);
      this.player.addStocks(corporation, numOfStocks);
      const stockPrice = this.calculateStockPrice(corporation);
      this.player.deductMoney(stockPrice * numOfStocks);
    });
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

  buildCorporation({ id }, corporation) {
    const tile = this.#findTile(id);

    tile.corporation = {
      name: corporation.name,
      id: corporation.id
    };
  }
}

class Player {
  constructor({ id, name, tiles, money, stocks }) {
    this.id = id;
    this.name = name;
    this.tiles = tiles || [];
    this.money = money || 6000;
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
  constructor({ id, name, stocksLeft, active, tiles }) {
    this.id = id;
    this.name = name;
    this.active = active;
    this.stocksLeft = stocksLeft;
    this.tiles = tiles;
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
    currentPlayer: game.currentPlayer,
    corporations: createCorporations(game.corporations),
    gameSize: game.gameSize,
    informationCard: game.informationCard
  });
};

