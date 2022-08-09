const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { createAuthRouter } = require('./routers/authRouter');
const { createHostRouter } = require('./routers/hostRouter');

// routes
const apiRoutes = require('./routers/apiRoutes.js');

// middlewares
const { restrict } = require('./middlewares/auth.js');

// handlers
const { serveGamePage } = require('./handlers/game.js');
const session = require('express-session');
const DataStore = require('./dataStore.js');

const { LOGIN_TEMPLATE,
  SIGNUP_TEMPLATE,
  HOST_TEMPLATE_PATH,
  USERS_DB_PATH,
  GAME_TEMPLATE_PATH,
  SESSION_KEY
} = process.env;

const resources = {
  LOGIN_TEMPLATE,
  SIGNUP_TEMPLATE,
  HOST_TEMPLATE_PATH,
  USERS_DB_PATH,
  GAME_TEMPLATE_PATH
};

const appConfig = {
  root: './public',
  sessionKey: SESSION_KEY,
  session
};

const createApp = (config = appConfig, dataStore = new DataStore(resources)) => {
  const { root, sessionKey, session } = config;
  const app = express();
  app.use(morgan('tiny'));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(session(
    {
      saveUninitialized: false,
      resave: false,
      secret: sessionKey
    }
  ));

  const authRouter = createAuthRouter(dataStore);
  app.use(authRouter);

  const hostRouter = createHostRouter(dataStore);
  app.use(hostRouter);

  app.get('/join/:id', (req, res) => {
    res.end('Mocked join');
  });

  app.get('/game', restrict, serveGamePage(dataStore));

  app.use('/api', restrict, apiRoutes);
  app.use(express.static(root));
  return app;
};

module.exports = { createApp };
