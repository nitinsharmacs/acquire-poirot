const lodash = require('lodash');

const { Corporation } = require('./corporation.js');
const { createBoard } = require('./board.js');
const { Player } = require('./player.js');
const { createTiles } = require('../utils/createTiles.js');

const sortTiles = (tiles) => {
  const sortedTilesByLetter = lodash.sortBy(tiles, ({ id }) => {
    const letter = id.slice(-1);
    return letter;
  });

  return lodash.sortBy(sortedTilesByLetter, ({ id }) => {
    const num = +id.slice(0, id.length - 1);
    return num;
  });
};

const reorderPlayers = (players, tiles) => {
  const orderedPlayers = [];
  for (let index = 0; index < tiles.length; index++) {
    const player = players.find(player => player.tiles[0].id === tiles[index].id);
    orderedPlayers.push(player);
  }
  return orderedPlayers;
};

class Game {
  constructor({ id,
    players,
    board,
    cluster,
    corporations,
    host,
    gameSize
  }) {
    this.id = id;
    this.players = players;
    this.board = board;
    this.cluster = cluster;
    this.corporations = corporations;
    this.host = host;
    this.gameSize = gameSize;
    this.currentPlayer = this.players[0];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayers() {
    return this.players;
  }

  reorder() {
    const tiles = sortTiles(this.players.map(player => player.tiles[0]));
    this.players = reorderPlayers(this.players, tiles);
    this.currentPlayer = this.players[0];
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
  const board = createBoard();
  const cluster = createTiles();

  const corporations = createCorporations();

  return new Game({
    id,
    host,
    players: [],
    board,
    cluster,
    corporations,
    gameSize
  });
};

module.exports = { Game, newGame };
