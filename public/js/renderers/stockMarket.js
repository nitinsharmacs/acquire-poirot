const createCorporation = (corporation) => {
  const corporationClass = corporation.active ? 'disabled-corporation' : '';

  return ['div', { class: 'corporation' }, {},
    ['div', {
      class: `corporation-img ${corporation.id} ${corporationClass}`,
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

const stocksToBuy = (form) => {
  const formData = [...new FormData(form).entries()];
  return formData.reduce((stocks, [key, value]) => {
    if (value > 0) {
      stocks.push({ corporationId: key, numOfStocks: parseInt(value) });
    }
    return stocks;
  }, []);
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

const highlightStockMarket = (btnHolder) => {
  const stockMarketElement = select('#stock-market');
  highlight(stockMarketElement);

  stockMarketElement.appendChild(btnHolder);
};

const highlightStockMarketToBuy = (game) => {
  const btnHolderElement = createBtnHolder({
    action: buySelectedStocks,
    skip: skipBuy,
    label: 'Buy'
  });
  highlightStockMarket(btnHolderElement);

  const canBeBoughtOf = game.availableToBuy();
  showControls(canBeBoughtOf);
};

const highlightSelectedCorporation = (corporations, corporation) => {
  corporations.forEach(_corporation => {
    removeClass(_corporation, 'highlight-corp');
    removeClass(_corporation.nextSibling, 'highlight-info');
  });

  addClass(corporation, 'highlight-corp');
  addClass(corporation.nextSibling, 'highlight-info');
};

const attachSelectEvent = (corporations, onSelect) => {
  corporations.forEach(corporation => {
    corporation.onclick = () => {
      highlightSelectedCorporation(corporations, corporation);
      onSelect(corporation.id);
    };
  });
};

const highlightStockMarketToBuild = (tileId) => {
  let selectedId;

  const btnHolderElement = createBtnHolder({
    action: () => buildCorporation(tileId, selectedId),
    skip: skipBuild,
    label: 'Build'
  });

  highlightStockMarket(btnHolderElement);

  const corporations = selectAll('.corporation-img');
  attachSelectEvent(corporations, (corporationId) => {
    selectedId = corporationId;
    enable(select('#confirm-btn'));
  });
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
