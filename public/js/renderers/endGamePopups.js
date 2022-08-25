const createStocks = (stocks) => {
  return stocks.map(stock => {
    return ['p', {}, {}, `${stock.corporationName}: ${stock.count}`];
  });
};

const createTableRows = (game) => {
  return game.players.map(({ name, stocks, money }) => {
    return ['tr', {}, {},
      ['td', {}, {}, name],
      ['td', {}, {}, ...createStocks(stocks)],
      ['td', {}, {}, money.toString()],
    ];
  });
};

const createEndGamePopup = (game) => {
  return ['div', { class: 'popup sample' }, {},
    ['h1', { class: 'heading component-heading' }, {}, 'Game Over'],
    ['table', { class: 'resources-details' }, {},
      ['thead', {}, {},
        ['tr', {}, {},
          ['td', {}, {}, 'Name'],
          ['td', {}, {}, 'Stocks'],
          ['td', {}, {}, 'Money']
        ]
      ],
      ['tbody', {}, {}, ...createTableRows(game)]
    ]
  ];
};

const showEndGamePopup = (game) => {
  if (select('.popup')) {
    return;
  }
  const popupElement = createDOMTree(createEndGamePopup(game));
  const bodyElement = select('.page-wrapper');
  bodyElement.appendChild(popupElement);
  highlight(popupElement);
};

const renderPopups = (game) => {
  if (game.turn.stage === 'end-game') {
    showEndGamePopup(game);
  }
};
