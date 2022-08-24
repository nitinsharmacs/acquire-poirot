const corpClass = (corporation) =>
  corporation.active ? 'disabled-corporation' : '';

const createCorporation = (corporation) => {
  return ['div', { class: 'corporation' }, {},
    ['div', {
      class: `corporation-img ${corporation.id} ${corpClass(corporation)}`,
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

const selectCorp = (event, corporations) => {
  const inputElement = event.target;
  const targetEle = inputElement;
  const targetEleInfo = inputElement.parentElement;
  const corpInfoEle = targetEleInfo.querySelector('.corporation-info');

  const radio = inputElement.querySelector('input');
  radio.checked = true;

  const buildButton = select('#confirm-btn');
  enable(buildButton);

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
        class: `corporation-img ${corporation.id} ${corpClass(corporation)}`,
        id: corporation.id
      },
      { onclick: (event) => selectCorp(event, corporations) },
      ['input',
        {
          type: 'radio',
          id: corporation.id,
          name: 'corporation',
          value: corporation.id,
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

const buildCorpOnBoard = (tileId) => {
  const form = select('#stock-market');
  const formData = new FormData(form);
  const corporationId = formData.get('corporation');

  console.log(corporationId, tileId);
  buildCorporation(tileId, corporationId);
};

const createCorpsWhileBuild = (corporations) => {
  return ['div', { class: 'corporations' }, {},
    corpColumn(corporations.slice(0, 4), corporations),
    corpColumn(corporations.slice(4), corporations)
  ];
};

const validateInput = () => {
  const form = select('#stock-market');
  const stocks = stocksToBuy(form);
  const buyButtonElement = select('#confirm-btn');

  if (stocks.length < 1) {
    disable(buyButtonElement);
    return;
  }
  enable(buyButtonElement);
};

const createBtnHolder = ({ action, skip, label }) => {

  const btnHolder = ['div', { class: 'button-holder' }, {},
    ['button', { class: 'btn theme-btn', type: 'submit', id: 'confirm-btn', disabled: true }, {
      onclick: (event) => {
        event.preventDefault();
        action();
      }
    }, label],
    ['button', { class: 'btn theme-btn' }, {
      onclick: (event) => {
        event.preventDefault();
        skip();
      }
    }, 'Skip']
  ];

  return createDOMTree(btnHolder);
};

const showControls = (corporations) => {
  corporations.forEach(({ id }) => {
    const corpElement = select(`.corporation>#${id}`);
    const ctrlElement = corpElement.parentNode.querySelector('.stock-value');
    show(ctrlElement);
  });
};

const buySelectedStocks = () => {
  const form = select('#stock-market');
  buyStocks(stocksToBuy(form));
};

const highlightStockMarketToBuy = (game) => {
  const stockMarketElement = select('#stock-market');
  highlight(stockMarketElement);

  const canBeBoughtOf = game.availableToBuy();
  showControls(canBeBoughtOf);

  const btnHolderElement = createBtnHolder({
    action: buySelectedStocks,
    skip: skipBuy,
    label: 'Buy'
  });
  stockMarketElement.appendChild(btnHolderElement);
};

const highlightStockMarket = ({ corporations }, tileId) => {
  const corporationsEle = createDOMTree(
    createCorpsWhileBuild(corporations, tileId));

  const corporationsCompo = select('.corporations');
  replace(corporationsCompo, corporationsEle);

  const stockMarketElement = select('#stock-market');
  highlight(stockMarketElement);

  const btnHolderElement = createBtnHolder({
    action: () => buildCorpOnBoard(tileId),
    skip: skipBuild,
    label: 'Build'
  });

  stockMarketElement.appendChild(btnHolderElement);
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
    createCorporationsHTML(corporations),
    ['p', { class: 'stock-error' }, {}, message]
  ];

  stockMarket.replaceChildren(...createElements(elements));
};
