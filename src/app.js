const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { createAuthRouter } = require('./routers/authRouter');
const { createGame } = require('./handlers/createGame');

const createApp = (config, fs) => {
  const { root, cookieConfig, resources } = config;
  const app = express();
  app.use(morgan('tiny'));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(session(
    {
      saveUninitialized: false,
      resave: false,
      secret: cookieConfig.sessionKey
    }
  ));

  const authRouter = createAuthRouter(resources, fs);

  app.use(authRouter);
  app.get('/host', createGame(resources, fs));
  app.get('/join/:id', (req, res) => {
    res.end('Mocked join');
  });
  app.use(express.static(root));
  return app;
};

module.exports = { createApp };
