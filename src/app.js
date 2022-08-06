const express = require('express');
const morgan = require('morgan');

const createApp = (config) => {
  const { root } = config;
  const app = express();
  app.use(morgan('tiny'));
  app.use(express.static(root));
  return app;
};

module.exports = { createApp };
