const savePage = (playerName) => `
<html>

<head>
  <title>Save Game</title>
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
      <form action="/save" method="post" class="form">
        <h2>Save Game</h2>
        <input type="text" name="title" placeholder="enter a suitable title">
        <input type="submit" class="btn theme-btn" value="Save">
      </form>
    </main>
  </div>

</body>

</html>
`;

const savedGamesOptions = (entries) => {
return entries.map(entry => {
return `<option value="${entry.id}">${entry.title}</option>`;
}).join('');
};

const restorePage = (entries, playerName) => `
<html>

<head>
  <title>Restore Game</title>
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
      <form action="/restore" method="post" class="form">
        <h2>Restore Game</h2>
        <select name="gameId">
          ${savedGamesOptions(entries)}
        </select>
        <input type="submit" class="btn theme-btn" value="Restore">
      </form>
    </main>
  </div>

</body>

</html>
`;

module.exports = { savePage, restorePage };