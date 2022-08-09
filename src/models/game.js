const { Corporation } = require('./corporation.js');
const { createBoard } = require('./board.js');
const { Player } = require('./player.js');

class Game {
  constructor({ id, players, board, corporations, host, gameSize }) {
    this.id = id;
    this.players = players;
    this.board = board;
    this.corporations = corporations;
    this.host = host;
    this.gameSize = gameSize;
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayers() {
    return this.players;
  }
}

const createCorporations = () => {
  const corporations = [
    {
      id: 'america',
      name: 'America'
    },
    {
      id: 'hydra',
      name: 'Hydra'
    },
    {
      id: 'fusion',
      name: 'Fusion'
    },
    {
      id: 'zeta',
      name: 'Zeta'
    },
    {
      id: 'quantum',
      name: 'Quantum'
    },
    {
      id: 'phoneix',
      name: 'Phoneix'
    },
    {
      id: 'sackson',
      name: 'Sackson'
    }
  ];

  return corporations.map(corporation =>
    new Corporation(
      corporation.id,
      corporation.name
    ));
};

const newGame = (id, host, gameSize) => {
  const player = new Player(host.id, host.name);
  const board = createBoard();
  const corporations = createCorporations();

  return new Game({
    id,
    host,
    players: [player],
    board,
    corporations,
    gameSize
  });
};

module.exports = { Game, newGame };
