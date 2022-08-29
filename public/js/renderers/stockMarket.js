const createCorporation = (corporation) => {
  const corporationClass = corporation.active ? 'disabled-corporation' : '';

  return ['div', { class: 'corporation', id: corporation.id }, {},
    ['p', { class: 'market-price' }, {}, `$${corporation.marketPrice.stockPrice || 0}`],
    ['div', {
      class: `corporation-img ${corporation.id} ${corporationClass}`,

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
      { onchange: updateControls }],
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

const determineTotalPrice = (stocks, corporations) => {
  return stocks.reduce((totalPrice, { corporationId, numOfStocks }) => {

    const { marketPrice } = corporations.find(({ id }) => id === corporationId);
    return totalPrice + (marketPrice.stockPrice * numOfStocks);
  }, 0);
};
const showTotalPrice = (stockPrice) => {
  const stockMessage = select('.stock-message');

  stockMessage.style.color = 'whitesmoke';
  stockMessage.replaceChildren(`Total Price : $${stockPrice}`);
};

const updateControls = (corporations) => {
  const form = select('#stock-market');
  const stocks = stocksToBuy(form);
  const buyButtonElement = select('#confirm-btn');

  showTotalPrice(determineTotalPrice(stocks, corporations));

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
    const corporationElement = select(`#${id}`);
    const ctrlElement = corporationElement.querySelector('input');
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

const attachStockSelectEvent = (corporations) => {
  const selectInputs = selectAll('.corporation>input');
  selectInputs.forEach(selectInput => {
    selectInput.onchange = () => {
      updateControls(corporations);
    };
  });
};

const highlightStockMarketToBuy = (game) => {
  const btnHolderElement = createBtnHolder({
    action: buySelectedStocks,
    skip: skipBuy,
    label: 'Buy'
  });
  highlightStockMarket(btnHolderElement);

  const canBeBoughtOf = game.availableToBuy();
  attachStockSelectEvent(game.corporations);
  showControls(canBeBoughtOf);
};

const highlightSelectedCorporation = (corporations, corporation) => {
  corporations.forEach(_corporation => {
    const corporationImage = selectIn(_corporation, '.corporation-img');
    const corporationInfo = selectIn(_corporation, '.corporation-info');

    removeClass(corporationImage, 'highlight-corp');
    removeClass(corporationInfo, 'highlight-info');

    if (_corporation.id === corporation.id) {
      addClass(corporationImage, 'highlight-corp');
      addClass(corporationInfo, 'highlight-info');
    }
  });
};

const attachSelectEvent = (corporations, onSelect) => {
  corporations.forEach(corporation => {
    selectIn(corporation, '.corporation-img').onclick = () => {
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

  const corporations = selectAll('.corporation');
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
    ['p', { class: 'stock-message' }, {}, message]
  ];

  stockMarket.replaceChildren(...createElements(elements));
};
