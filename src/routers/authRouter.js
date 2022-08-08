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
  let updatedTemplate = loginTemplate.replace(/_MESSAGE_/, errMsg);
  if (ref) {
    updatedTemplate = updatedTemplate.replace(/_REF_/, '?ref=' + ref);
  } else {
    updatedTemplate = updatedTemplate.replace(/_REF_/, '');
  }
  res.type('text/html');
  res.end(updatedTemplate);
};

const invalidCredentials = (users, username, password) => {
  return !users[username] || users[username].password !== password;
};

const validateUser = (req, res) => {
  const { username, password } = req.body;
  const users = { raju: { id: 1, username: 'raju', password: 'abc' } };
  if (!username || !password) {
    res.cookie('errCode', 401);
    return res.redirect('/login');
  }
  if (invalidCredentials(users, username, password)) {
    res.cookie('errCode', 404);
    return res.redirect('/login');
  }
  req.session = { playerName: username };
  if (req.query.ref) {
    return res.redirect(req.query.ref);
  }
  return res.redirect('/');
};

const createAuthRouter = ({ loginTemplatePath }, fs) => {
  const loginTemplate = fs.readFileSync(loginTemplatePath, 'utf8');
  const router = express.Router();
  router.get('/login', serveLoginPage(loginTemplate));
  router.post('/login', validateUser);
  return router;
};

module.exports = { createAuthRouter };
