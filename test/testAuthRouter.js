const request = require('supertest');
const { createApp } = require('../src/app.js');

describe('GET /login', () => {
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

  it('should serve login page', (done) => {
    const req = request(createApp(appConfig));
    req.get('/login')
      .expect('content-type', /html/)
      .expect(200, done);
  });

  it('should serve login page with apt error message 404(invalid credentials)',
    (done) => {

      const req = request(createApp(appConfig));
      req.get('/login')
        .set('Cookie', 'errCode=404')
        .expect('content-type', /html/)
        .expect(200, /Invalid username or password/, done);
    });

  it('should serve login page with apt error msg 401(fields cannot be empty)',
    (done) => {

      const req = request(createApp(appConfig));
      req.get('/login')
        .set('Cookie', 'errCode=401')
        .expect('content-type', /html/)
        .expect(200, /Fields cannot be empty/, done);
    });
});

describe('POST /login', () => {
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

  it('should log the user in and set cookie', (done) => {
    const req = request(createApp(appConfig));
    req.post('/login')
      .send('username=raju&password=abc')
      .expect('location', '/')
      .expect(302, done);
  });

  it('should redirect to /host', (done) => {
    const req = request(createApp(appConfig));
    req.post('/login?ref=/host')
      .send('username=raju&password=abc')
      .expect('location', '/host')
      .expect(302, done);
  });

  it('should redirect to /join/1', (done) => {
    const req = request(createApp(appConfig));
    req.post('/login?ref=/join/1')
      .send('username=raju&password=abc')
      .expect('location', '/join/1')
      .expect(302, done);
  });
});
