class Turn {
  constructor(player) {
    this.player = player;
    this.state = 'place-tile';
  }

  buildState() {
    this.state = 'build';
  }

  buyStocksState() {
    this.state = 'buy-stocks';
  }

  drawTileState() {
    this.state = 'draw-tile';
  }
}

module.exports = { Turn };
