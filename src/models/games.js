const { generateId } = require('../utils/game.js');
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

  get gameData() {
    return this.game;
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

  save(gameId, title) {
    const game = this.find(gameId);

    const devVisitor = new DevVisitor();
    game.accept(devVisitor);

    const newGameId = generateId();

    const gameData = devVisitor.gameData;
    gameData.id = newGameId;

    const gameEntry = { id: newGameId, title };

    this.#gameStore.save(gameData, gameEntry);
  }

  restore(gameId) {
    const game = this.#gameStore.find(gameId);
    this.#games.push(restoreGame(game));
  }

  savedGamesEntries() {
    return this.#gameStore.entries();
  }
}

module.exports = { Games, DevVisitor };
