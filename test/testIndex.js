const request = require('supertest');
const { createApp } = require('../src/app.js');
const Sinon = require('sinon');

const session = () => (req, res, next) => {
  req.session = {};
  req.session.playerId = '1123';
  req.session.save = function (cb) {
    res.setHeader('set-cookie', 'connect.sid=23232');
    cb();
  };

  next();
};
const initApp = (session) => {
  const config = { session, root: './public' };
  return createApp(config);
};

describe('GET /', () => {
  it('should show landing page', (done) => {
    request(initApp(session))
      .get('/')
      .expect('Content-type', /html/)
      .expect(200, done);
  });
});
