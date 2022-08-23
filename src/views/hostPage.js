const hostPage = (playerName, message) => `

<head>
  <title>Host</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Recursive:regular,bold,bolditalic">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css"
    integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="/css/index.css">
</head>

<body>

  <div class="page">
    <header class="header">
      <h1>Acquire</h1>
      <div class="navigation">
        <p>Hii, ${playerName}!</p>
        <a href="/" class="fa-solid fa-house-chimney"></a>
      </div>
    </header>

    <main class="container">
      <form action="/host" method="post" class="form">
        <h2>Host Game</h2>
        <select name="noOfPlayers" id="players-no">
          <option value="3">Number of players</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <input type="submit" class="btn theme-btn" value="Host">
        <div class="msg">${message}</div>
      </form>
    </main>
  </div>

</body>

</html>`;

module.exports = { hostPage };