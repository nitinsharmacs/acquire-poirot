const express = require('express');

const { redirectIfLoggedIn,
  serveLoginPage,
  validateUser,
  serveSignupPage,
  register } = require('../handlers/auth.js');

const createAuthRouter = (dataStore) => {
  const users = dataStore.loadJSON('USERS_DB_PATH');

  const router = express.Router();
  router.use(['/login', '/sign-up'], redirectIfLoggedIn);
  router.get('/login', serveLoginPage);
  router.post('/login', validateUser(users));
  router.get('/sign-up', serveSignupPage);
  router.post('/sign-up', register(users, dataStore));

  return router;
};

module.exports = { createAuthRouter };
