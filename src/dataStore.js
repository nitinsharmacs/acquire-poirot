const fs = require('fs');

class DataStore {
  constructor(config) {
    this.config = config;
  }
  load(name) {
    return fs.readFileSync(this.config[name], 'utf8');
  }

  save(name, text) {
    fs.writeFileSync(this.config[name], text, 'utf8');
  }

  loadJSON(name) {
    return JSON.parse(this.load(name));
  }

  saveJSON(name, text) {
    this.save(name, JSON.stringify(text));
  }
}

module.exports = DataStore;
