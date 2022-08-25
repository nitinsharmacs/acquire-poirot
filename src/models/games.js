class Games {
  #games;
  constructor(games) {
    this.#games = games || [];
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
}

module.exports = { Games };
