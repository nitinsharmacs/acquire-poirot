let step = 1;

const store = {};

const getplayer = (players, playerId) => {
  return players.find(player => player.id === playerId);
};

const isPlaying = (player, playerId) => {
  return player.id === playerId;
};

const createPlayerItem = (game, player, playerId) => {
  const activeClass = player.id === game.currentPlayer.id ? 'active' : '';
  const activeTag = isPlaying(player, playerId) ? '(You)' : '';

  return ['div',
    { class: `player-item ${activeClass}` },
    {},
    ['div', { class: 'highlight' }, {}],
    ['p', {}, {}, `${player.name} ${activeTag}`]
  ];
};

const createPlayers = (game, playerId) => {
  const playersList = game.players.map((player) => {
    return createPlayerItem(game, player, playerId);
  });

  return createElements(playersList);
};

const renderPlayers = (game, playerId) => {
  const playersList = document.querySelector('#players-list');
  const playersHtml = createPlayers(game, playerId);
  playersList.append(...playersHtml);
};

const renderBoard = (tiles) => {
  const boardElement = document.querySelector('.board-tiles');
  const tilesTemplate = tiles.map(tile => {
    const colIndex = tile.label.slice(0, tile.label.length - 1);
    const rowIndex = tile.label.slice(-1);
    const placed = tile.placed ? 'placed' : '';
    return ['div',
      { class: `tile-item ${placed}`, id: `tile-${colIndex}` }, {},
      `${colIndex}`,
      ['span', { class: 'letter' }, {}, `${rowIndex}`]
    ];
  });
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

const renderPlayerResources = (player) => {
  const playerResources = document.querySelector('#player-resources');

  const resourcesElements = [
    ['section', { class: 'player-money' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Money'],
      ['p', {}, {}, `${player.money}`]
    ],
    ['section', { class: 'player-tiles' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Tiles'],
      [
        'div', { class: 'component-tiles' }, {}, ...playerTiles(player)
      ]
    ],
    ['section', { class: 'player-stocks' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Stocks'],
    ]
  ];

  playerResources.innerText = '';
  playerResources.append(...createElements(resourcesElements));
};

const createCorporation = (corporation) => {
  return ['div', { class: 'corporation' }, {},
    ['div', { class: 'corporation-img', id: corporation.id }, {}],
    ['div', { class: 'corporation-info' }, {},
      ['p', {}, {}, corporation.name],
      ['p', {}, {}, `${corporation.stocksLeft}`],
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

// TODO: Create game, player models
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
      const player = getplayer(store.game.players, store.playerId);
      player.tiles.push(res.data);

      renderPlayerResources(player);
    }).catch(err => console.log(err));
};

const highlightTiles = () => {
  const tilesElement = document.querySelector('.player-tiles');
  const backdropTemplate = ['div', { class: 'overlay' }, {}];
  const buttonTemplate = ['div', { class: 'place-button-holder' }, {},
    ['button', { class: 'place-tile-button' },
      { innerText: 'Place' }]
  ];
  tilesElement.style['z-index'] = 10;
  tilesElement.style.background = 'white';
  document.body.appendChild(...createElements([backdropTemplate]));
  tilesElement.appendChild(createDOMTree(buttonTemplate));
};

const main = () => {
  fetchReq('/api/loadgame', { method: 'GET' },
    (res) => {
      const { game, playerId } = res.body;
      store.game = game;
      store.playerId = playerId;
      console.log(game);
      renderBoard(game.board.tiles);
      renderPlayers(game, playerId);
      renderPlayerResources(getplayer(game.players, playerId));
      renderStockMarket(game);
      renderLogs(game);

      if (playerId === game.currentPlayer.id) {
        if (step === 1) {
          highlightTiles();
        }
      }
    });

  const infoCard = document.getElementById('info-card');
  const infoCardBtn = document.getElementById('info-card-btn');

  infoCardBtn.onclick = () => {
    infoCard.classList.toggle('hide');
  };

  // has to remove this timeout when there is player turn flow
  setTimeout(() => {
    drawTile();
  }, 5000);
};

window.onload = main;
