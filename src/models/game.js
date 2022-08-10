const { Corporation } = require('./corporation.js');
const { createBoard } = require('./board.js');
const { createTiles } = require('../utils/createTiles.js');

const tileLetter = (tile) => tile.id.slice(-1);
const tileNumber = (tile) => +tile.id.slice(0, -1);

const findNearestTile = (tiles) => {
  return tiles.reduce((firstTile, tile) => {
    const prevLetter = tileLetter(firstTile).charCodeAt();
    const prevNumber = tileNumber(firstTile);
    const nextLetter = tileLetter(tile).charCodeAt();
    const nextNumber = tileNumber(tile);

    if (prevLetter > nextLetter) {
      return tile;
    }

    if (prevLetter === nextLetter && prevNumber > nextNumber) {
      return tile;
    }

    return firstTile;
  });
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
    const nearestTile = findNearestTile(this.cluster);
    const nearestTilePos = this.cluster.find(({ id }) => id === nearestTile.id);
    this.players = this.players.slice(nearestTilePos).concat(this.players.slice(0, nearestTilePos));
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
