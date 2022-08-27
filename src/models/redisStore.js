const parse = (arg) => JSON.parse(arg);

const stringify = (arg) => JSON.stringify(arg);

class RedisStore {
  #client;
  constructor(client) {
    this.#client = client;
  }

  set(field, key, value) {
    return this.#client.hSet(field, key, stringify(value));
  }

  get(field, key) {
    let value;
    return this.#client.hGet(field, key)
      .then(_value => {
        value = _value;
        return parse(_value);
      })
      .catch(() => {
        return value;
      });
  }

  getAll(field) {
    let value;
    return this.#client.hGetAll(field)
      .then(_value => {
        value = _value;
        const values = Object.values(_value);
        return values.map(value => parse(value));
      }).catch(() => {
        return value;
      });
  }
}

module.exports = { RedisStore };
