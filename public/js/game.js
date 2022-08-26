const drawTile = () => {
  API.drawTile()
    .then((res) => {
      const { id: tileId } = res.data;
      gameState.drawTile(tileId);
      changePlayerTurn();
    })
    .catch(err => console.log(err));
};

const changePlayerTurn = () => {
  API.changeTurn()
    .then(() => poller.start());
};

const skipBuild = () => {
  API.skipBuild()
    .then((res) => {
      gameState.updateStage(res.data.case);
      handleView(gameState);
    });
};

const buildCorporation = (tileId, corporationId) => {
  API.buildCorporation(tileId, corporationId)
    .then(res => {
      const { corporation: { tiles, marketPrice }, case: step } = res.data;
      gameState.buildCorporation(corporationId, marketPrice, tiles);
      gameState.updateStage(step);

      storeItem('corporationId', corporationId);
      handleView(gameState);
    });
};

const buyStocks = (stocks) => {
  let message = '';
  API.buyStocks(stocks)
    .then(res => {
      gameState.sellStocks(stocks);

      gameState.updateStage(res.data.case);
      return res;
    })
    .catch((res) => {
      message = res.message;
    })
    .finally(() => {
      handleView(gameState, message);
    });
};

const sellStocks = (stockCount) => {
  let message = '';
  API.sellStock(stockCount)
    .then(res => {
      removeTransationPanel();
      poller.start();
      return res;
    })
    .catch(res => {
      message = res.message;
      handleView(gameState, message);
    });
};

const skipBuy = () => {
  API.skipBuy()
    .then((res) => {
      gameState.updateStage(res.data.case);
      handleView(gameState);
    });
};

const placeTile = (tileId) => {
  API.placeTile(tileId)
    .then(res => {
      gameState.placeTile(tileId);
      storeItem('tileId', tileId);
      if (!gameState.isCurrentPlayer(res.data.currentPlayer)) {
        removeTransationPanel();
        poller.start();
        return;
      }
      gameState.updateCorporations(res.data.corporations);
      gameState.updateCurrentPlayerMoney(res.data.money);
      gameState.updateStage(res.data.case);
      return handleView(gameState);
    });
};

const handleView = (game, message = '') => {
  removeHighLight();

  if (game.isInPlaceTileState()) {
    renderPlayerResources(game);
    highlightTilesOnBoard(game);
  }

  if (game.isInTransactionState()) {
    renderBoard(game);
    renderPlayerResources(game);
    renderStockMarket(game);
    showDefunctStocksTransaction(message);
  }

  if (game.isInBuildState()) {
    renderBoard(game);
    renderPlayerResources(game);
    renderStockMarket(game, message);
    highlightStockMarketToBuild(getItem('tileId'));
  }

  if (game.isInBuyState()) {
    renderLogs(game);
    renderBoard(game);
    renderStockMarket(game, message);
    renderPlayerResources(game);
    highlightStockMarketToBuy(game);
  }

  if (game.isInDrawTileState()) {
    renderPlayerResources(game);
    drawTile();
  }
};

let gameState;
let poller;

const refresh = (game) => {
  gameState = createState(game);

  renderScreen(gameState);
  if (gameState.isMyTurn()) {
    poller.stop();
    handleView(gameState);
  }
};

const main = () => {
  poller = new Poller(500, refresh);
  poller.start();

  const infoCard = select('#info-card');
  const infoCardBtn = select('#info-card-btn');

  infoCardBtn.onclick = () => {
    infoCard.classList.toggle('hide');
  };
};

window.onload = main;
