const {
  loadGame,
  startGame,
  drawTile,
  placeTile,
  changeTurn,
  buildCorporation,
  buyStocks,
  skipBuildCorp,
  skipBuyStocks,
  handleDefunctStocks,
  authorizeRequest
  endGame
} = require('../handlers/gameApi.js');

const router = require('express').Router();

router.get('/loadgame', loadGame);
router.post('/start-game', startGame);
router.use(authorizeRequest);
router.post('/place-tile', placeTile);
router.post('/draw-tile', drawTile);
router.post('/change-turn', changeTurn);
router.post('/build-corporation', buildCorporation);
router.post('/skip-build', skipBuildCorp);
router.post('/buy-stocks', buyStocks);
router.post('/skip-buy', skipBuyStocks);
router.post('/handle-defunct-stocks', handleDefunctStocks);
router.post('/end-game', endGame);

module.exports = router;
