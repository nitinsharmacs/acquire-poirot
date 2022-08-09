const request = require('supertest');
const { createApp } = require('../src/app.js');

const session = () => (req, res, next) => {
  req.session = {};
  req.session.save = function (cb) {
    res.setHeader('set-cookie', 'connect.sid=23232');
    cb();
  };

  next();
};

describe('GET /host', () => {
  const appConfig = {
    root: './public',
    session,
    cookieConfig: {
      sessionKey: 'hello'
    },
    resources: {
      loginTemplatePath: './resources/login.html',
      hostTemplatePath: './resources/host-page.html',
      signupTemplatePath: './resources/sign-up.html',
      gameTemplatePath: './resources/game.html',
    },
    db: { usersdbPath: './test/testData/users.json' }
  };

  it('should redirect to login page if session not present', (done) => {
    request(createApp(appConfig))
      .get('/host')
      .expect('location', '/login?ref=host')
      .expect(302, done);
  });
});

describe('POST /host', () => {
  const appConfig = {
    root: './public',
    session,
    cookieConfig: {
      sessionKey: 'hello'
    },
    resources: {
      loginTemplatePath: './resources/login.html',
      hostTemplatePath: './resources/host-page.html',
      signupTemplatePath: './resources/sign-up.html',
      gameTemplatePath: './resources/game.html'
    },
    db: { usersdbPath: './test/testData/users.json' }
  };

  it('should redirect to login page if session not present', (done) => {
    request(createApp(appConfig))
      .post('/host')
      .expect('location', '/login?ref=host')
      .expect(302, done);
  });
});

describe('GET /host', () => {

  const session = () => (req, res, next) => {
    req.session = {};
    req.session.playerId = '1123';
    req.session.save = function (cb) {
      res.setHeader('set-cookie', 'connect.sid=23232');
      cb();
    };

    next();
  };

  const app = createApp({
    root: './public',
    session,
    cookieConfig: {
      sessionKey: 'hello'
    },
    resources: {
      loginTemplatePath: './resources/login.html',
      hostTemplatePath: './resources/host-page.html',
      signupTemplatePath: './resources/sign-up.html',
      gameTemplatePath: './resources/game.html'
    },
    db: { usersdbPath: './test/testData/users.json' }
  });

  it('should give host page is session present', (done) => {
    request(app)
      .get('/host')
      .expect('content-type', /html/)
      .expect(200, done);
  });
});

describe('POST /host', () => {

  const session = () => (req, res, next) => {
    req.session = {};
    req.session.playerId = '1123';
    req.session.save = function (cb) {
      res.setHeader('set-cookie', 'connect.sid=23232');
      cb();
    };

    next();
  };

  const app = createApp({
    root: './public',
    session,
    cookieConfig: {
      sessionKey: 'hello'
    },
    resources: {
      loginTemplatePath: './resources/login.html',
      hostTemplatePath: './resources/host-page.html',
      signupTemplatePath: './resources/sign-up.html',
      gameTemplatePath: './resources/game.html'
    },
    db: { usersdbPath: './test/testData/users.json' }
  });

  it('should show lobby when host enter no of players and host a game', (done) => {
    request(app)
      .post('/host')
      .send('host=localhost&noOfPlayers=4')
      .expect('content-type', /html/)
      .expect(200, done);
  });
});

describe('POST /host', () => {

  const session = () => (req, res, next) => {
    req.session = {};
    req.session.playerId = '1123';
    req.session.save = function (cb) {
      res.setHeader('set-cookie', 'connect.sid=23232');
      cb();
    };

    next();
  };

  const app = createApp({
    root: './public',
    session,
    cookieConfig: {
      sessionKey: 'hello'
    },
    resources: {
      loginTemplatePath: './resources/login.html',
      hostTemplatePath: './resources/host-page.html',
      signupTemplatePath: './resources/sign-up.html',
      gameTemplatePath: './resources/game.html'
    },
    db: { usersdbPath: './test/testData/users.json' }
  });

  it('should show error in host page when host did not enter no of players and host a game', (done) => {
    request(app)
      .post('/host')
      .send('host=localhost')
      .expect('content-type', /html/)
      .expect(/Please enter valid number of players/)
      .expect(200, done);
  });
});

