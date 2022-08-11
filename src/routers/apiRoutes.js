const { loadGame, startGame, drawTile, placeTile } = require('../handlers/gameApi');

const router = require('express').Router();

router.get('/loadgame', loadGame);
router.post('/start-game', startGame);
router.post('/place-tile', placeTile);
router.post('/draw-tile', drawTile);

module.exports = router;
