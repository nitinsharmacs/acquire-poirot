const store = {
  playerId: 'player1',
  gameId: '12'
};

const getplayer = ({ players }) => {
  return players.find(player => player.id === store.playerId);
};

const loadGame = (gameId) => {
  fetchReq(`/api/loadgame/${gameId}`, {
    method: 'get'
  }, (res) => {
    store.game = res.body;
    renderPlayers(store.game);
    renderPlayerResources(getplayer(store.game));
    renderStockMarket(store.game);
  });
};

const isPlaying = (player) => {
  return player.id === store.playerId;
};

const createPlayerItem = (player) => {
  const activeClass = player.id === store.game.currentPlayer.id ? 'active' : '';
  const activeTag = isPlaying(player) ? '(You)' : '';

  return ['div',
    { class: `player-item ${activeClass}` },
    {},
    ['div', { class: 'highlight' }, {}],
    ['p', {}, {}, `${player.name} ${activeTag}`]
  ];
};

const createPlayers = (players) => {
  const playersList = players.map(createPlayerItem);

  return createElements(playersList);
};

const renderPlayers = ({ players }) => {
  const playersList = document.querySelector('#players-list');
  const playersHtml = createPlayers(players);
  playersList.append(...playersHtml);
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
      ['p', {}, {}, `$${player.money}`]
    ],
    ['section', { class: 'player-tiles' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Tiles'],
      [
        'div', {}, {}, ...playerTiles(player)
      ]
    ],
    ['section', { class: 'player-stocks' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Stocks'],
    ]
  ];

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

const main = () => {
  const playerId = 'player1';
  const gameId = '12';
  loadGame(gameId);
};

window.onload = main;
