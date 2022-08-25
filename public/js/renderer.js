// Creating game logs --------------------
const renderLogs = ({ logs }) => {
  const logElement = document.querySelector('.logs');

  const logsHTML = logs.map(log => ['div', {}, {}, log]);

  logElement.replaceChildren(...createElements(logsHTML));
};

const sellDefunctStocks = () => {
  const stockCount = select('.sell-stocks').value;
  sellStocks(stockCount);
};

const removeTransationPanel = () => {
  const tradePanel = select('.trade');
  if (!tradePanel) {
    return;
  }

  const playerActiviets = select('.player-activities');
  playerActiviets.removeChild(tradePanel);
};

const showDefunctStocksTransaction = (message = '') => {
  removeTransationPanel();
  const playerActivities = select('.player-activities');
  const transactionHTML = [['div', { class: 'trade' }, {},
    ['input', { class: 'sell-stocks' }, {}, ''], ['input', { type: 'button', value: 'confirm' }, { onclick: sellDefunctStocks }], ['p', {}, {}, message]]];

  playerActivities.appendChild(...createElements(transactionHTML));
};

const renderScreen = (game) => {
  renderBoard(game);
  renderPlayers(game);
  renderPlayerResources(game);
  renderStockMarket(game);
  renderLogs(game);
  renderPopups(game);
};
