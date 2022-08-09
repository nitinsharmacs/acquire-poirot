const request = require('supertest');
const { createApp } = require('../src/app.js');
const fs = require('fs');

const session = () => (req, res, next) => {
  req.session = {};
  req.session.save = function (cb) {
    res.setHeader('set-cookie', 'connect.sid=23232');
    cb();
  };

  next();
};

describe('GET /login', () => {
  const appConfig = {
    root: './public',
    session,
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
  beforeEach(done => {
    const users = {
      raju:
        { username: 'raju', password: 'abc', id: '127824693' }
    };

    fs.writeFileSync('./test/testData/users.json',
      JSON.stringify(users), 'utf8');
    done();
  });
  const appConfig = {
    root: './public',
    session,
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

describe('GET /sign-up', () => {
  const appConfig = {
    root: './public',
    session,
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

  it('should serve signup page', (done) => {
    const req = request(createApp(appConfig));
    req.get('/sign-up')
      .expect('content-type', /html/)
      .expect(200, done);
  });

  it('should serve login page with apt error message 409(user already exists)',
    (done) => {
      const req = request(createApp(appConfig));
      req.get('/sign-up')
        .set('Cookie', 'errCode=409')
        .expect('content-type', /html/)
        .expect(200, /User already exists/, done);
    });

  it('should serve login page with apt error msg 401(fields cannot be empty)',
    (done) => {
      const req = request(createApp(appConfig));
      req.get('/sign-up')
        .set('Cookie', 'errCode=401')
        .expect('content-type', /html/)
        .expect(200, /Fields cannot be empty/, done);
    });
});

describe('POST /sign-up', () => {
  beforeEach(done => {
    fs.writeFileSync('./test/testData/users.json',
      JSON.stringify({}), 'utf8');
    done();
  });

  const appConfig = {
    root: './public',
    session,
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

  it('should register and log the user in and set cookie', (done) => {
    const req = request(createApp(appConfig));
    req.post('/sign-up')
      .send('username=rani&password=abc123')
      .expect('location', '/')
      .expect(302, done);
  });

  it('should redirect to /host', (done) => {
    const req = request(createApp(appConfig));
    req.post('/sign-up?ref=/host')
      .send('username=raju&password=abc')
      .expect('location', '/host')
      .expect(302, done);
  });

  it('should redirect to /join/1', (done) => {
    const req = request(createApp(appConfig));
    req.post('/sign-up?ref=/join/1')
      .send('username=diamond&password=die')
      .expect('location', '/join/1')
      .expect(302, done);
  });
});
