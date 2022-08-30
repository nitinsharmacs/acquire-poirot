const sortPlayers = (players) => {
  return players.sort((player1, player2) => {
    if (player1.money > player2.money) {
      return -1;
    }
    return 0;
  });
};

const highlightPlayer = (playerId) => {
  const elements = selectAll(`tr[data-player-id="${playerId}"]`);
  elements.forEach(element => {
    addClass(element, 'highlight-player');
  });
};

const removeHighlightPlayer = () => {
  const elements = selectAll('tr[data-player-id]');
  elements.forEach(element => {
    removeClass(element, 'highlight-player');
  });
};

const createPlayersName = (players) => {
  return players.map(({ name, id }) => {
    return ['td', {}, {
      onmouseover: () => highlightPlayer(id),
      onmouseleave: () => removeHighlightPlayer()
    }, name];
  });
};

const createPlayersMoney = (players) => {
  return players.map(({ money }) => {
    return ['td', {}, {}, `$${money}`];
  });
};

const createMoneyTable = (players) => {
  return ['table', { class: 'player-money-table' }, {},
    ['tr', {}, {},
      ['th', {}, {}, 'Players'], ...createPlayersName(players)
    ],
    ['tr', {}, {},
      ['th', {}, {}, 'Money'], ...createPlayersMoney(players)
    ]
  ];
};

const gameOverPanel = (winner) => {
  const panel = ['div', { class: 'game-over-panel' }, {},
    ['div', {}, {},
      ['h1', {}, {}, 'Game Over'],
      ['h2', {}, {}, `${winner.name} Won!`]
    ]
  ];

  const panelElement = createDOMTree(panel);

  return {
    come: () => {
      const bodyElement = select('.page-wrapper');
      bodyElement.appendChild(panelElement);
      highlight(panelElement);
    },
    hide: () => {
      addClass(panelElement, 'hide');
      setTimeout(() => {
        panelElement.remove();
      }, 1000);
    }
  };
};

const majorityMinorityStyle = (bonusType) => {
  switch (bonusType) {
    case 'majority': return 'lightgreen';
    case 'minority': return 'yellow';
    case 'majority and minority': return 'lightgreen';
    default: return '';
  }
};

const round = (num) => Math.round(num);

const createBonuses = (cardDetails) => {
  return cardDetails.map(({ name, stock, bonusType, bonus, playerId }) =>
    [
      'tr', { 'data-player-id': playerId }, {},
      ['td', {}, {}, name],
      ['td', {}, {}, `${stock ? stock : '-'}`],
      ['td', {}, {}, bonusType || '-'],
      ['td', { style: `color: ${majorityMinorityStyle(bonusType)}` }, {}, `${bonus ? `$${round(bonus)}` : '-'}`],
    ]);
};

const corporationCard = ({ corporationId, corporationName }, cardDetails) => {
  return ['div', { class: `corporation-card ${corporationId}-stock` }, {},
    ['div', { class: 'corporation-card-img' }, {},
      ['img', { src: `/images/corps/${corporationId}.png` }, {}]
    ],
    ['h2', {}, {}, corporationName || '-'],
    ['table', { class: 'bonuses' }, {},
      ['thead', {}, {},
        ['th', {}, {}, 'Players'],
        ['th', {}, {}, 'Stocks'],
        ['th', {}, {}, 'Bonus Type'],
        ['th', {}, {}, 'Bonus']
      ],
      ['tbody', {}, {},
        ...createBonuses(cardDetails),
      ]
    ]
  ];
};

const getStock = (playerId, { stockHolders }) => {
  const stockHolder = stockHolders.find(({ id }) => id === playerId);
  if (stockHolder) {
    return stockHolder.stock.count;
  }
};

const getBonus = (playerId, { bonusHolders }) => {
  const bonusHolder = bonusHolders.find(({ id }) => id === playerId);
  if (bonusHolder) {
    return {
      bonusType: bonusHolder.bonusType,
      bonus: bonusHolder.money
    };
  }
};

const createCorporationCard = (players, activeCorporation) => {
  const cardDetails = players.map(player => {
    const stock = getStock(player.id, activeCorporation.distributedBonus);
    const { bonusType, bonus } = getBonus(player.id, activeCorporation.distributedBonus) || {};
    return {
      name: player.name,
      stock,
      bonusType,
      bonus,
      playerId: player.id
    };
  });
  return corporationCard(activeCorporation, cardDetails);
};

const createCorporationCards = (players, activeCorporations) => {
  return activeCorporations.map(corporation =>
    createCorporationCard(players, corporation));
};

const createGameStats = (players, activeCorporations, winner) => {
  const gameStats = ['div', { class: 'end-game-stats' }, {},
    ['h2', {}, {}, `${winner.name} Won!`],
    ['div', { style: 'text-align: center;padding:1em; display: inline-block;position: absolute;top:10px;right:10px;' }, {},
      ['a', { class: 'btn theme-btn', href: '/' }, {}, 'Home']
    ],
    createMoneyTable(sortPlayers([...players])),
    ['div', { class: 'corporation-cards' }, {},
      ...createCorporationCards(players, activeCorporations),

    ]
  ];

  const gameStatsElement = createDOMTree(gameStats);

  const bodyElement = select('.page-wrapper');
  bodyElement.appendChild(gameStatsElement);
  return {
    come: () => {
      highlight(gameStatsElement);
      addClass(gameStatsElement, 'stats-enter');
    }
  };
};

const showEndGamePopup = (endGameStats, players, winner) => {
  const panel = gameOverPanel(winner);
  const gameStats = createGameStats(players, endGameStats, winner);
  panel.come();

  setTimeout(() => {
    panel.hide();
    gameStats.come();
  }, 3000);
};

const renderPopups = (endGameStats, players, winner) => {
  showEndGamePopup(endGameStats, players, winner);
};
