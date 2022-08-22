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
    ],
    ['input',
      {
        type: 'number', name: `${corporation.id}`, class: 'stock-value',
        min: '0', max: `${Math.min(3, corporation.stocksLeft)}`, value: 0
      },
      { onchange: validateInput }],
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
      'Build']
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

const corpBuildClass = (corporation) =>
  corporation.active ? 'disabled-corporation' : 'hover';

const corpWhileBuild = (corporations) => (corporation) => {
  return ['div', { class: 'corporation' }, {},
    ['div',
      {
        class: `corporation-img ${corpBuildClass(corporation)}`,
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
    },
    createSkipButton(skipBuild),
    ['div', { class: 'corporations' }, {},
      corpColumn(corporations.slice(0, 4), corporations),
      corpColumn(corporations.slice(4), corporations)
    ], [...createBuildControls()]];
};

const validateInput = () => {
  const form = select('#stock-market');
  const stocks = stocksToBuy(form);
  const buyButtonElement = select('.buy-button');

  if (stocks.length < 1) {
    hide(buyButtonElement);
    return;
  }
  show(buyButtonElement);
};

const createBuyControls = () => {
  const style = createStyle('visibility', 'hidden');

  return ['div', { class: 'buy-controls-holder' }, {},
    ['button', { class: 'buy-button', type: 'submit', style }, {
      onclick: (event) => {
        event.preventDefault();
        const form = select('#stock-market');
        buyStocks(stocksToBuy(form));
      }
    }, 'Buy']
  ];
};

const createSkipButton = (listener) => {
  return ['div', { class: 'skip-button-holder' }, {},
    ['button', { class: 'skip-button' }, {
      onclick: (event) => {
        event.preventDefault();
        listener();
      }
    }, 'Skip']
  ];
};

const showControls = (corporations) => {
  corporations.forEach(({ id }) => {
    const corpElement = select(`.corporation>#${id}`);
    const ctrlElement = corpElement.parentNode.querySelector('.stock-value');
    show(ctrlElement);
  });
};

const insertSkipButton = () => {
  const skipBtnHolderElement = select('.skip-button-holder');
  skipBtnHolderElement.replaceWith(createDOMTree(createSkipButton(skipBuy)));
};

const highlightStockMarketToBuy = (game) => {
  const stockMarketElement = select('#stock-market');
  highlight(stockMarketElement);
  // addBackDrop();

  const canBeBoughtOf = game.availableToBuy();
  showControls(canBeBoughtOf);

  const buyControls = createDOMTree(createBuyControls());
  stockMarketElement.appendChild(buyControls);
  insertSkipButton();
};

const highlightStockMarket = ({ corporations }, tileId) => {
  const corporationsEle = createDOMTree(
    createCorpsWhileBuild(corporations, tileId));

  const corporationsCompo = select('.corporations');
  replace(corporationsCompo, corporationsEle);

  const stockMarketEle = select('#stock-market');
  highlight(stockMarketEle);
  // addBackDrop();
};

const stocksToBuy = (form) => {
  const formData = [...new FormData(form).entries()];
  return formData.reduce((stocks, [key, value]) => {
    if (value > 0) {
      stocks.push({ corporationId: key, numOfStocks: parseInt(value) });
    }
    return stocks;
  }, []);
};

// main
const renderStockMarket = ({ corporations }, message = '') => {
  const stockMarket = select('#stock-market');
  const elements = [
    ['h3', { class: 'component-heading' }, {}, 'Stock Market'],
    ['div', { class: 'skip-button-holder' }, {}],
    createCorporationsHTML(corporations),
    ['p', { class: 'buy-stock-error' }, {}, message]
  ];

  stockMarket.replaceChildren(...createElements(elements));
};
