const { loadGame } = require('../handlers/gameApi');

const router = require('express').Router();

router.get('/loadgame/:gameId', loadGame);

module.exports = router;
