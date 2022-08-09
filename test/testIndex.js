const request = require('supertest');
const { createApp } = require('../src/app.js');

const session = () => (req, res, next) => {
  req.session = {};
  req.session.playerId = '1123';
  req.session.save = function (cb) {
    res.setHeader('set-cookie', 'connect.sid=23232');
    cb();
  };

  next();
};

describe('GET /', () => {
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

  it('should show landing page', (done) => {
    request(createApp(appConfig))
      .get('/')
      .expect('Content-type', /html/)
      .expect(200, done);
  });
});
