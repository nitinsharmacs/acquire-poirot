const express = require('express');
const { createGame } = require('../handlers/createGame');
const { hostGame } = require('../handlers/hostGame');

const createHostRouter = (dataStore) => {
  const router = express.Router();
  router.get('/host', createGame(dataStore));
  router.post('/host', hostGame(dataStore));
  return router;
};

module.exports = { createHostRouter };
