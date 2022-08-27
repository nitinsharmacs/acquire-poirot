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
  return ['div', { class: 'popup final-sample' }, {},
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

const createPlayersName = (stockHolders, players) => {
  return stockHolders.map(({ id }) => {
    const { name } = players.find(player => player.id === id);
    return ['td', {}, {}, name];
  });
};

const stockTable = (stockHolders, players) => {
  return ['table', {}, {},
    ['tr', {}, {},
      ['th', {}, {}, 'Players'], ...createPlayersName(stockHolders, players)
    ],
    ['tr', {}, {},
      ['th', {}, {}, 'No. of stocks'], ...createStocksCount(stockHolders)
    ]
  ];
};

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
  const popup = createDOMTree(['div', { class: 'popup sample' }, {}, ...bonus]);
  const finalDicision = createDOMTree(createEndGamePopup(players));

  const bodyElement = select('.page-wrapper');
  bodyElement.appendChild(popup);
  setTimeout(() => {
    const gif = () => ['div', { class: 'overlay' }, {}];
    document.body.appendChild(...createElements([gif()]));
    bodyElement.appendChild(finalDicision);
    highlight(finalDicision);
  }, 30000);
  highlight(popup);
};

const showEndGamePopup = (endGameStats, players) => {
  if (select('.popup')) {
    return;
  }
  showStockStatus(endGameStats, players);
};

const renderPopups = (endGameStats, players) => {
  showEndGamePopup(endGameStats, players);
};
