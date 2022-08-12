const lodash = require('lodash');
const { Corporation } = require('./corporation.js');
const { createBoard } = require('./board.js');
const { createTiles } = require('../utils/createTiles.js');

const getSameRowTiles = (letter, tiles) => {
  return tiles.filter(tile => tile.id.includes(letter));
};

const findNearestTile = (tiles) => {
  const sortedTilesByLetter = lodash.sortBy(tiles, ({ id }) => {
    const letter = id.slice(-1);
    return letter;
  });

  const nearestLetter = sortedTilesByLetter[0].id.slice(-1);
  const sameRowTiles = getSameRowTiles(nearestLetter, sortedTilesByLetter);
  const sortedTiles = lodash.sortBy(sameRowTiles, ({ id }) => {
    const num = +id.slice(0, id.length - 1);
    return num;
  });
  return sortedTiles[0];
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
    this.logs = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayers() {
    return this.players;
  }

  reorder() {
    const playersTiles = this.players.map(player => player.tiles[0]);
    const nearestTile = findNearestTile(playersTiles);
    const nearestTilePos = playersTiles.findIndex((tile) => tile.id === nearestTile.id);
    this.players = this.players.slice(nearestTilePos).concat(this.players.slice(0, nearestTilePos));
    this.currentPlayer = this.players[0];
  }

  isPlayerIdle(playerId) {
    return this.currentPlayer.id !== playerId;
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

module.exports = { Game, newGame, createCorporations };
