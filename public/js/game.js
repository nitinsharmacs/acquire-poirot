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

const belongsTo = (tile) => {
  const corporation = gameState.corporations.find(corporation => {
    return corporation.tiles[0]?.id === tile.id;
  });
  if (!corporation) {
    return '';
  }
  return corporation.id;
};

const createTiles = (tiles) => {
  return tiles.map(tile => {
    const built = belongsTo(tile);
    const placed = tile.placed ? 'placed' : '';
    return [
      'div',
      {
        class: `tile-item ${placed} ${built}`,
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

const createCorporationHTML = (corporation) => {
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
    ...corporations.map(createCorporationHTML)
  ];
};

const createCorporationsHTML = (corporations) => {
  return ['div', { class: 'corporations' }, {},
    createColumn(corporations.slice(0, 4)),
    createColumn(corporations.slice(4))
  ];
};

const renderStockMarket = ({ corporations }) => {
  const stockMarket = document.querySelector('#stock-market');

  const elements = [
    ['h3', { class: 'component-heading' }, {}, 'Stock Market'],
    createCorporationsHTML(corporations)
  ];

  stockMarket.replaceChildren(...createElements(elements));
};

const renderLogs = ({ logs }) => {
  const logElement = document.querySelector('.logs');

  const logsHTML = logs.map(log => ['div', {}, {}, log]);

  logElement.replaceChildren(...createElements(logsHTML));
};

const removeOverlay = () => {
  const overlay = document.querySelector('.overlay');
  overlay.remove();
};

const drawTile = () => {
  fetch('/api/draw-tile', {
    method: 'POST'
  })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Can\'t draw tile');
      }
      return res.json();
    })
    .then((res) => {
      gameState.player.drawTile(res.data);
      renderPlayerResources(gameState);
    }).catch(err => console.log(err));
};

const changePlayerTurn = () => {
  fetch('/api/change-turn', {
    method: 'POST'
  }).then(res => startPolling());
};

const getInactiveCorporation = () => {
  return gameState.corporations.find(corporation => !corporation.active).id;
};

const buildCorporation = (tileId) => {
  const corporationId = getInactiveCorporation();
  fetch('/api/build-corporation', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: tileId, corporationId })
  })
    .then(res => res.json())
    .then(res => {
      gameState.updateCorporation(corporationId, res.data.tiles);
      removeHighlight();
      latestStage();
    });
};

const latestStage = () => {
  buyStocks();
  drawTile();
  changePlayerTurn();
};

const removeHighlight = () => {
  removeOverlay();
  return removeBackdrop('.stock-market');
};

const skipBuild = () => {
  fetch('/api/skip-build', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
  })
    .then(res => res.json())
    .then(res => {
      removeHighlight();
      latestStage();
    });
};

const createBuildControls = (tileId) => {
  return ['div', { class: 'build-controls-holder' }, {},
    ['button', { class: 'build-button' },
      { onclick: () => buildCorporation(tileId) },
      'Build'],
    ['button', { class: 'skip-button' }, { onclick: skipBuild },
      'Skip']
  ];
};

const highlightStockMarket = (tileId) => {
  const { corporations } = gameState;
  const corporationsEle = createDOMTree(createCorporationsHTML(corporations));
  const corporationsCompo = document.querySelector('.corporations');
  corporationsCompo.replaceWith(corporationsEle);

  const buildControls = createDOMTree(createBuildControls(tileId));
  const stockMarketEle = document.querySelector('#stock-market');

  const backdropTemplate = ['div', { class: 'overlay' }, {}];
  stockMarketEle.style['z-index'] = 10;
  stockMarketEle.style.background = 'white';
  stockMarketEle.appendChild(buildControls);
  document.body.appendChild(...createElements([backdropTemplate]));
  return true;
};

const removeBackdrop = (ele) => {
  const element = document.querySelector(ele);
  element.style['z-index'] = 0;
};

const buyStocks = () => {
  const stocks = [
    { corporationId: 'america', numOfStocks: 3 }];
  fetch('/api/buy-stocks', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ stocks })
  })
    .then(res => res.json())
    .then(res => {
      if (res.success) {
        gameState.sellStocks(stocks);
      }
    });
};

const placeTile = (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const tileId = formData.get('tile');

  gameState.player.placeTile(tileId, gameState.board);

  fetch('/api/place-tile', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: tileId })
  })
    .then(res => res.json())
    .then(res => {
      removeOverlay();
      removeBackdrop('.player-tiles');

      if (res.data.case === 'build') {
        return highlightStockMarket(tileId);
      }

      // further steps conditions would come here
      buyStocks();
      drawTile();
      changePlayerTurn();
    });
};

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

const renderScreen = (game) => {
  renderBoard(game);
  renderPlayers(game);
  renderPlayerResources(game);
  renderStockMarket(game);
  renderLogs(game);
};

const startPolling = () => {
  const pollingId = setInterval(() => {
    fetch('/api/loadgame', { method: 'GET' })
      .then(res => res.json())
      .then(res => {
        gameState = createState(res.game);
        renderScreen(res.game);
        if (gameState.isMyTurn()) {
          clearInterval(pollingId);
          return highlightTiles();
        }
      });
  }, 500);
};

let gameState;

const main = () => {
  startPolling();

  const infoCard = document.getElementById('info-card');
  const infoCardBtn = document.getElementById('info-card-btn');

  infoCardBtn.onclick = () => {
    infoCard.classList.toggle('hide');
  };
};

window.onload = main;
