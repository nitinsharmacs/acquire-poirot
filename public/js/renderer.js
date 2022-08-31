// Creating game logs --------------------
const renderLogs = ({ logs }) => {
  const logElement = document.querySelector('.logs');

  const logsHTML = logs.map(log => ['div', {}, {}, log]);
  logElement.replaceChildren(...createElements(logsHTML));

  logElement.scrollTo(0, logElement.scrollHeight);
};

const selectDefunctStocks = () => {
  const transactionFormElement = select('#transaction-form');
  const form = new FormData(transactionFormElement);
  const tradeCount = form.get('tradeCount');
  const stockCount = form.get('stockCount');

  return handleDefunctStocks({ stockCount, tradeCount });
};

const removeTransationPanel = () => {
  const tradePanel = select('.transaction-panel');
  if (!tradePanel) {
    return;
  }

  const playerActivities = select('.player-activities');
  playerActivities.removeChild(tradePanel);
  removeHighLight();
};

const transactionTitle = ({ acquiringCorporation, defunctCorporation }) =>
  `${acquiringCorporation.name} acquired ${defunctCorporation.name}`;

const info = {
  sell: 'Sell stocks of defunct corporation and get money as per current corporation size.',
  trade: 'Trade stocks of defunct corporation in 2:1 ratio with stocks of surviving corporation',
};

const createTransactionPanel = (corporations, playerStocks, message) => {
  const defunctName = corporations.defunctCorporation.name;
  const { count } = playerStocks;

  const panel = ['div', { class: 'transaction-panel' }, {},
    ['h3', { class: 'component-heading' }, {}, transactionTitle(corporations)],
    ['p', {}, {}, `You have ${count} stocks of ${defunctName}`],
    ['form', { id: 'transaction-form', }, {},
      ['div', { class: 'panel-section' }, {},
        ['label', { for: 'stockCount' }, {}, 'Sell'],
        ['input', { type: 'number', name: 'stockCount', id: 'stockCount', class: 'stock-value', min: 0, max: count, value: 0 }],
        ['span', { class: 'icon fa-solid fa-circle-question', id: 'sell-info-icon' }],
        ['div', { class: 'info-box', id: 'sell-info' }, {}, info.sell]
      ],
      ['div', { class: 'panel-section' }, {},
        ['label', { for: 'tradeCount' }, {}, 'Trade (2:1)'],
        ['input', { type: 'number', name: 'tradeCount', id: 'tradeCount', class: 'stock-value', step: 2, min: 0, max: count, value: 0 }],
        ['span', { class: 'icon fa-solid fa-circle-question', id: 'trade-info-icon' }],
        ['div', { class: 'info-box', id: 'trade-info' }, {}, info.trade]
      ],
      ['p', { class: 'stock-message error' }, {}, message],
      ['input', { type: 'button', class: 'btn theme-btn', value: 'Confirm' }, { onclick: selectDefunctStocks }]
    ]
  ];

  return createDOMTree(panel);
};

const showDefunctStocksTransaction = (mergingCorporations, playerStocks, message = '') => {
  removeTransationPanel();
  const playerActivities = select('.player-activities');
  const panel = createTransactionPanel(mergingCorporations, playerStocks, message);
  playerActivities.appendChild(panel);
  highlight(panel);
};

const renderTransactionState = (game, message) => {
  renderBoard(game);
  renderPlayerResources(game);
  renderStockMarket(game);
  showDefunctStocksTransaction(
    game.getMergingCorporations(),
    game.getDefunctStocks(),
    message
  );
};

const renderScreen = (game) => {
  renderBoard(game);
  renderPlayers(game);
  renderPlayerResources(game);
  renderStockMarket(game);
  renderLogs(game);
};
