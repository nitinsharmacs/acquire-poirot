const copyGameLink = () => {
  const textarea = document.createElement('textarea');
  textarea.style.display = 'hidden';
  document.body.appendChild(textarea);

  const gameLinkInput = document.getElementById('game-link');
  textarea.innerText = gameLinkInput.value;
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
  fetch('/api/start-game', { method: 'POST' })
    .then(res => res.json())
    .then(res => {
      window.location.href = '/game';
    });
};

const hasGameStarted = (game) => game.gameSize === game.players.length;

const loadGame = () => {
  const loadInterval = setInterval(() => {
    fetch('/api/loadgame', { method: 'get' })
      .then(res => res.json())
      .then(({ game }) => {
        renderPlayers(game);

        if (hasGameStarted(game)) {
          clearInterval(loadInterval);
          startGame();
        }
      });
  }, 330);
};

const main = () => {
  loadGame();
  document.getElementById('copy-btn').onclick = copyGameLink;

};

window.onload = main;
