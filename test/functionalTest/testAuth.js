const assert = require('assert');
const request = require('supertest');
const { createApp } = require('../../src/app.js');

const promise = (payload) => new Promise((res) => res(payload));

const session = (gameId, playerId) => () => (req, res, next) => {
  req.session = {};
  req.session.save = function (cb) {
    res.setHeader('set-cookie', 'connect.sid=23232');
    cb();
  };

  next();
};

const mockUsers = () => {
  return {
    users: [{ username: 'raju', password: 'abc', id: '123' }],
    find: function (username) {
      const user = this.users.find(user => user.username === username);
      return promise(user);
    },
    insert: function (user) {
      this.users.push(user);
    }
  };
};

const initApp = (session, users, games) => {
  const config = { session, root: './public', games, users };
  return createApp(config);
};

describe('GET /login', () => {
  it('should serve login page', (done) => {
    const app = initApp(session());
    const req = request(app);
    req.get('/login')
      .expect('content-type', /html/)
      .expect(200, done);
  });
});

describe('POST /login', () => {
  it('should serve login page with error 401(invalid credentials)',
    (done) => {
      const req = request(initApp(session(), mockUsers()));
      req.post('/login')
        .send({ username: 'raju', password: 'abcc' })
        .expect('content-type', /html/)
        .expect(401, /Invalid username or password/, done);
    });

  it('should serve login page with error 400(fields cannot be empty)',
    (done) => {
      const req = request(initApp(session(), mockUsers()));
      req.post('/login')
        .send({ username: '', password: '' })
        .expect('content-type', /html/)
        .expect(400, /Fields cannot be empty/, done);
    });

  it('should serve login page with error 404(user not found)',
    (done) => {
      const req = request(initApp(session(), mockUsers()));
      req.post('/login')
        .send({ username: 'rehan', password: 'j' })
        .expect('content-type', /html/)
        .expect(404, /User not found/, done);
    });

  it('should log the user in and set cookie', (done) => {
    const req = request(initApp(session(), mockUsers()));
    req.post('/login')
      .send({ username: 'raju', password: 'abc' })
      .expect('set-cookie', 'connect.sid=23232')
      .expect('location', '/')
      .expect(302, done);
  });

  it('should redirect to /host', (done) => {
    const req = request(initApp(session(), mockUsers()));
    req.post('/login?ref=/host')
      .send({ username: 'raju', password: 'abc' })
      .expect('location', '/host')
      .expect(302, done);
  });

  it('should redirect to /join/1', (done) => {
    const req = request(initApp(session(), mockUsers()));
    req.post('/login?ref=/join/1')
      .send({ username: 'raju', password: 'abc' })
      .expect('location', '/join/1')
      .expect(302, done);
  });
});

describe('GET /sign-up', () => {
  it('should serve signup page', (done) => {
    const req = request(initApp(session()));
    req.get('/sign-up')
      .expect('content-type', /html/)
      .expect(200, done);
  });
});

describe('POST /sign-up', () => {
  it('should register and log the user in and set cookie', (done) => {
    const users = mockUsers();

    const req = request(initApp(session(), users));
    req.post('/sign-up')
      .send({ username: 'hemant', password: 'abc' })
      .expect('location', '/')
      .expect('set-cookie', 'connect.sid=23232')
      .expect(302)
      .end(() => {
        users.find('hemant').then(user => {
          assert.ok(user);
          done();
        });
      });
  });

  it('should redirect to /host', (done) => {
    const users = mockUsers();

    const req = request(initApp(session(), users));
    req.post('/sign-up?ref=/host')
      .send({ username: 'hemant', password: 'abc' })
      .expect('location', '/host')
      .expect(302, done);
  });

  it('should redirect to /join/1', (done) => {
    const users = mockUsers();

    const req = request(initApp(session(), users));
    req.post('/sign-up?ref=/join/1')
      .send('username=diamond&password=die')
      .expect('location', '/join/1')
      .expect(302, done);
  });

  it('should serve sigup page with error 400(user already exists)',
    (done) => {
      const users = mockUsers();

      const req = request(initApp(session(), users));
      req.post('/sign-up')
        .send({ username: 'raju', password: 'abc' })
        .expect('content-type', /html/)
        .expect(400, /User already exists/, done);
    });

  it('should serve signup page with error 400(fields cannot be empty)',
    (done) => {
      const req = request(initApp(session(), mockUsers()));
      req.post('/sign-up')
        .send({ username: '', password: '' })
        .expect('content-type', /html/)
        .expect(400, /Fields cannot be empty/, done);
    });
});
