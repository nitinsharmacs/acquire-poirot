class GameStore {
  #games;
  #entries;
  #store;
  constructor(store) {
    this.#store = store;
  }

  save(game, entry) {
    return this.#store.set('games', game.id, game)
      .then(() => {
        this.#store.set('entries', entry.id, entry);
      });
  }

  find(gameId) {
    return this.#store.get('games', gameId);
  }

  entries() {
    return this.#store.getAll('entries');
  }
}

module.exports = { GameStore };
