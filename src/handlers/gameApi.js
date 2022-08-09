const tile1 = {
  label: '1A',
  id: '1a',
  placed: false //Boolean
};

const tile2 = {
  label: '2A',
  id: '2a',
  placed: false //Boolean
};

const tile3 = {
  label: '3A',
  id: '3a',
  placed: false //Boolean
};

const tile4 = {
  label: '4A',
  id: '4a',
  placed: false //Boolean
};

const player1 = {
  id: 'player1',
  name: 'Tanmay',
  money: 6000, // Number
  stocks: [],
  tiles: [tile1, tile2, tile3, tile4]
};

const player2 = {
  id: 'player2',
  name: 'Sampriti',
  money: 6000, // Number
  stocks: [],
  tiles: [tile1, tile2, tile3, tile4]
};

const players = [player1, player2];

const corporations = [
  {
    id: 'america',
    name: 'America',
    active: false, //Boolean,
    stocksLeft: 25,
    tiles: []
  },
  {
    id: 'hydra',
    name: 'Hydra',
    active: true, //Boolean
    stocksLeft: 25,
    tiles: []
  },
  {
    id: 'fusion',
    name: 'Fusion',
    active: true, //Boolean
    stocksLeft: 25,
    tiles: []
  },
  {
    id: 'zeta',
    name: 'Zeta',
    active: true, //Boolean
    stocksLeft: 25,
    tiles: []
  },
  {
    id: 'quantum',
    name: 'Quantum',
    active: true, //Boolean
    stocksLeft: 25,
    tiles: []
  },
  {
    id: 'phoneix',
    name: 'Phoneix',
    active: true, //Boolean
    stocksLeft: 25,
    tiles: []
  },
  {
    id: 'sackson',
    name: 'Sackson',
    active: true, //Boolean
    stocksLeft: 25,
    tiles: []
  }
];

const game = {
  gameId: '12',
  players,
  currentPlayer: player2,
  corporations
};

const loadGame = (req, res) => {
  const { gameId } = req.params;

  if (gameId !== game.gameId) {
    return res.status(404).json({ message: 'game not found' });
  }

  res.json(game);
};

module.exports = { loadGame };
