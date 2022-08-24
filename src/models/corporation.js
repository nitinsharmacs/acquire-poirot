class Corporation {
  #isSafe;
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.active = false;
    this.stocksLeft = 25;
    this.tiles = [];
    this.#isSafe = false;
    this.marketPrice = 0;
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
    this.tiles = tiles;
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
}

module.exports = { Corporation };
