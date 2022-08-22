// Creating player resources --------------------
const playerTiles = ({ tiles }) => {
  return tiles.map(tile => {

    return ['div',
      { class: 'tile-item', id: tile.id },
      {},
      ...tileLabel(tile)
    ];
  });
};

const playerStocks = ({ stocks }) => {
  return stocks.map(stock => ['div',
    { class: 'stock', id: stock.corporationId }, {},
    ['p', {}, {}, stock.corporationName],
    ['p', {}, {}, `${stock.count}`]
  ]
  );
};

const placeTileOnBoard = (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const tileId = formData.get('tile');

  placeTile(tileId);
};

const unselectTile = (tile) => {
  const tileElement = document.getElementById(tile.id);
  const tileEle = select(`#tile-${tile.id}`);
  tileElement.classList.remove('highlight-tile');
  tileEle.classList.remove('selected-tile');
};

const selectTile = (event, tiles) => {
  const inputElement = event.target;
  const radio = inputElement.querySelector('input');
  radio.checked = true;
  const buttonElement = select('.place-tile-button');
  buttonElement.hidden = false;

  tiles.forEach(unselectTile);

  const tileEle = select(`#tile-${inputElement.id}`);
  tileEle.classList.add('selected-tile');
  inputElement.classList.add('highlight-tile');
};

// TODO: consider renaming this function
const tileSelection = ({ tiles }) => {
  return tiles.map(tile => {

    return ['div',
      { class: 'tile-item', id: tile.id },
      { onclick: (event) => selectTile(event, tiles) },
      ['input',
        { type: 'radio', id: tile.id, name: 'tile', value: tile.id }, {}],
      ...tileLabel(tile)
    ];
  });
};

const createPlaceButton = () => {
  const buttonTemplate = ['div', { class: 'place-button-holder' }, {},
    ['button', { class: 'place-tile-button' }, { hidden: true },
      'Place'],
  ];
  return createDOMTree(buttonTemplate);
};

const highlightTilesOnBoard = ({ player }) => {
  const playerTiles = player.tiles;

  playerTiles.forEach((tile) => {
    const tileElement = select(`#tile-${tile.id}`);
    tileElement.classList.add('focus-tile');
  });
};

const highlightTiles = ({ player }) => {
  const tilesElement = createElements(tileSelection(player));
  const tilesComponent = select('.component-tiles');
  tilesComponent.replaceChildren(...tilesElement);

  const playerTilesElement = select('.player-tiles');
  const boardElement = select('.board');
  const placeTileFormElement = playerTilesElement.querySelector('form');

  highlight(playerTilesElement);
  highlight(boardElement);

  placeTileFormElement.appendChild(createPlaceButton());
};

// main
const renderPlayerResources = ({ player }) => {
  const playerResources = select('#player-resources');

  const resourcesElements = [
    ['section', { class: 'player-money' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Money'],
      ['p', {}, {}, `${player.money} `]
    ],
    ['section', { class: 'player-tiles' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Tiles'],
      ['form', {}, { onsubmit: (event) => placeTileOnBoard(event) },
        [
          'div', { class: 'component-tiles' }, {}, ...playerTiles(player)
        ]
      ]
    ],
    ['section', { class: 'player-stocks' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Stocks'],
      ['div', {}, {}, ...playerStocks(player)]
    ]
  ];

  playerResources.replaceChildren(...createElements(resourcesElements));
};
