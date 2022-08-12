class GameState {
  constructor({ player,
    players,
    board,
    cluster,
    logs,
    currentPlayer,
    corporations,
    gameSize
  }) {
    this.player = player;
    this.players = players;
    this.board = board;
    this.cluster = cluster;
    this.logs = logs;
    this.currentPlayer = currentPlayer;
    this.corporations = corporations;
    this.step = 1;
    this.gameSize = gameSize;
  }

  isMyTurn() {
    return this.player.id === this.currentPlayer.id;
  }
}

class Board {
  constructor({ tiles }) {
    this.tiles = tiles;
  }

  #findTile(tileId) {
    return this.tiles.find(tile => tile.id === tileId);
  }

  placeTile({ id }) {
    const tile = this.#findTile(id);
    tile.placed = true;
  }

  buildCorporation({ id }, corporation) {
    const tile = this.#findTile(id);
    if (!tile.placed) {
      return;
    }

    tile.corporation = {
      name: corporation.name,
      id: corporation.id
    };
  }
}

class Player {
  constructor({ id, name, tiles, money, stocks }) {
    this.id = id;
    this.name = name;
    this.tiles = tiles || [];
    this.money = money || 6000;
    this.stocks = stocks;
  }

  #removeTile({ id }) {
    this.tiles = this.tiles.filter(tile => tile.id !== id);
  }

  placeTile(tileId, board) {
    console.log(this.tiles);
    this.#removeTile({ id: tileId });
    console.log(this.tiles);
    board.placeTile({ id: tileId });
  }

  drawTile(tile) {
    this.tiles.push(tile);
  }
}

const createPlayer = ({ player }) => {
  return new Player({
    id: player.id,
    name: player.name,
    tiles: player.tiles,
    money: player.money,
    stocks: player.stocks,
  });
};

const createState = (game) => {
  return new GameState({
    player: createPlayer(game),
    players: game.players,
    board: new Board(game.board),
    cluster: game.cluster,
    logs: game.logs,
    currentPlayer: game.currentPlayer,
    corporations: game.corporations,
    gameSize: game.gameSize
  });
};

