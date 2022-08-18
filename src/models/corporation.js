class Corporation {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.active = false;
    this.stocksLeft = 25;
    this.tiles = [];
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

  grow(tiles) {
    this.tiles = tiles;
  }

  getSize() {
    return this.tiles.length;
  }
}

module.exports = { Corporation };
