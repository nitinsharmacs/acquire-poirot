const request = require('supertest');
const { createApp } = require('../src/app.js');

describe('GET /host', () => {
  const appConfig = {
    root: './public',
    cookieConfig: {
      sessionKey: 'hello'
    },
    resources: {
      loginTemplatePath: './resources/login.html',
      hostTemplatePath: './resources/host-page.html',
      signupTemplatePath: './resources/sign-up.html'
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
    cookieConfig: {
      sessionKey: 'hello'
    },
    resources: {
      loginTemplatePath: './resources/login.html',
      hostTemplatePath: './resources/host-page.html',
      signupTemplatePath: './resources/sign-up.html'
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

