class GameStore {
  #games;
  #entries;
  #store;
  constructor(store) {
    this.#store = store;
  }

  load() {
    return this.#store.getAll('games')
      .then(games => {
        this.#games = games;
        return this.#store.getAll('entries');
      }).then(entries => {
        this.#entries = entries;
        return this;
      });
  }

  save(game, entry) {
    return this.#store.set('games', game.id, game)
      .then(() => {
        this.#store.set('entries', entry.id, entry);
      });
  }

  find(gameId) {
    return this.#games.find(game => game.id === gameId);
  }

  entries() {
    return this.#entries;
  }
}

module.exports = { GameStore };
