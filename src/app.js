const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { createAuthRouter } = require('./routers/authRouter');
const { createHostRouter } = require('./routers/hostRouter');

// routes
const apiRoutes = require('./routers/apiRoutes.js');

// middlewares
const { restrict } = require('./middlewares/auth.js');

// handlers
const { serveGamePage } = require('./handlers/game.js');

const createApp = (config) => {
  const { root, cookieConfig, resources, db } = config;
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

  const authRouter = createAuthRouter(resources, db.usersdbPath);
  app.use(authRouter);

  const hostRouter = createHostRouter(resources);
  app.use(hostRouter);

  app.get('/join/:id', (req, res) => {
    res.end('Mocked join');
  });

  // app.get('/game', restrict, serveGamePage(resources, fs));

  app.use('/api', restrict, apiRoutes);
  app.use(express.static(root));
  return app;
};

module.exports = { createApp };
