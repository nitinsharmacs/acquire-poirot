// Creating player resources --------------------
const playerTiles = ({ tiles }) => {
  return tiles.map(tile => {

    return ['div',
      { class: 'tile-item', id: tile.id },
      {},
      ...tileLabel(tile)
    ];
  });
};

const playerStocks = ({ stocks }) => {
  return stocks.map(stock => ['div',
    { class: `stock ${stock.corporationId}-stock` }, {},
    ['p', {}, {}, stock.corporationName],
    ['p', {}, {}, `${stock.count}`]
  ]
  );
};

const highlightTilesOnBoard = ({ player }) => {
  const playerTiles = player.tiles;

  playerTiles.forEach((tile) => {
    const tileElement = select(`#tile-${tile.id}`);
    tileElement.classList.add('focus-tile');
    tileElement.onclick = () => placeTile(tile.id);
  });
};

// main
const renderPlayerResources = ({ player }) => {
  const playerResources = select('#player-resources');

  const resourcesElements = [
    ['section', { class: 'player-money' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Money'],
      ['p', {}, {}, `${player.money} `]
    ],
    ['section', { class: 'player-tiles' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Tiles'],
      [
        'div', { class: 'component-tiles' }, {}, ...playerTiles(player)
      ]
    ],
    ['section', { class: 'player-stocks' }, {},
      ['h3', { class: 'component-heading' }, {}, 'Stocks'],
      ['div', {}, {}, ...playerStocks(player)]
    ]
  ];

  playerResources.replaceChildren(...createElements(resourcesElements));
};
