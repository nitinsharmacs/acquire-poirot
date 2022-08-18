const createPlayerItem = (player, game) => {
  const activeClass = player.id === game.currentPlayer.id ? 'active' : '';
  const activeTag = player.id === game.player.id ? '(You)' : '';

  return ['div',
    { class: `player-item ${activeClass}` },
    {},
    ['div', { class: 'highlight' }, {}],
    ['p', {}, {}, `${player.name}`],
    ['span', {}, {}, ` ${activeTag}`]
  ];
};

const createPlayers = (game) => {
  const playersList = game.players.map((player) => {
    return createPlayerItem(player, game);
  });

  return createElements(playersList);
};

const renderPlayers = (game) => {
  const playersList = document.querySelector('#players-list');

  const playersHtml = createPlayers(game);
  playersList.replaceChildren(...playersHtml);
};

const getCorporationClass = (tileId) => {
  const corporation = gameState.findCorporationByTile(tileId);
  if (corporation) {
    return corporation.id;
  }
  return '';
};

const createTiles = (tiles) => {
  return tiles.map(tile => {
    const corporationClass = getCorporationClass(tile.id);
    const placed = tile.placed ? 'placed' : '';
    return [
      'div',
      {
        class: `tile-item ${placed} ${corporationClass}`,
        id: `tile-${tile.id}`
      },
      {},
      ...tileLabel(tile)
    ];
  });
};

const renderBoard = ({ board }) => {
  const { tiles } = board;

  const boardElement = document.querySelector('.board-tiles');

  const tilesTemplate = createTiles(tiles);

  const tilesHTML = createElements(tilesTemplate);
  boardElement.replaceChildren(...tilesHTML);
};

const tileLabel = ({ label }) => {
  const number = label.slice(0, -1);
  const letter = label.slice(-1);

  return [number,
    ['span', { class: 'letter' }, {}, letter]
  ];
};

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

const renderPlayerResources = ({ player }) => {
  const playerResources = document.querySelector('#player-resources');

  const resourcesElements = [
    ['section', { class: 'player-money' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Money'],
      ['p', {}, {}, `${player.money} `]
    ],
    ['section', { class: 'player-tiles' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Tiles'],
      ['form', {}, { onsubmit: (event) => placeTile(event) },
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

const createCorporation = (corporation) => {
  const disable = corporation.active ? 'disabled-corporation' : '';
  return ['div', { class: 'corporation' }, {},
    ['div', { class: `corporation-img ${disable}`, id: corporation.id }, {}],
    ['div', { class: 'corporation-info' }, {},
      ['p', {}, {}, corporation.name],
      ['p', {}, {}, `${corporation.stocksLeft} `],
    ]
  ];
};

const createColumn = (corporations) => {
  return ['div', { class: 'corporation-col' }, {},
    ...corporations.map(createCorporation)
  ];
};

const createCorporations = (corporations) => {
  return ['div', { class: 'corporations' }, {},
    createColumn(corporations.slice(0, 4)),
    createColumn(corporations.slice(4))
  ];
};

const renderStockMarket = ({ corporations }) => {
  const stockMarket = document.querySelector('#stock-market');

  const elements = [
    ['h3', { class: 'component-heading' }, {}, 'Stock Market'],
    createCorporations(corporations)
  ];

  stockMarket.replaceChildren(...createElements(elements));
};

// view
const renderLogs = ({ logs }) => {
  const logElement = document.querySelector('.logs');

  const logsHTML = logs.map(log => ['div', {}, {}, log]);

  logElement.replaceChildren(...createElements(logsHTML));
};

// view
const removeOverlay = () => {
  const overlay = document.querySelector('.overlay');
  overlay.remove();
};

// view
const selectTile = (event, tiles) => {
  const inputElement = event.target;
  const radio = inputElement.querySelector('input');
  radio.checked = true;
  const buttonElement = document.querySelector('.place-tile-button');
  buttonElement.hidden = false;

  tiles.forEach(tile => {
    const tileElement = document.getElementById(tile.id);
    tileElement.classList.remove('highlight-tile');
  });
  inputElement.classList.add('highlight-tile');
};

// view
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

// view
const createPlaceButton = () => {
  const buttonTemplate = ['div', { class: 'place-button-holder' }, {},
    ['button', { class: 'place-tile-button' }, { hidden: true },
      'Place'],
  ];
  return createDOMTree(buttonTemplate);
};

// view
const highlightTiles = () => {
  const { player } = gameState;
  const tilesElement = createElements(tileSelection(player));
  const tilesComponent = document.querySelector('.component-tiles');
  tilesComponent.replaceChildren(...tilesElement);

  const playerTilesElement = document.querySelector('.player-tiles');
  const placeTileFormElement = playerTilesElement.querySelector('form');

  const backdropTemplate = ['div', { class: 'overlay' }, {}];
  playerTilesElement.style['z-index'] = 10;
  playerTilesElement.style.background = 'white';
  placeTileFormElement.appendChild(createPlaceButton());

  document.body.appendChild(...createElements([backdropTemplate]));
};
// view
const renderScreen = (game) => {
  renderBoard(game);
  renderPlayers(game);
  renderPlayerResources(game);
  renderStockMarket(game);
  renderLogs(game);
};
