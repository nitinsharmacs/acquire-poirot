// Creating game board --------------------
const tileLabel = ({ label }) => {
  const number = label.slice(0, -1);
  const letter = label.slice(-1);

  return [number,
    ['span', { class: 'letter' }, {}, letter]
  ];
};

const isTilePresentIn = (tileId, corporation) => {
  return corporation.tiles.findIndex(tile => tile.id === tileId) !== -1;
};

const findCorporationByTile = (tileId, corporations) => {
  return corporations.find(corporation => {
    return isTilePresentIn(tileId, corporation);
  });
};

const getCorporationClass = (tileId, corporations) => {
  const corporation = findCorporationByTile(tileId, corporations);
  if (corporation) {
    return corporation.id;
  }
  return '';
};

const createTiles = (tiles, corporations) => {
  return tiles.map(tile => {
    const corporationClass = getCorporationClass(tile.id, corporations);
    const placed = tile.placed ? 'placed' : '';
    const contents = corporationClass ? '' : tileLabel(tile);
    return [
      'div',
      {
        class: `tile-item ${placed} ${corporationClass}`,
        id: `tile-${tile.id}`
      },
      {},
      ...contents
    ];
  });
};

// main
const renderBoard = (game) => {
  const { board, corporations } = game;
  const { tiles } = board;

  const boardElement = document.querySelector('.board-tiles');

  const tilesTemplate = createTiles(tiles, corporations);

  const tilesHTML = createElements(tilesTemplate);
  boardElement.replaceChildren(...tilesHTML);
};
