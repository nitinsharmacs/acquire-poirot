const copyGameLink = (event) => {
  const textarea = document.createElement('textarea');
  document.body.appendChild(textarea);
  textarea.style.display = 'hidden';
  textarea.innerText = event.target.innerText;
  textarea.focus();
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
  alert('copied to clipboard');
};

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
      const { game } = res.body;
      renderPlayers(game);
      if (game.gameSize === game.players.length) {
        clearInterval(loadInterval);
        fetchReq('/api/start-game', { method: 'POST' },
          (res) => { });
        startGame();
      }
    });
  }, 330);
};

const main = () => {
  loadGame();
  document.getElementById('game-link').onclick = copyGameLink;

};

window.onload = main;
