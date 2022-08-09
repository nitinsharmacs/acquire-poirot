class Corporation {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.active = false;
    this.stocksLeft = 25;
    this.tiles = [];
  }
}

module.exports = { Corporation };
