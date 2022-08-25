const parse = (arg) => JSON.parse(arg);
const stringify = (arg) => JSON.stringify(arg);

class GameStore {
  #fs;
  #gameFile;
  constructor(fs) {
    this.#fs = fs;
    this.#gameFile = './data/game.json';
  }

  load() {
    return parse(this.#fs.readFileSync(this.#gameFile, 'utf8'));
  }

  save(game) {
    const games = this.load();
    games.push(parse(game));

    this.#fs.writeFileSync(this.#gameFile, stringify(games), 'utf8');
  }

  find(gameId) {
    const games = this.load();
    return games.find(game => game.id === gameId);
  }
}

module.exports = { GameStore };
