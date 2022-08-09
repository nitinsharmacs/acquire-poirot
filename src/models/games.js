class Games {
  constructor(games) {
    this.games = games || [];
  }

  add(game) {
    this.games.push(game);
  }

  find(gameId) {
    return this.games.find(game => game.id === gameId);
  }
}

module.exports = { Games };
