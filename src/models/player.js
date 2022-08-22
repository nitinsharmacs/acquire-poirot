const { randomInt } = require('../utils/game.js');

class Player {
  constructor(id, name, game) {
    this.id = id;
    this.name = name;
    this.game = game;
    this.tiles = [];
    this.money = 0;
    this.stocks = [];
  }

  #findTile(tileId) {
    return this.tiles.find(tile => tile.id === tileId);
  }

  #removeTile(tileId) {
    this.tiles = this.tiles.filter(tile => tile.id !== tileId);
  }

  getTile() {
    const tilePos = randomInt(this.game.cluster.length);
    const tile = this.game.cluster[tilePos];

    this.game.cluster.splice(tilePos, 1);
    this.tiles.push(tile);

    return tile;
  }

  drawTile() {
    const tile = this.getTile();
    this.game.logs.push(`${this.name} drew a tile`);

    return tile;
  }

  placeFirstTile() {
    const [tile] = this.tiles;
    this.game.board.placeTile(tile);
    this.game.logs.push(`${this.name} placed ${tile.id}`);
    this.tiles.splice(0, 1);
  }

  placeTile({ id }) {
    const tile = this.#findTile(id);
    this.game.board.placeTile(tile);
    this.game.logs.push(`${this.name} placed ${tile.id}`);

    this.#removeTile(id);
    return tile;
  }

  skipBuild() {
    this.game.logs.push(`${this.name} skipped building corporation`);
  }

  skipBuy() {
    this.game.logs.push(`${this.name} skipped buying stocks`);
  }

  addStocks({ id, name }, noOfStocks = 0) {
    const stocks = this.stocks.find(stock => stock.corporationId === id);

    if (stocks) {
      stocks.count += noOfStocks;
      return;
    }

    this.stocks.push({ corporationId: id, corporationName: name, count: noOfStocks });
  }

  deductMoney(toBeDeducted) {
    this.money -= toBeDeducted;
  }

  addMoney(toBeAdded) {
    this.money += toBeAdded;
  }

  getMoney() {
    return this.money;
  }
}

module.exports = { Player };
