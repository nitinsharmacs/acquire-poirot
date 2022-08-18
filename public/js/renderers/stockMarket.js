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

  const backdropTemplate = ['div', { class: 'overlay' }, {}];
  stockMarketEle.style['z-index'] = 10;
  stockMarketEle.style.background = 'white';
  stockMarketEle.appendChild(buildControls);
  document.body.appendChild(...createElements([backdropTemplate]));
  return true;
};

const removeHighlight = () => {
  removeOverlay();
  return removeBackdrop('.stock-market');
};

const removeBackdrop = (ele) => {
  const element = document.querySelector(ele);
  element.style['z-index'] = 0;
};

// main
const renderStockMarket = ({ corporations }) => {
  const stockMarket = document.querySelector('#stock-market');

  const elements = [
    ['h3', { class: 'component-heading' }, {}, 'Stock Market'],
    createCorporationsHTML(corporations)
  ];

  stockMarket.replaceChildren(...createElements(elements));
};
