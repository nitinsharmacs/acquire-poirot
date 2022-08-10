const { loadGame, startGame } = require('../handlers/gameApi');

const router = require('express').Router();

router.get('/loadgame', loadGame);
router.post('/start-game', startGame);

module.exports = router;
