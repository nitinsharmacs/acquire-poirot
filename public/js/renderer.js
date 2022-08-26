// Creating game logs --------------------
const renderLogs = ({ logs }) => {
  const logElement = document.querySelector('.logs');

  const logsHTML = logs.map(log => ['div', {}, {}, log]);

  logElement.replaceChildren(...createElements(logsHTML));
};

const sellDefunctStocks = () => {
  const transactionFormElement = select('#transaction-form');
  const form = new FormData(transactionFormElement);
  const tradeCount = form.get('tradeCount');
  const stockCount = form.get('stockCount');

  return sellStocks({ stockCount, tradeCount });
};

const removeTransationPanel = () => {
  const tradePanel = select('.transaction-panel');
  if (!tradePanel) {
    return;
  }

  const playerActiviets = select('.player-activities');
  playerActiviets.removeChild(tradePanel);
};

const createTransactionPanel = (message) => {
  const panel = ['div', { class: 'transaction-panel' }, {},
    ['form', { id: 'transaction-form', }, {},
      ['h3', { class: 'component-heading' }, {}, 'Make Transaction'],
      ['div', { class: 'panel-section' }, {},
        ['label', { for: 'stockCount' }, {}, 'Sell'],
        ['input', { type: 'number', name: 'stockCount', id: 'stockCount', class: 'stock-value', min: 0, value: 0 }]
      ],
      ['div', { class: 'panel-section' }, {},
        ['label', { for: 'tradeCount' }, {}, 'Trade'],
        ['input', { type: 'number', name: 'tradeCount', id: 'tradeCount', class: 'stock-value', step: 2, min: 0, value: 0 }]
      ],
      ['p', { class: 'stock-message' }, {}, message],
      ['input', { type: 'button', class: 'btn theme-btn', value: 'Confirm' }, { onclick: sellDefunctStocks }]
    ]
  ];

  return createDOMTree(panel);
};

const showDefunctStocksTransaction = (message = '') => {
  removeTransationPanel();
  const playerActivities = select('.player-activities');
  // const transactionHTML = [['div', { class: 'trade' }, {},
  //   ['input', { class: 'sell-stocks' }, {}, ''], ['input', { type: 'button', value: 'confirm' }, { onclick: sellDefunctStocks }], ['p', {}, {}, message]]];

  // playerActivities.appendChild(...createElements(transactionHTML));
  const panel = createTransactionPanel(message);
  playerActivities.appendChild(panel);
  highlight(panel);
};

const renderScreen = (game) => {
  renderBoard(game);
  renderPlayers(game);
  renderPlayerResources(game);
  renderStockMarket(game);
  renderLogs(game);
  renderPopups(game);
};
