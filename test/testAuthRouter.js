const request = require('supertest');
const { createApp } = require('../src/app.js');
const Sinon = require('sinon');
const session = () => (req, res, next) => {
  req.session = {};
  req.session.save = function (cb) {
    res.setHeader('set-cookie', 'connect.sid=23232');
    cb();
  };

  next();
};

const initApp = () => {
  const config = { session, root: './public' };
  const dataStore = {
    load: Sinon.stub(),
    loadJSON: Sinon.stub(),
    saveJSON: Sinon.stub()
  };
  const mockUsers = {
    raju: { username: 'raju', password: 'abc', id: '127824693' }
  };
  dataStore.load.withArgs('LOGIN_TEMPLATE').returns('_MESSAGE_');
  dataStore.load.withArgs('SIGNUP_TEMPLATE').returns('_MESSAGE_');
  dataStore.loadJSON.withArgs('USERS_DB_PATH').returns(mockUsers);
  return createApp(config, dataStore);
};

describe('GET /login', () => {
  let app;
  beforeEach(() => {
    app = initApp();
  });

  it('should serve login page', (done) => {
    const req = request(app);
    req.get('/login')
      .expect('content-type', /html/)
      .expect(200, done);
  });

  it('should serve login page with apt error message 404(invalid credentials)',
    (done) => {
      const req = request(app);
      req.get('/login')
        .set('Cookie', 'errCode=404')
        .expect('content-type', /html/)
        .expect(200, /Invalid username or password/, done);
    });

  it('should serve login page with apt error msg 401(fields cannot be empty)',
    (done) => {

      const req = request(app);
      req.get('/login')
        .set('Cookie', 'errCode=401')
        .expect('content-type', /html/)
        .expect(200, /Fields cannot be empty/, done);
    });
});

describe('POST /login', () => {
  let app;
  beforeEach(() => {
    app = initApp();
  });
  it('should log the user in and set cookie', (done) => {
    const req = request(app);
    req.post('/login')
      .send('username=raju&password=abc')
      .expect('location', '/')
      .expect(302, done);
  });

  it('should redirect to /host', (done) => {
    const req = request(app);
    req.post('/login?ref=/host')
      .send('username=raju&password=abc')
      .expect('location', '/host')
      .expect(302, done);
  });

  it('should redirect to /join/1', (done) => {
    const req = request(app);
    req.post('/login?ref=/join/1')
      .send('username=raju&password=abc')
      .expect('location', '/join/1')
      .expect(302, done);
  });
});

describe('GET /sign-up', () => {
  let app;
  beforeEach(() => {
    app = initApp();
  });
  it('should serve signup page', (done) => {
    const req = request(app);
    req.get('/sign-up')
      .expect('content-type', /html/)
      .expect(200, done);
  });

  it('should serve login page with apt error message 409(user already exists)',
    (done) => {
      const req = request(app);
      req.get('/sign-up')
        .set('Cookie', 'errCode=409')
        .expect('content-type', /html/)
        .expect(200, /User already exists/, done);
    });

  it('should serve login page with apt error msg 401(fields cannot be empty)',
    (done) => {
      const req = request(app);
      req.get('/sign-up')
        .set('Cookie', 'errCode=401')
        .expect('content-type', /html/)
        .expect(200, /Fields cannot be empty/, done);
    });
});

describe('POST /sign-up', () => {
  let app;
  beforeEach(() => {
    app = initApp();
  });

  it('should register and log the user in and set cookie', (done) => {
    const req = request(app);
    req.post('/sign-up')
      .send('username=rani&password=abc123')
      .expect('location', '/')
      .expect(302, done);
  });

  it('should redirect to /host', (done) => {
    const req = request(app);
    req.post('/sign-up?ref=/host')
      .send('username=newraju&password=abc')
      .expect('location', '/host')
      .expect(302, done);
  });

  it('should redirect to /join/1', (done) => {
    const req = request(app);
    req.post('/sign-up?ref=/join/1')
      .send('username=diamond&password=die')
      .expect('location', '/join/1')
      .expect(302, done);
  });
});
