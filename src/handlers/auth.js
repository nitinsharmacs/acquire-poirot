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

  res.render('auth', { forSignup: false, ref: queryString });
};

const serveSignupPage = (req, res) => {
  const { ref } = req.query;
  const queryString = refQueryString(ref);

  res.render('auth', { forSignup: true, ref: queryString });
};

const validatePassword = (user, password) => {
  return user.password !== password;
};

const haveNoValue = (username, password) => {
  return !username || !password;
};

const login = users => async (req, res) => {
  const { username, password } = req.body;

  const { ref } = req.query;
  const queryString = refQueryString(ref);

  if (haveNoValue(username, password)) {
    return res.status(400).render('auth', {
      ref: queryString,
      error: errorMessage('NOEMPTY')
    });
  }

  const user = await users.find(username);
  if (!user) {
    return res.status(404).render('auth', {
      ref: queryString,
      error: errorMessage('NOTFOUND')
    });
  }

  if (validatePassword(user, password)) {
    return res.status(401).render('auth', {
      ref: queryString,
      error: errorMessage('INVALID_CRED')
    });
  }

  req.session.playerName = user.username;
  req.session.playerId = user.id;

  req.session.save(() => {
    ref ? res.redirect(ref) : res.redirect('/');
  });
};

const register = (users) => async (req, res) => {
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

  const user = await users.find(username);

  if (user) {
    return res.status(400).render('auth', {
      ref: queryString,
      error: errorMessage('USERPRESENT'),
      forSignup: true
    });
  }

  const id = new Date().getTime().toString();
  const newUser = { username, password, id };

  await users.insert(newUser);

  req.session.playerName = username;
  req.session.playerId = id;
  req.session.save(() => {
    ref ? res.redirect(ref) : res.redirect('/');
  });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
  res.end();
};

module.exports = {
  serveLoginPage,
  validateUser: login,
  serveSignupPage,
  register,
  logout
};
