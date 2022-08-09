
// <div class="player">
//   <div class="player-avatar">
//     <img src="/images/usericon.png" alt="avatar">
//   </div>
//   <div class="player-name">Sam</div>
// </div>

const createPlayer = (player) => {
  return ['div', { class: 'player' }, {},
    ['div', { class: 'player-avatar' }, {},
      ['img', { src: '/images/usericon.png', alt: 'avatar' }]
    ],
    ['div', { class: 'player-name' }, {},
      player.name
    ],
  ];
};

const renderPlayers = ({ players }) => {
  const playersContainer = document.querySelector('.players');
  playersContainer.innerText = '';

  const playersElements = players.map(createPlayer);

  playersContainer.append(...createElements(playersElements));
};

const startGame = () => {
  window.location.href = '/game';
};

const loadGame = () => {
  const loadInterval = setInterval(() => {
    fetchReq('/api/loadgame', {
      method: 'get'
    }, (res) => {
      const game = res.body;
      renderPlayers(game);
      if (game.gameSize === game.players.length) {
        clearInterval(loadInterval);
        startGame();
      }
    });
  }, 330);
};

const main = () => {
  loadGame();
};

window.onload = main;
