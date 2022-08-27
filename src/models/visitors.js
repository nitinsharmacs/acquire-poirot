class StoreVisitor {
  constructor() {
    this.game = {
      corporations: [],
      players: [],
    };
  }

  visit(game) {
    this.game = { ...this.game, ...game.getState() };
  }

  visitCorporation(corporation) {
    this.game.corporations.push(corporation.getState());
  }

  visitPlayer(player) {
    this.game.players.push(player.getState());
  }

  visitBoard(board) {
    this.game.board = board.getState();
  }

  visitLogs(logs) {
    this.game.logs = logs.getState();
  }

  get gameData() {
    return this.game;
  }
}

module.exports = { StoreVisitor };
