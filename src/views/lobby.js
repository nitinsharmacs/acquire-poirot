const lobbyPage = (game, gameLink) => `
<html>

<head>
  <title>Lobby</title>
  <link rel="stylesheet" href="/css/lobby.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Recursive:regular,bold,bolditalic">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <script src="/js/request.js"></script>
  <script src="/js/html.js"></script>
  <script src="/js/lobby.js"></script>
</head>

<body>
  <header class="host-header">
    <h1 class="heading">
      Acquire
    </h1>
    <a href="/" class="fa-solid fa-arrow-right-from-bracket"></a>
  </header>

  <main class="main">

    <section class="game-link-holder">

      <div class="player-name option">Host Name : ${game.host.name} </div>
      <div class="total-player option">Total Player: ${game.gameSize}</div>

      <div class="line"></div>

      <div class="link-box">
        <h2 class="share-header">Share with your friends</h2>
        <h3>${gameLink}</h3>
      </div>

    </section>

    <div class="players-lobby">
      <div class="processing-header">
        <h3>Waiting for players......</h3>
      </div>

      <div class="players">
        <!-- <div class="player">
          <div class="player-avatar">
            <img src="/images/usericon.png" alt="avatar">
          </div>
          <div class="player-name">Sam</div>
        </div>
        <div class="player">
          <div class="player-avatar">
            <img src="/images/usericon.png" alt="avatar">
          </div>
          <div class="player-name">Sam</div>
        </div>
        <div class="player">
          <div class="player-avatar">
            <img src="/images/usericon.png" alt="avatar">
          </div>
          <div class="player-name">Sam</div>
        </div>
        <div class="player">
          <div class="player-avatar">
            <img src="/images/usericon.png" alt="avatar">
          </div>
          <div class="player-name">Sam</div>
        </div> -->
      </div>
    </div>

  </main>

</body>

</html>

`;

module.exports = { lobbyPage };