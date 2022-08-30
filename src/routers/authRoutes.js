const express = require('express');

const {
  serveLoginPage,
  validateUser,
  serveSignupPage,
  register,
  logout
} = require('../handlers/auth.js');
const { redirectIfLoggedIn, restrict } = require('../middlewares/auth.js');

const createAuthRouter = (users) => {
  const router = express.Router();
  router.get('/logout', restrict, logout);
  router.use(['/login', '/sign-up'], redirectIfLoggedIn);
  router.get('/login', serveLoginPage);
  router.post('/login', validateUser(users));
  router.get('/sign-up', serveSignupPage);
  router.post('/sign-up', register(users));

  return router;
};

module.exports = { createAuthRouter };
