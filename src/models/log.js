const { round } = require('../utils/game');

class Logs {
  #logs;

  constructor(logs = []) {
    this.#logs = logs;
  }

  #addPlayerLog(playerName, message) {
    this.#logs.push(`${playerName} ${message}`);
  }

  placedTile(name, id) {
    this.#addPlayerLog(name, `placed ${id}`);
  }

  drewTile(name) {
    this.#addPlayerLog(name, 'drew a tile');
  }

  skippedBuild(name) {
    this.#addPlayerLog(name, 'skipped building corporation');
  }

  skippedBuy(name) {
    this.#addPlayerLog(name, 'skipped buying stocks');
  }

  built(name, corporation) {
    this.#addPlayerLog(name, `built ${corporation}`);
  }

  boughtStocks(name, stocks) {
    const stockLogs = stocks.map(({ corporation, numOfStocks }) => {
      return `${numOfStocks} stocks of ${corporation}`;
    }).join(', ');
    this.#addPlayerLog(name, `bought ${stockLogs}`);
  }

  merged(survivingCorporation, defunctCorporation) {
    this.#logs.push(`${survivingCorporation} acquired ${defunctCorporation}`);
  }

  declaredSafe(corporation) {
    this.#logs.push(`${corporation} is a stable corporation`);
  }

  defunctCorporation(name, { count, corporationName }) {
    const message = `has ${count} stocks of ${corporationName}`;
    this.#addPlayerLog(name, message);
  }

  bonusDistribution(name, bonus, bonusType) {
    const message = `received ${bonusType} bonus of $${round(bonus)}`;
    this.#addPlayerLog(name, message);
  }

  exchangedDeadTiles(name, tileId) {
    const message = `exchanged dead tile (${tileId})`;
    this.#addPlayerLog(name, message);
  }

  handledDefunctStocks(name, { stockCount, tradeCount },
    { defunctCorporation }) {
    let message = '';
    if (tradeCount === 0 && stockCount === 0) {
      message = 'chose to hold all stocks';
    }
    message = `sold ${stockCount} and traded ${tradeCount} stocks`;
    this.#addPlayerLog(name, `${message} of ${defunctCorporation.name}`);
  }

  resetLogs() {
    this.#logs = [];
  }

  accept(visitor) {
    visitor.visitLogs(this);
  }

  getState() {
    return this.#logs;
  }

  get logs() {
    return this.#logs;
  }
}

module.exports = { Logs };
