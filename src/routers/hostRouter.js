const express = require('express');
const { createGame } = require('../handlers/createGame');
const { hostGame } = require('../handlers/hostGame');

const createHostRouter = (resources) => {
  const router = express.Router();
  router.get('/host', createGame(resources));
  router.post('/host', hostGame(resources));
  return router;
};

module.exports = { createHostRouter };
