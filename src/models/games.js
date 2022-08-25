const { restoreGame } = require('./game.js');

class DevVisitor {
  constructor() {
    this.game = {
      corporations: [],
      players: [],
    };
  }

  visit(game) {
    this.game = { ...this.game, ...game.getState() };
  }

  visitCorporation(corporation) {
    this.game.corporations.push(corporation.getState());
  }

  visitPlayer(player) {
    this.game.players.push(player.getState());
  }

  visitBoard(board) {
    this.game.board = board.getState();
  }

  visitLogs(logs) {
    this.game.logs = logs.getState();
  }

  json() {
    return JSON.stringify(this.game);
  }
}

class Games {
  #games;
  #gameStore;
  constructor(games, gameStore) {
    this.#games = games || [];
    this.#gameStore = gameStore;
  }

  add(game) {
    this.#games.push(game);
  }

  find(gameId) {
    return this.#games.find(game => game.id === gameId);
  }

  findByHost(hostId) {
    return this.#games.find(game => game.isHost(hostId));
  }

  save(gameId) {
    const game = this.find(gameId);

    const devVisitor = new DevVisitor();
    game.accept(devVisitor);
    const gameJSON = devVisitor.json();

    this.#gameStore.save(gameJSON);
  }

  restore(gameId) {
    const game = this.#gameStore.find(gameId);
    this.#games.push(restoreGame(game));
  }
}

module.exports = { Games };
