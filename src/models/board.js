const { createTiles } = require('../utils/createTiles.js');

class Board {
  constructor(tiles) {
    this.tiles = tiles;
  }

  #findTile(tileId) {
    return this.tiles.find(tile => tile.id === tileId);
  }

  placeTile({ id }) {
    const tile = this.tiles.find(tile => tile.id === id);
    tile.placed = true;
  }

  buildCorporation({ id }, corporation) {
    const tile = this.#findTile(id);
    tile.corporation = {
      id: corporation.id,
      name: corporation.name
    };
  }
}

const createBoard = () => {
  return new Board(createTiles());
};

module.exports = { Board, createBoard };
