const createPlayerItem = (player, game) => {
  const activeClass = player.id === game.currentPlayer.id ? 'active' : '';
  const activeTag = player.id === game.player.id ? '(You)' : '';

  return ['div',
    { class: `player-item ${activeClass}` },
    {},
    ['div', { class: 'highlight' }, {}],
    ['p', {}, {}, `${player.name} ${activeTag}`]
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

const createTiles = (tiles) => {
  return tiles.map(tile => {
    const placed = tile.placed ? 'placed' : '';
    const built = tile.corporation ? tile.corporation.id : '';

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
  console.log(player);
  const playerResources = document.querySelector('#player-resources');

  const resourcesElements = [
    ['section', { class: 'player-money' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Money'],
      ['p', {}, {}, `${player.money} `]
    ],
    ['section', { class: 'player-tiles' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Tiles'],
      [
        'div', { class: 'component-tiles' }, {}, ...playerTiles(player)
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
  return ['div', { class: 'corporation' }, {},
    ['div', { class: 'corporation-img', id: corporation.id }, {}],
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

  stockMarket.append(...createElements(elements));
};

const renderLogs = ({ logs }) => {
  const logElement = document.querySelector('.activity-logs');

  const logsHTML = logs.map(log => ['div', {}, {}, log]);

  logElement.replaceChildren(...createElements(logsHTML));
};

const removeOverlay = () => {
  const overlay = document.querySelector('.overlay');
  overlay.remove();
};

const placeTile = () => {
  const { id } = gameState.player.placeTile(gameState.board);
  console.log(id);

  fetch('/api/place-tile', { method: 'POST', body: JSON.stringify({ id }) })
    .then(res => res.json())
    .then(res => {
      removeOverlay();

      // further steps conditions would come here
      drawTile();
      startPolling();
      gameState.step = 2;
    });
};

const highlightTiles = () => {
  const tilesElement = document.querySelector('.player-tiles');

  const backdropTemplate = ['div', { class: 'overlay' }, {}];

  const buttonTemplate = ['div', { class: 'place-button-holder' }, {},
    ['button', { class: 'place-tile-button' },
      { innerText: 'Place', onclick: placeTile }
    ]
  ];

  tilesElement.style['z-index'] = 10;
  tilesElement.style.background = 'white';

  document.body.appendChild(...createElements([backdropTemplate]));
  tilesElement.appendChild(createDOMTree(buttonTemplate));
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
        const { board, logs, stocks, currentPlayer } = res.game;
        gameState.board = board;
        gameState.logs = logs;
        gameState.stocks = stocks;
        gameState.currentPlayer = currentPlayer;
        renderScreen(gameState);
      });
  });
  gameState.pollingId = pollingId;
};

const loadGame = () => {
  fetch('/api/loadgame', { method: 'GET' })
    .then(res => res.json())
    .then(res => {
      console.log(res);
      gameState = createState(res.game);
      renderScreen(gameState);

      if (gameState.isMyTurn()) {
        return highlightTiles();
      }

      startPolling();
    });
};

let gameState;

const main = () => {
  loadGame();

  const infoCard = document.getElementById('info-card');
  const infoCardBtn = document.getElementById('info-card-btn');

  infoCardBtn.onclick = () => {
    infoCard.classList.toggle('hide');
  };
};

window.onload = main;
