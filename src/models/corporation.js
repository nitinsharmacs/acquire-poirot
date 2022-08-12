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
}

module.exports = { Corporation };
