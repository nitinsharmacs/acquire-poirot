// Creating game players list --------------------
const createPlayerItem = (player, game) => {
  const activeClass = player.id === game.currentPlayer.id ? 'active' : '';
  const activeTag = player.id === game.player.id ? '(You)' : '';

  return ['div',
    { class: `player-item ${activeClass}` },
    {},
    ['div', { class: 'highlight' }, {}],
    ['p', {}, {}, `${player.name}`],
    ['span', {}, {}, ` ${activeTag}`]
  ];
};
const createPlayers = (game) => {
  const playersList = game.players.map((player) => {
    return createPlayerItem(player, game);
  });

  return createElements(playersList);
};

// main
const renderPlayers = (game) => {
  const playersList = document.querySelector('#players-list');

  const playersHtml = createPlayers(game);
  playersList.replaceChildren(...playersHtml);
};
