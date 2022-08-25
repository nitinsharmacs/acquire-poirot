const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');

// routes
const apiRoutes = require('./routers/apiRoutes.js');

// middlewares
const { restrict } = require('./middlewares/auth.js');
const { injectGame } = require('./middlewares/game');

// handlers
const { notFound } = require('./handlers/notFound.js');
const { serveGamePage,
  joinGame,
  serveLobby,
  serveLandingPage,
  saveGame,
  restoreGame,
  serveSavePage,
  serveRestorePage
} = require('./handlers/game.js');

const { createAuthRouter } = require('./routers/authRoutes.js');
const { createHostRouter } = require('./routers/hostRouter');

// models
const DataStore = require('./dataStore.js');
const { Games } = require('./models/games.js');
const { GameStore } = require('./models/gameStore.js');

const {
  USERS_DB_PATH,
  SESSION_KEY
} = process.env;

const resources = {
  USERS_DB_PATH,
};

const appConfig = {
  root: './public',
  sessionKey: SESSION_KEY,
  session,
  games: new Games([], new GameStore(fs).load())
};

const createApp = (config = appConfig, dataStore = new DataStore(resources)) => {
  const { root, sessionKey, session, games } = config;
  const app = express();
  // app.use(morgan('tiny'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(session(
    {
      saveUninitialized: false,
      resave: false,
      secret: sessionKey
    }
  ));

  // injecting games to app
  app.games = games;

  const authRouter = createAuthRouter(dataStore);
  app.use(authRouter);

  const hostRouter = createHostRouter();
  app.use(hostRouter);

  app.get('/join/:id', restrict, joinGame);
  app.get('/lobby/:id', restrict, serveLobby);

  app.get('/game', restrict, injectGame, serveGamePage);
  app.use('/api', restrict, injectGame, apiRoutes);

  // only for developers
  app.get('/save', restrict, serveSavePage);
  app.post('/save', restrict, saveGame);
  app.get('/restore', restrict, serveRestorePage);
  app.post('/restore', restrict, restoreGame);

  app.get('/', restrict, serveLandingPage);

  app.use(express.static(root));

  app.use(notFound);
  return app;
};

module.exports = { createApp };
