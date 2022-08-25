const parse = (arg) => JSON.parse(arg);
const stringify = (arg) => JSON.stringify(arg);

class GameStore {
  #fs;
  #gameFile;
  #gameEntriesFile;
  #games;
  #entries;
  constructor(fs) {
    this.#fs = fs;
    this.#gameFile = './data/game.json';
    this.#gameEntriesFile = './data/gameEntries.json';
  }

  load() {
    this.#games = parse(this.#fs.readFileSync(this.#gameFile, 'utf8'));
    this.#entries = parse(this.#fs.readFileSync(this.#gameEntriesFile), 'utf8');

    return this;
  }

  save(game, entry) {
    this.#games.push(game);
    this.#entries.push(entry);

    this.#fs.writeFileSync(this.#gameFile, stringify(this.#games), 'utf8');
    this.#fs.writeFileSync(this.#gameEntriesFile, stringify(this.#entries), 'utf8');
  }

  find(gameId) {
    return this.#games.find(game => game.id === gameId);
  }

  entries() {
    return this.#entries;
  }
}

module.exports = { GameStore };
