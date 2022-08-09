const { loadGame } = require('../handlers/gameApi');

const router = require('express').Router();

router.get('/loadgame', loadGame);

module.exports = router;
