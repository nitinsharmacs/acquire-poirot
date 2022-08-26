const { refQueryString } = require('../utils/auth.js');

const errorMessage = (errCode) => {
  const customErrors = {
    INVALID_CRED: 'Invalid username or password',
    NOEMPTY: 'Fields cannot be empty',
    USERPRESENT: 'User already exists',
    NOTFOUND: 'User not found'
  };
  return customErrors[errCode];
};

const serveLoginPage = (req, res) => {
  const { ref } = req.query;
  const queryString = refQueryString(ref);

  res.type('text/html');
  res.render('auth', { forSignup: false, ref: queryString });
};

const serveSignupPage = (req, res) => {
  const { ref } = req.query;
  const queryString = refQueryString(ref);

  console.log('query string', queryString);
  res.type('text/html');
  res.render('auth', { forSignup: true, ref: queryString });
};

const invalidCredentials = (users, username, password) => {
  return !users[username] || users[username].password !== password;
};

const haveNoValue = (username, password) => {
  return !username || !password;
};

const login = users => (req, res) => {
  const { username, password } = req.body;

  const { ref } = req.query;
  const queryString = refQueryString(ref);

  if (haveNoValue(username, password)) {
    return res.status(400).render('auth', {
      ref: queryString,
      error: errorMessage('NOEMPTY')
    });
  }

  if (invalidCredentials(users, username, password)) {
    return res.status(401).render('auth', {
      ref: queryString,
      error: errorMessage('INVALID_CRED')
    });
  }

  req.session.playerName = username;
  req.session.playerId = users[username].id;

  req.session.save(() => {
    ref ? res.redirect(ref) : res.redirect('/');
  });
};

const register = (users, dataStore) => (req, res) => {
  const { username, password } = req.body;
  const { ref } = req.query;
  const queryString = refQueryString(ref);

  if (haveNoValue(username, password)) {
    return res.status(400).render('auth', {
      ref: queryString,
      error: errorMessage('NOEMPTY'),
      forSignup: true
    });
  }

  if (users[username]) {
    return res.status(400).render('auth', {
      ref: queryString,
      error: errorMessage('USERPRESENT'),
      forSignup: true
    });
  }

  const id = new Date().getTime().toString();
  const user = { username, password, id };
  users[username] = user;

  dataStore.saveJSON('USERS_DB_PATH', users);

  req.session.playerName = username;
  req.session.playerId = id;
  req.session.save(() => {
    ref ? res.redirect(ref) : res.redirect('/');
  });
};

module.exports = {
  serveLoginPage,
  validateUser: login,
  serveSignupPage,
  register
};
