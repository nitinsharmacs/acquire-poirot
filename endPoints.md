API

1. /api/loadgame : responses with game data of particular id
2. /api/start-game : starts game when lobby is full
3. /api/place-tile : responses with place tile

```
  /api/place-tile
  @input: {
    tileId
  }

  @response {
    data: {
      tile,
      case: 'build'|'buy-stocks'
    },
    message: 'bought stocks successfully'
  }
```
4. /api/draw-tile : responses with drawn tile
5. /api/build-corporation : responses when current player allowed to build any corporation
6. /api/change-turn : responses on next player's turn 
7. /api/buy-stocks : 

```
  @input: {
    stocks: [{}]
  }

  @response: {
    message: '',
    data: {
      case: '',

    }
  }
```