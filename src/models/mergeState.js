class MergeState {
  constructor(game, defunctCorp, acquiringCorp, tiles) {
    this.game = game;
    this.defunctCorp = defunctCorp;
    this.acquiringCorp = acquiringCorp;
    this.tiles = tiles;
    this.count = 1;
  }

  changeTurn(stage) {
    this.count++;
    this.game.changeTurn(stage);
  }

  next() {
    const totalPlayers = this.game.players.length;
    if (this.count >= totalPlayers) {
      this.defunctCorp.defunct();
      this.acquiringCorp.grow(this.tiles);
      this.changeTurn('buy-stocks');
      return;
    }
    this.changeTurn('merge');
    const player = this.game.currentPlayer;

    if (!player.hasStocks(this.defunctCorp)) {
      this.changeTurn('merge');
    }
  }

  sellStocks(stockCount) {
    const player = this.game.currentPlayer;
    player.reduceStocks(this.defunctCorp, stockCount);
    const { stockPrice } = this.game.marketPrice(this.defunctCorp);
    player.addMoney(stockPrice * stockCount);
    this.next();
  }

}

module.exports = { MergeState };
