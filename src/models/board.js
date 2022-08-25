const { createTiles } = require('../utils/game.js');

class Board {
  constructor(tiles) {
    this.tiles = tiles;
  }

  #findTile(tileId) {
    return this.tiles.find(tile => tile.id === tileId);
  }

  placeTile(id) {
    const tile = this.tiles.find(tile => tile.id === id);
    tile.placed = true;
    return tile;
  }

  buildCorporation({ id }, corporation) {
    const tile = this.#findTile(id);
    tile.corporation = {
      id: corporation.id,
      name: corporation.name
    };
  }

  accept(visitor) {
    visitor.visitBoard(this);
  }

  getState() {
    return {
      ...this
    };
  }
}

const createBoard = (board = {}) => {
  if (board.tiles) {
    return new Board(board.tiles);
  }
  return new Board(createTiles());
};

module.exports = { Board, createBoard };
