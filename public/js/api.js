const API = {
  loadGame: () => fetch('/api/loadgame', { method: 'GET' })
    .then(res => res.json()),

  placeTile: (tileId) => fetch('/api/place-tile',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: tileId })
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error('Tile cant be placed');
      }
      return res.json();
    }),

  drawTile: () => fetch('/api/draw-tile', {
    method: 'POST'
  })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Can\'t draw tile');
      }
      return res.json();
    }),

  changeTurn: () => fetch('/api/change-turn', {
    method: 'POST'
  }),

  buildCorporation: (tileId, corporationId) => fetch('/api/build-corporation', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ id: tileId, corporationId })
  })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Can\'t build corporation');
      }
      return res.json();
    }),

  skipBuild: () => fetch('/api/skip-build', {
    method: 'POST',
  })
    .then(res => res.json()),

  buyStocks: (stocks) => fetch('/api/buy-stocks', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ stocks })
  })
    .then(res => {
      if (res.status !== 200) {
        throw new Error('Can\'t purchase stocks');
      }
      return res.json();
    }),

  skipBuy: () => fetch('/api/skip-buy', {
    method: 'POST',
  })
    .then(res => res.json()),
};
