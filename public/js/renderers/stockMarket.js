const createCorporation = (corporation) => {
  const disable = corporation.active ? 'disabled-corporation' : '';
  return ['div', { class: 'corporation' }, {},
    ['div', { class: `corporation-img ${disable}`, id: corporation.id }, {}],
    ['div', { class: 'corporation-info' }, {},
      ['p', {}, {}, corporation.name],
      ['p', {}, {}, `${corporation.stocksLeft} `],
    ]
  ];
};

const createColumn = (corporations) => {
  return ['div', { class: 'corporation-col' }, {},
    ...corporations.map(createCorporation)
  ];
};

const createCorporationsHTML = (corporations) => {
  return ['div', { class: 'corporations' }, {},
    createColumn(corporations.slice(0, 4)),
    createColumn(corporations.slice(4))
  ];
};

const createBuildControls = (tileId) => {
  return ['div', { class: 'build-controls-holder' }, {},
    ['button', { class: 'build-button' },
      { onclick: () => buildCorporation(tileId) },
      'Build'],
    ['button', { class: 'skip-button' }, { onclick: skipBuild },
      'Skip']
  ];
};

const highlightStockMarket = (tileId) => {
  const { corporations } = gameState;
  const corporationsEle = createDOMTree(createCorporationsHTML(corporations));
  const corporationsCompo = document.querySelector('.corporations');
  corporationsCompo.replaceWith(corporationsEle);

  const buildControls = createDOMTree(createBuildControls(tileId));
  const stockMarketEle = document.querySelector('#stock-market');

  highlight(stockMarketEle);
  stockMarketEle.appendChild(buildControls);
};

// main
const renderStockMarket = ({ corporations }) => {
  const stockMarket = document.querySelector('#stock-market');
  // styles has to get reset to remove highlight
  // todo : after making general highlight, remove this style resetting
  stockMarket.style = '';

  const elements = [
    ['h3', { class: 'component-heading' }, {}, 'Stock Market'],
    createCorporationsHTML(corporations)
  ];

  stockMarket.replaceChildren(...createElements(elements));
};
