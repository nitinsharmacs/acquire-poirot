const promise = (payload) => new Promise((res) => res(payload));

class UserStore {
  #store;
  #users;
  constructor(store) {
    this.#store = store;
    this.#users = [];
  }

  #findLocally(username) {
    return this.#users.find(user => user.username === username);
  }

  find(username) {
    const user = this.#findLocally(username);
    if (user) {
      return promise(user);
    }

    return this.#store.get('users', username);
  }

  insert(user) {
    this.#users.push(user);
    return this.#store.set('users', user.username, user);
  }
}

module.exports = { UserStore };
