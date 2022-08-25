const { defunctStockHolder } = require('../utils/game');

class MergeState {
  constructor(game,
    { defunctCorp, acquiringCorp },
    tiles,
    mergeMaker) {

    this.game = game;
    this.defunctCorp = defunctCorp;
    this.acquiringCorp = acquiringCorp;
    this.tiles = tiles;
    this.mergeMaker = mergeMaker;
    this.count = 0;
    this.stockHolders = [];
  }

  reorderPlayers() {
    const gamePlayers = this.game.players;
    const mergeMakerPosition = gamePlayers.findIndex(player => {
      return this.mergeMaker.isSame(player.id);
    });

    const players = gamePlayers.slice(mergeMakerPosition);
    return players.concat(gamePlayers.slice(0, mergeMakerPosition));
  }

  addStockHolders() {
    const orderedPlayers = this.reorderPlayers();
    this.stockHolders = defunctStockHolder(orderedPlayers, this.defunctCorp.id);
  }

  changeTurn() {
    const stockHolderId = this.stockHolders[this.count].id;
    const player = this.game.getPlayer(stockHolderId);
    this.game.mergeState();
    this.game.currentPlayer = player;
    this.count++;
  }

  isValidStockCount(stockCount) {
    const player = this.game.currentPlayer;
    return player.hasStocks(this.defunctCorp, stockCount);
  }

  canMergeMakerSell() {
    return this.mergeMaker.hasStocks(this.defunctCorp, 1);
  }

  merge() {
    this.defunctCorp.defunct();
    this.acquiringCorp.grow(this.tiles);
  }

  next() {
    if (this.count >= this.stockHolders.length) {
      this.game.currentPlayer = this.mergeMaker;
      this.merge();
      this.game.buyStocksState();
      return;
    }
    this.changeTurn();
  }

  sellStocks(stockCount) {
    const player = this.game.currentPlayer;
    player.reduceStocks(this.defunctCorp, stockCount);
    this.defunctCorp.addStocks(+stockCount);
    const { stockPrice } = this.game.marketPrice(this.defunctCorp);
    player.addMoney(stockPrice * stockCount);
    this.next();
  }
}

module.exports = { MergeState };
