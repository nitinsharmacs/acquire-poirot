const redis = require('redis');

const createClient = (url) => new Promise((res, rej) => {
  const client = url ?
    redis.createClient({ url }) : redis.createClient();
  client.on('error', (err) => rej(err));

  client.connect().then(() => {
    res(client);
  });
});

module.exports = { createClient };
