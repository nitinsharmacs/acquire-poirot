const { buildCorporation } = require('../handlers/buildCorporation.js');
const {
  loadGame,
  startGame,
  drawTile,
  placeTile,
  changeTurn,
  buyStocks
} = require('../handlers/gameApi.js');

const router = require('express').Router();

router.get('/loadgame', loadGame);
router.post('/start-game', startGame);
router.post('/place-tile', placeTile);
router.post('/draw-tile', drawTile);
router.post('/change-turn', changeTurn);
router.post('/build-corporation', buildCorporation);
router.post('/buy-stocks', buyStocks);

module.exports = router;
