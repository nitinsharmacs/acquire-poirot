class Player {
  #name;
  #tiles;
  constructor({
    id,
    name,
    tiles = [],
    money = 0,
    stocks = []
  }) {
    this.id = id;
    this.#name = name;
    this.#tiles = tiles;
    this.money = money;
    this.stocks = stocks;
  }

  findTile(id) {
    return this.#tiles.find(tile => tile.id === id);
  }

  removeTile(id) {
    this.#tiles = this.#tiles.filter(tile => tile.id !== id);
  }

  addTile(tile) {
    this.#tiles.push(tile);
  }

  placeFirstTile() {
    const [tile] = this.#tiles;
    this.#tiles.splice(0, 1);
    return tile;
  }

  findStocks(corporationId) {
    return this.stocks.find(stock => stock.corporationId === corporationId);
  }

  addStocks({ id, name }, noOfStocks) {
    if (noOfStocks <= 0) {
      return;
    }

    const stocks = this.findStocks(id);

    if (stocks) {
      stocks.count += noOfStocks;
      return;
    }

    this.stocks.push({ corporationId: id, corporationName: name, count: noOfStocks });
  }

  reduceStocks({ id }, noOfStocks = 0) {
    const stock = this.findStocks(id);

    if (stock) {
      stock.count -= noOfStocks;
    }
    if (stock && stock.count === 0) {
      const stockPosition = this.stocks.indexOf(stock);
      this.stocks.splice(stockPosition, 1);
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

  hasStocks({ id }, stockCount = 0) {
    const stocks = this.stocks.find(stock => stock.corporationId === id);
    const count = stocks ? stocks.count : 0;
    return count >= stockCount;
  }

  accept(visitor) {
    visitor.visitPlayer(this);
  }

  getState() {
    return {
      ...this,
      name: this.#name
    };
  }

  //getters
  get name() {
    return this.#name;
  }

  get tiles() {
    return this.#tiles;
  }
}

module.exports = { Player };
