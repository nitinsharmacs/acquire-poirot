const express = require('express');
const { createGame } = require('../handlers/createGame');
const { hostGame } = require('../handlers/hostGame');

const createHostRouter = () => {
  const router = express.Router();
  router.get('/host', createGame);
  router.post('/host', hostGame);
  return router;
};

module.exports = { createHostRouter };
