class Board {
  constructor(tiles) {
    this.tiles = tiles;
  }
}

const tileLabel = (col, row) => `${col}${row}`;

const tileId = (col, row) => tileLabel(col, row).toLowerCase();

const createTiles = () => {
  const tiles = [];

  const rowId = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  for (let rowIndex = 0; rowIndex < 9; rowIndex++) {
    for (let colIndex = 1; colIndex <= 12; colIndex++) {
      tiles.push({
        label: tileLabel(colIndex, rowId[rowIndex]),
        id: tileId(colIndex, rowId[rowIndex]),
        placed: false
      });
    }
  }
  return tiles;
};

const createBoard = () => {
  return new Board(createTiles());
};

module.exports = { Board, createBoard };
