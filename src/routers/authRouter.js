const express = require('express');
const fs = require('fs');

const errorMessage = (errCode) => {
  const customErrors = {
    404: 'Invalid username or password',
    401: 'Fields cannot be empty',
    409: 'User already exists'
  };
  return customErrors[errCode];
};

const serveLoginPage = loginTemplate => (req, res) => {
  let errMsg = '';

  if (req.cookies.errCode) {
    errMsg = errorMessage(req.cookies.errCode);
    res.cookie('errCode', 0, { maxAge: 0 });
  }
  const { ref } = req.query;
  const queryString = ref ? '?ref=' + ref : '';

  const updatedTemplate = loginTemplate.replace(/_MESSAGE_/, errMsg)
    .replaceAll(/_REF_/g, queryString);
  res.type('text/html');
  res.end(updatedTemplate);
};

const serveSignupPage = signupTemplate => (req, res) => {
  let errMsg = '';

  if (req.cookies.errCode) {
    errMsg = errorMessage(req.cookies.errCode);
    res.cookie('errCode', 0, { maxAge: 0 });
  }
  const { ref } = req.query;
  const queryString = ref ? '?ref=' + ref : '';

  const updatedTemplate = signupTemplate.replace(/_MESSAGE_/, errMsg)
    .replaceAll(/_REF_/g, queryString);
  res.type('text/html');
  res.end(updatedTemplate);
};

const invalidCredentials = (users, username, password) => {
  return !users[username] || users[username].password !== password;
};

const validateUser = users => (req, res) => {
  const { username, password } = req.body;

  const { ref } = req.query;
  const queryString = ref ? '?ref=' + ref : '';

  if (!username || !password) {
    res.cookie('errCode', 401);
    return res.redirect(`/login${queryString}`);
  }
  if (invalidCredentials(users, username, password)) {
    res.cookie('errCode', 404);
    return res.redirect(`/login${queryString}`);
  }
  req.session.playerName = username;
  req.session.playerId = users[username].id;
  req.session.save(() => {
    ref ? res.redirect(ref) : res.redirect('/');
  });
};

const redirectIfLoggedIn = (req, res, next) => {
  if (req.session.playerId) {
    return res.redirect('/');
  }
  next();
};

const register = (users, usersdb) => (req, res) => {
  const { username, password } = req.body;
  const { ref } = req.query;
  const queryString = ref ? '?ref=' + ref : '';

  if (!username || !password) {
    res.cookie('errCode', 401);
    return res.redirect(`/sign-up${queryString}`);
  }

  if (users[username]) {
    res.cookie('errCode', 409);
    return res.redirect(`/sign-up${queryString}`);
  }

  const id = new Date().getTime().toString();
  const user = { username, password, id };
  users['a'] = user;
  fs.writeFileSync(usersdb, JSON.stringify(users), 'utf8');

  req.session.playerName = username;
  req.session.playerId = id;
  req.session.save(() => {
    ref ? res.redirect(ref) : res.redirect('/');
  });
};

const createAuthRouter = ({ loginTemplatePath, signupTemplatePath }, usersdbPath) => {
  const loginTemplate = fs.readFileSync(loginTemplatePath, 'utf8');
  const signupTemplate = fs.readFileSync(signupTemplatePath, 'utf8');
  const users = JSON.parse(fs.readFileSync(usersdbPath, 'utf8'));

  const router = express.Router();
  router.use(['/login', '/sign-up'], redirectIfLoggedIn);
  router.get('/login', serveLoginPage(loginTemplate));
  router.post('/login', validateUser(users));
  router.get('/sign-up', serveSignupPage(signupTemplate));
  router.post('/sign-up', register(users, usersdbPath));
  return router;
};

module.exports = { createAuthRouter };
