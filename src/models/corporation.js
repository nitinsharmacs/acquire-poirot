const lodash = require('lodash');
class Corporation {
  #isSafe;
  constructor({
    id,
    name,
    active = false,
    stocksLeft = 25,
    tiles = [],
    isSafe = false,
    marketPrice = {}
  }) {
    this.id = id;
    this.name = name;
    this.active = active;
    this.stocksLeft = stocksLeft;
    this.tiles = tiles;
    this.#isSafe = isSafe;
    this.marketPrice = marketPrice;
  }

  areStocksAvailable(count) {
    return this.stocksLeft >= count;
  }

  addStocks(count) {
    this.stocksLeft += count;
  }

  reduceStocks(count) {
    this.stocksLeft -= count;
  }

  addTiles(tiles) {
    this.tiles.push(...tiles);
  }

  hasTile(tileId) {
    return this.tiles.findIndex(tile => tile.id === tileId) >= 0;
  }

  activate() {
    this.active = true;
  }

  determineIfSafe() {
    const isSafe = this.getSize() >= 11;
    this.#isSafe = isSafe;
  }

  grow(tiles) {
    this.tiles = lodash.uniq([...this.tiles, ...tiles]);
    this.determineIfSafe();
  }

  updateMarketPrice(newPrice) {
    this.marketPrice = newPrice;
  }

  defunct() {
    this.tiles = [];
    this.active = false;
  }

  getSize() {
    return this.tiles.length;
  }

  isSafe() {
    return this.#isSafe;
  }

  accept(visitor) {
    visitor.visitCorporation(this);
  }

  getState() {
    return {
      ...this,
      isSafe: this.#isSafe
    };
  }
}

module.exports = { Corporation };
