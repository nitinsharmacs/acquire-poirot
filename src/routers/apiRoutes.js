const {
  loadGame,
  startGame,
  drawTile,
  placeTile,
  changeTurn,
  buildCorporation,
  buyStocks,
  skipBuildCorp,
} = require('../handlers/gameApi.js');

const router = require('express').Router();

router.get('/loadgame', loadGame);
router.post('/start-game', startGame);
router.post('/place-tile', placeTile);
router.post('/draw-tile', drawTile);
router.post('/change-turn', changeTurn);
router.post('/build-corporation', buildCorporation);
router.post('/skip-build', skipBuildCorp);
router.post('/buy-stocks', buyStocks);

module.exports = router;
