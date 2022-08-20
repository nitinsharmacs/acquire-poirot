const gamePage = () => `<html>

<head>
  <title>Acquire</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Recursive:regular,bold,bolditalic">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="/css/game.css">
  <script src="/js/html.js"></script>
  <script src="/js/renderers/highlight.js"></script>
  <script src="/js/renderers/playerResources.js"></script>
  <script src="/js/renderers/playersList.js"></script>
  <script src="/js/renderers/stockMarket.js"></script>
  <script src="/js/renderers/board.js"></script>
  <script src="/js/renderer.js"></script>
  <script src="/js/api.js"></script>
  <script src="/js/state.js"></script>
  <script src="/js/store.js"></script>
  <script src="/js/game.js"></script>
</head>

<body>
  <div class="page-wrapper">
    <div class="game-page">
      <section>
        <div class="board">
          <div class="branding left">
            <h2>ACQUIRE</h2>
          </div>
          <div class="board-tiles"></div>
          <div class="branding right">
            <h2>ACQUIRE</h2>
          </div>
        </div>
        <div class="player-resources" id="player-resources">

        </div>
      </section>

      <section>
        <div class="player-activities">
          <div class="players">
            <h3 class="component-heading">Players</h3>
            <div class="players-list" id="players-list">

            </div>
          </div>
          <div>
            <header>
              <button id="info-card-btn">Info Card</button>
              <div class="info-card hide" id="info-card">

              </div>
              <button class="fa-solid fa-arrow-right-from-bracket"></button>
            </header>
            <div class="activity-logs">
              <h3 class="component-heading">Activity Logs</h3>
              <div class="logs"></div>
            </div>
          </div>
        </div>
        <form class="stock-market" id="stock-market">

        </form>
      </section>
    </div>
  </div>
</body>

</html>`;

module.exports = { gamePage };
