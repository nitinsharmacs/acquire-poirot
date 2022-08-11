const { loadGame, startGame, placeTile } = require('../handlers/gameApi');

const router = require('express').Router();

router.get('/loadgame', loadGame);
router.post('/start-game', startGame);
router.post('/place-tile', placeTile);

module.exports = router;
