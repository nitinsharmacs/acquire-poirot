const replaceTick = () => {
  const copyButton = ['button',
    { class: 'fa-solid fa-clipboard', id: 'copy-btn' },
    { onclick: copyGameLink }
  ];
  const tickElement = document.querySelector('#tick');
  tickElement.replaceWith(createDOMTree(copyButton));
};

const replaceCopyButton = () => {
  const copyButton = document.querySelector('#copy-btn');

  const tick = ['div',
    { class: 'fa-solid fa-clipboard-check', id: 'tick' }
  ];
  copyButton.replaceWith(createDOMTree(tick));

  setTimeout(replaceTick, 2000);
};

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

  replaceCopyButton();
};

const createPlayer = (joinee, player) => {
  let classname = '';

  if (joinee.id === player.id) {
    classname = 'highlight-joinee';
  }

  return ['div', { class: `player ${classname}` }, {},
    ['div', { class: 'player-avatar' }, {},
      ['img', { src: '/images/usericon.png', alt: 'avatar' }]
    ],
    ['div', { class: 'player-name' }, {},
      joinee.name
    ],
  ];
};

const renderPlayers = ({ players: joinees, player }) => {
  const playersContainer = document.querySelector('.players');
  playersContainer.innerText = '';

  const playersElements = joinees.map((joinee) => createPlayer(joinee, player));

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
  }, 300);
};

const main = () => {
  loadGame();
  document.getElementById('copy-btn').onclick = copyGameLink;
};

window.onload = main;
