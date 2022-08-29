class Users {
  #store;
  constructor(store) {
    this.#store = store;
  }

  find(username) {
    return this.#store.find(username);
  }

  insert(user) {
    return this.#store.insert(user);
  }
}

module.exports = { Users };
