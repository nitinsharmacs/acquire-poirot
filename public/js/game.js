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
    .then(() => startPolling());
};

const skipBuild = () => {
  API.skipBuild()
    .then((res) => {
      gameState.updateState(res.data.case);
      handleView(gameState);
    });
};

const buildCorporation = (tileId, corporationId) => {
  API.buildCorporation(tileId, corporationId)
    .then(res => {
      const { corporation: { tiles }, case: step } = res.data;
      gameState.buildCorporation(corporationId, tiles);
      gameState.updateState(step);
      storeItem('corporationId', corporationId);
      handleView(gameState);
    });
};

const buyStocks = (stocks) => {
  let message = '';
  API.buyStocks(stocks)
    .then(res => {
      gameState.sellStocks(stocks);

      gameState.updateState(res.data.case);
      return res;
    })
    .catch((res) => {
      message = res.message;
    })
    .finally(() => {
      handleView(gameState, message);
    });
};

const skipBuy = () => {
  API.skipBuy()
    .then((res) => {
      gameState.updateState(res.data.case);
      handleView(gameState);
    });
};

const placeTile = (tileId) => {
  API.placeTile(tileId)
    .then(res => {
      gameState.placeTile(tileId);
      storeItem('tileId', tileId);

      gameState.updateCorporations(res.data.corporations);
      gameState.updateCurrentPlayerMoney(res.data.money);
      gameState.updateState(res.data.case);
      return handleView(gameState);
    });
};

const handleView = (game, message = '') => {
  removeHighLight();

  if (game.isInPlaceTileState()) {
    renderPlayerResources(game);
    highlightTilesOnBoard(game);
    highlightTiles(game);
  }

  if (game.isInBuildState()) {
    renderBoard(game);
    renderPlayerResources(game);
    renderStockMarket(game, message);
    highlightStockMarket(game, getItem('tileId'));
  }

  if (game.isInBuyState()) {
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

// TODO : Consider renaming startPolling function name
const startPolling = () => {
  const pollingId = setInterval(() => {
    API.loadGame()
      .then(res => createState(res.game))
      .then(game => {
        gameState = game;
        renderScreen(game);
        if (game.isMyTurn()) {
          clearInterval(pollingId);
        }

        handleView(game);
      });
  }, 500);
};

let gameState;

const main = () => {
  startPolling();

  const infoCard = select('#info-card');
  const infoCardBtn = select('#info-card-btn');

  infoCardBtn.onclick = () => {
    infoCard.classList.toggle('hide');
  };
};

window.onload = main;
