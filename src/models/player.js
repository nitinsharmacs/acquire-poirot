class Player {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.tiles = [];
    this.money = 0;
    this.stocks = [];
  }

  removeTile(id) {
    this.tiles = this.tiles.filter(tile => tile.id !== id);
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  placeFirstTile() {
    const [tile] = this.tiles;
    this.tiles.splice(0, 1);
    return tile;
  }

  addStocks({ id, name }, noOfStocks = 0) {
    const stocks = this.stocks.find(stock => stock.corporationId === id);

    if (stocks) {
      stocks.count += noOfStocks;
      return;
    }

    this.stocks.push({ corporationId: id, corporationName: name, count: noOfStocks });
  }

  reduceStocks({ id }, noOfStocks = 0) {
    const stocks = this.stocks.find(stock => stock.corporationId === id);

    if (stocks) {
      stocks.count -= noOfStocks;
    }
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

  isSame(id) {
    return this.id === id;
  }

  hasStocks({ id }, stockCount = 1) {
    const stocks = this.stocks.find(stock => stock.corporationId === id);
    return stocks && stocks.count >= stockCount;
  }
}

module.exports = { Player };
