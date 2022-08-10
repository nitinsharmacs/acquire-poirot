const { createTiles } = require('../utils/createTiles.js');

class Board {
  constructor(tiles) {
    this.tiles = tiles;
  }

  placeTile({ id }) {
    const tile = this.tiles.find(tile => tile.id === id);
    tile.placed = true;
  }
}

const createBoard = () => {
  return new Board(createTiles());
};

module.exports = { Board, createBoard };
