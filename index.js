const session = require('express-session');
const { Games } = require('./src/models/games.js');
const { GameStore } = require('./src/models/gameStore.js');

require('dotenv').config();
const { createApp } = require('./src/app.js');
const { createClient } = require('./src/utils/redis.js');
const { RedisStore } = require('./src/models/redisStore.js');
const { Users } = require('./src/models/users.js');
const { UserStore } = require('./src/models/userStore.js');

const {
  NODE_ENV,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USER,
  REDIS_PASS
} = process.env;

let url;
if (NODE_ENV === 'production') {
  url = `redis://${REDIS_USER}:${REDIS_PASS}@${REDIS_HOST}:${REDIS_PORT}`;
}

createClient(url)
  .then((client) => {
    const redisStore = new RedisStore(client);
    return {
      gameStore: new GameStore(redisStore),
      userStore: new UserStore(redisStore)
    };
  })
  .then(({ gameStore, userStore }) => {
    return {
      root: './public',
      sessionKey: process.env.SESSION_KEY,
      session,
      games: new Games([], gameStore),
      users: new Users(userStore)
    };
  })
  .then(appConfig => {
    const app = createApp(appConfig);
    const port = process.env.PORT || 8888;

    app.listen(port, () =>
      console.log(`Listening on ${port}`));
  })
  .catch(err => console.error(err));

