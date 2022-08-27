const { generateId } = require('../utils/game.js');
const { restoreGame } = require('./game.js');
const { StoreVisitor } = require('./visitors.js');

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

    const visitor = new StoreVisitor();
    game.accept(visitor);

    const newGameId = generateId();

    const gameData = visitor.gameData;
    gameData.id = newGameId;

    const gameEntry = { id: newGameId, title };

    return this.#gameStore.save(gameData, gameEntry);
  }

  restore(gameId) {
    const game = this.#gameStore.find(gameId);
    this.#games.push(restoreGame(game));
  }

  savedGamesEntries() {
    return this.#gameStore.entries();
  }
}

module.exports = { Games };
