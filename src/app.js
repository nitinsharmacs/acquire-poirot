const express = require('express');
const morgan = require('morgan');

// routes
const apiRoutes = require('./routers/apiRoutes.js');

// middlewares
const { restrict } = require('./middlewares/auth.js');
const { injectGame } = require('./middlewares/game.js');

// handlers
const { notFound } = require('./handlers/notFound.js');
const { serveGamePage,
  joinGame,
  serveLobby,
  serveLandingPage,
  saveGame,
  restoreGame,
  serveSavePage,
  serveRestorePage,
  serveInstructionPage
} = require('./handlers/game.js');

const { createAuthRouter } = require('./routers/authRoutes.js');
const { createHostRouter } = require('./routers/hostRouter.js');

// models
const DataStore = require('./dataStore.js');

const {
  USERS_DB_PATH,
} = process.env;

const resources = {
  USERS_DB_PATH,
};

const createApp = (config) => {
  const { root, sessionKey, session, games, users } = config;
  const app = express();
  app.use(morgan('tiny'));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.set('views', './src/views');
  app.set('view engine', 'pug');
  app.use(session(
    {
      saveUninitialized: false,
      resave: false,
      secret: sessionKey
    }
  ));

  // injecting games to app
  app.games = games;

  const authRouter = createAuthRouter(users);
  app.use(authRouter);

  const hostRouter = createHostRouter();
  app.use(hostRouter);

  app.get('/join/:id', restrict, joinGame);
  app.get('/lobby/:id', restrict, serveLobby);

  app.get('/game', restrict, injectGame, serveGamePage);
  app.use('/api', restrict, injectGame, apiRoutes);
  app.get('/how-to-play', restrict, serveInstructionPage);

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
