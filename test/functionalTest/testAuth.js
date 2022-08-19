const request = require('supertest');
const { createApp } = require('../../src/app.js');
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
});

describe('POST /login', () => {
  let app;
  beforeEach(() => {
    app = initApp();
  });

  it('should serve login page with error 401(invalid credentials)',
    (done) => {
      const req = request(app);
      req.post('/login')
        .send('username=raju&password=abcc')
        .expect('content-type', /html/)
        .expect(401, /Invalid username or password/, done);
    });

  it('should serve login page with error 400(fields cannot be empty)',
    (done) => {

      const req = request(app);
      req.post('/login')
        .send('username=&password=')
        .expect('content-type', /html/)
        .expect(400, /Fields cannot be empty/, done);
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

  it('should serve sigup page with error 400(user already exists)',
    (done) => {
      const req = request(app);
      req.post('/sign-up')
        .send('username=raju&password=abc')
        .expect('content-type', /html/)
        .expect(400, /User already exists/, done);
    });

  it('should serve signup page with error 400(fields cannot be empty)',
    (done) => {
      const req = request(app);
      req.post('/sign-up')
        .send('username=&password=')
        .expect('content-type', /html/)
        .expect(400, /Fields cannot be empty/, done);
    });
});
