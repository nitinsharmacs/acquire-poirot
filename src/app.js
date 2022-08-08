const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const { createAuthRouter } = require('./routers/authRouter.js');
const { urlencoded } = require('express');

const createApp = (config, fs) => {
  const { root, cookieConfig, resources } = config;
  const app = express();
  app.use(urlencoded({ extended: true }));
  app.use(morgan('tiny'));
  app.use(cookieParser());

  app.use(cookieSession({
    name: cookieConfig.cookieName,
    keys: [cookieConfig.sessionKey]
  }));

  const authRouter = createAuthRouter(resources, fs);

  app.use(authRouter);
  app.use(express.static(root));
  return app;
};

module.exports = { createApp };
