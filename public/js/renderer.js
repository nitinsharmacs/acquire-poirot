// Creating game logs --------------------
const renderLogs = ({ logs }) => {
  const logElement = document.querySelector('.logs');

  const logsHTML = logs.map(log => ['div', {}, {}, log]);

  logElement.replaceChildren(...createElements(logsHTML));
};

const renderPopups = (game) => {
  if (game.turn.stage === 'end-game') {
    return true;
  }
};

const sellDefunctStocks = () => {
  const stockCount = select('.sell-stocks').value;
  sellStocks(stockCount);
};

const showDefunctStocksTransaction = () => {
  const transactionPannel = document.querySelector('.logs');

  const transactionHTML = [['div', {}, {},
    ['input', { class: 'sell-stocks' }, {}, ''], ['input', { type: 'button', value: 'confirm' }, { onclick: sellDefunctStocks }]]];

  transactionPannel.replaceChildren(...createElements(transactionHTML));
};

const renderScreen = (game) => {
  renderBoard(game);
  renderPlayers(game);
  renderPlayerResources(game);
  renderStockMarket(game);
  renderLogs(game);
  renderPopups(game);
};
