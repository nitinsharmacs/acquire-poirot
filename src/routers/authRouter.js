const express = require('express');

const errorMessage = (errCode) => {
  const customErrors = {
    404: 'Invalid username or password',
    401: 'Fields cannot be empty'
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
    .replace(/_REF_/, queryString);
  res.type('text/html');
  res.end(updatedTemplate);
};

const invalidCredentials = (users, username, password) => {
  return !users[username] || users[username].password !== password;
};

const validateUser = (req, res) => {
  const { username, password } = req.body;
  const users = { raju: { id: 1, username: 'raju', password: 'abc' } };

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

const createAuthRouter = ({ loginTemplatePath }, fs) => {
  const loginTemplate = fs.readFileSync(loginTemplatePath, 'utf8');
  const router = express.Router();
  router.use(['/login', '/sign-up'], redirectIfLoggedIn);
  router.get('/login', serveLoginPage(loginTemplate));
  router.post('/login', validateUser);
  router.get('/sign-up', (req, res) => {
    res.end('Mocked signup');
  });
  return router;
};

module.exports = { createAuthRouter };
