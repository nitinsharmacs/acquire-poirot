const corpClass = (corporation) =>
  corporation.active ? 'disabled-corporation' : '';

const createCorporation = (corporation) => {
  return ['div', { class: 'corporation' }, {},
    ['div', {
      class: `corporation-img ${corpClass(corporation)}`,
      id: corporation.id
    }, {}],
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

const createBuildControls = () => {
  const style = createStyle('visibility', 'hidden');

  return ['div',
    { class: 'build-controls-holder' }, {},
    ['button', { class: 'build-button', type: 'submit', style },
      {},
      'Build'],
    ['button', { class: 'skip-button', type: 'button' }, { onclick: skipBuild },
      'Skip']
  ];
};

const selectCorp = (event, corporations) => {
  const inputElement = event.target;
  const targetEle = inputElement;
  const targetEleInfo = inputElement.parentElement;
  const corpInfoEle = targetEleInfo.querySelector('.corporation-info');

  const radio = inputElement.querySelector('input');
  radio.checked = true;

  const buildButton = select('.build-button');
  show(buildButton);

  corporations.forEach(corp => {
    const corpElement = document.getElementById(corp.id);
    const corpInfo = corpElement.parentElement.querySelector(
      '.corporation-info');

    if (corpInfo) {
      corpElement.classList.remove('highlight-corp');
      corpInfo.classList.remove('highlight-info');
    }
  });
  targetEle.classList.add('highlight-corp');
  corpInfoEle.classList.add('highlight-info');
};

const corpWhileBuild = (corporations) => (corporation) => {
  return ['div', { class: 'corporation' }, {},
    ['div',
      {
        class: `corporation-img ${corpClass(corporation)}`,
        id: corporation.id
      },
      { onclick: (event) => selectCorp(event, corporations) },
      ['input',
        {
          type: 'radio',
          id: corporation.id,
          name: 'corporation',
          value: corporation.id
        }, { hidden: true }]],
    ['div', { class: 'corporation-info' }, {},
      ['p', {}, {}, corporation.name],
      ['p', {}, {}, `${corporation.stocksLeft} `],
    ]
  ];
};

const corpColumn = (corporations, allcorps) => {
  return ['div', { class: 'corporation-col' }, {},
    ...corporations.map(corpWhileBuild(allcorps))
  ];
};

const buildCorpOnBoard = (event, tileId) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const corporationId = formData.get('corporation');

  buildCorporation(tileId, corporationId);
};

const createCorpsWhileBuild = (corporations, tileId) => {
  return ['form',
    { class: 'stocks-holder' },
    {
      onsubmit: (event) => buildCorpOnBoard(event, tileId)
    }, ['div', { class: 'corporations' }, {},
      corpColumn(corporations.slice(0, 4), corporations),
      corpColumn(corporations.slice(4), corporations)
    ], [...createBuildControls()]];
};

const createBuyControls = () => {
  return ['div', { class: 'build-controls-holder' }, {},
    ['button', { class: 'build-button' }, { onclick: buyStocks }, 'Buy'],
    ['button', { class: 'skip-button' }, { onclick: skipBuy }, 'Skip']
  ];
};

const highlightStockMarketToBuy = () => {
  const stockMarketElement = select('#stock-market');
  highlight(stockMarketElement);

  const buyControls = createDOMTree(createBuyControls());
  stockMarketElement.appendChild(buyControls);
};

const highlightStockMarket = ({ corporations }, tileId) => {
  const corporationsEle = createDOMTree(
    createCorpsWhileBuild(corporations, tileId));

  const corporationsCompo = select('.corporations');
  replace(corporationsCompo, corporationsEle);

  const stockMarketEle = select('#stock-market');
  highlight(stockMarketEle);
};

// main
const renderStockMarket = ({ corporations }) => {
  const stockMarket = select('#stock-market');

  const elements = [
    ['h3', { class: 'component-heading' }, {}, 'Stock Market'],
    createCorporationsHTML(corporations)
  ];

  stockMarket.replaceChildren(...createElements(elements));
};
