const createEndGameStats = ({ corporationId, distributedBonus }, players) => {
  const { bonusHolders, stockHolders } = distributedBonus;
  return ['div', { class: 'stats-holder' }, {},
    ['div', {}, {},
      ['img', { class: 'corporation-bigger-image', src: `/images/corps/${corporationId}.png` }]
    ],
    ['div', { class: 'distributed-bonus' }, {},
      ['div', { class: 'bonus-holders' }, {},
        ...majorityAndMinority(bonusHolders, players)],
      ['div', { class: 'stock-holders' }, {}, stockTable(stockHolders, players)],
    ]
  ];
};

const showStockStatus = (endGameStats, players) => {
  const bonus = endGameStats.map(distributedBonus => {
    return createEndGameStats(distributedBonus, players);
  });
  const popup = createDOMTree(['div', { class: 'popup animate-zoom list-popup' }, {}, ...bonus]);
  const finalDicision = createDOMTree(createEndGamePopup(players));

  const bodyElement = select('.page-wrapper');
  bodyElement.appendChild(popup);

  setTimeout(() => {
    const oldPopup = select('.popup');
    const gif = () => ['div', { class: 'overlay' }, {}];
    document.body.appendChild(...createElements([gif()]));
    oldPopup.replaceWith(finalDicision);
    highlight(finalDicision);
  }, 20000);
  highlight(popup);
};

const createStocks = (stocks) => {
  return stocks.map(stock => {
    return ['p', {}, {}, `${stock.corporationName}: ${stock.count}`];
  });
};

const createTableRows = (players) => {
  return players.map(({ name, stocks, money }) => {
    return ['tr', {}, {},
      ['td', {}, {}, name],
      ['td', {}, {}, ...createStocks(stocks)],
      ['td', {}, {}, money.toString()],
    ];
  });
};

const createEndGamePopup = (players) => {
  return ['div', { class: 'popup animate-zoom popup-mid-position' }, {},
    ['div', { class: 'final-result' }, {},
      ['h1', { class: 'heading component-heading' }, {}, 'Game Over'],
      ['table', { class: 'resources-details' }, {},
        ['thead', {}, {},
          ['tr', {}, {},
            ['td', {}, {}, 'Name'],
            ['td', {}, {}, 'Stocks'],
            ['td', {}, {}, 'Money']
          ]
        ],
        ['tbody', {}, {}, ...createTableRows(players)]
      ]
    ]
  ];
};

const majorityAndMinority = (bonusHolders, players) => {
  return bonusHolders.map(({ id, money, bonusType }) => {
    const { name } = players.find(player => player.id === id);
    return ['p', {}, {}, `${bonusType}($${money}): ${name}`];
  });
};

const createStocksCount = (stockHolders) => {
  return stockHolders.map(({ stock }) =>
    ['td', {}, {}, stock.count.toString()]);
};

const createPlayersName = (players) => {
  return players.map(({ name }) => {
    return ['td', {}, {}, name];
  });
};

const createPlayersMoney = (players) => {
  return players.map(({ money }) => {
    return ['td', {}, {}, `$ ${money}`];
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
      ['h2', {}, {}, `${winner.name || 'Tanmay'} Won!`]
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

const createBonuses = (cardDetails) => {
  return cardDetails.map(({ name, stock, bonusType, bonus }) =>
    [
      'tr', {}, {},
      ['td', {}, {}, name],
      ['td', {}, {}, `${stock}`],
      ['td', {}, {}, bonusType || '-'],
      ['td', {}, {}, `${bonus ? `$${bonus}` : '-'}`],
    ]);
};

const corporationCard = ({ corporationId }, cardDetails) => {
  return ['div', { class: `corporation-card ${corporationId}-stock` }, {},
    ['div', { class: 'corporation-card-img' }, {},
      ['img', { src: `/images/corps/${corporationId}.png` }, {}]
    ],
    ['h2', {}, {}, corporationId || '-'],
    ['table', { class: 'bonuses' }, {},
      ['thead', {}, {},
        ['th', {}, {}, 'Players'],
        ['th', {}, {}, 'Stocks'],
        ['th', {}, {}, 'Bonus Type'],
        ['th', {}, {}, 'Bonus']
      ],
      ['tbody', {}, {},
        ...createBonuses(cardDetails)
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
      bonus
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
    ['h2', {}, {}, `${winner.name || 'Tanmay'} Won!`],
    createMoneyTable(players),
    ['div', { class: 'corporation-cards' }, {},
      ...createCorporationCards(players, activeCorporations)
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
  if (select('.popup')) {
    return;
  }
  const panel = gameOverPanel(winner);
  const gameStats = createGameStats(players, endGameStats, winner);
  panel.come();

  setTimeout(() => {
    panel.hide();
    gameStats.come();
  }, 1000);
};

const renderPopups = (endGameStats, players, winner) => {
  showEndGamePopup(endGameStats, players, winner);
};
