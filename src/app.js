const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const { createAuthRouter } = require('./routers/authRouter');
const { createGame } = require('./handlers/createGame');

const createApp = (config, fs) => {
  const { root, cookieConfig, resources } = config;
  const app = express();
  app.use(morgan('tiny'));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(cookieSession({
    name: cookieConfig.cookieName,
    keys: [cookieConfig.sessionKey]
  }));

  const authRouter = createAuthRouter(resources, fs);

  app.use(authRouter);
  app.get('/host', createGame(resources, fs));
  app.use(express.static(root));
  return app;
};

module.exports = { createApp };
