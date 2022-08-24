class Poller {
  #ms;
  #onResponse;
  #res;
  #intervalId;
  constructor(ms, onResponse) {
    this.#ms = ms;
    this.#onResponse = onResponse;
    this.#res = '';
    this.#intervalId;
  }

  start() {
    this.#intervalId = setInterval(() => {
      API.loadGame().then(res => {
        if (this.#res === res) {
          return;
        }

        this.#res = res;
        this.#response(this.#res);
      }).catch(err => console.log(err));
    }, this.#ms);
  }

  stop() {
    clearInterval(this.#intervalId);
  }

  #response() {
    this.#onResponse(JSON.parse(this.#res).game);
  }
}