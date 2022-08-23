class Turn {
  constructor() {
    // this.player = player;
    this.state = 'place-tile';
  }

  buildState() {
    this.state = 'build';
  }

  mergeState() {
    this.state = 'merge';
  }

  buyStocksState() {
    this.state = 'buy-stocks';
  }

  drawTileState() {
    this.state = 'draw-tile';
  }
}

module.exports = { Turn };
