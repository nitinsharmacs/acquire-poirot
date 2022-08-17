const hostPage = (playerName, message) => `<head>
<title>Host</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Recursive:regular,bold,bolditalic">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css" integrity="sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==" crossorigin="anonymous" referrerpolicy="no-referrer" />
<link rel="stylesheet" href="/css/index.css">
</head>

<body>

<div class="main">
  <div class="host-header">
    <div class="heading">
      Acquire
    </div>
    <div class="navigation">
    <p>${playerName}</p>
    <a href="/" class="fa-solid fa-house-chimney"></a>
    </div>
  </div>

  <div class="option-host-block">

    <div class="options">
      <form action="/host" method="post">
        <div class="form-inputs">
          <section class="input-section">

            <select name="noOfPlayers" id="players-no">
              <option value="3">Number of players</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </section>
        </div>
        <div class="form-controls">
          <input type="submit" value="Host Game">
        </div>
      </form>
      <div class="msg">${message}</div>
    </div>

  </div>

  <div class="footer-lane">
    <div class="buildings"><img src="/images/buildingRow.jpeg" alt="buildings">
    </div>
    <div class="buildings"><img src="/images/buildingRow.jpeg" alt="buildings">
    </div>
    <div class="buildings"><img src="/images/buildingRow.jpeg" alt="buildings">
    </div>
  </div>
</div>

</body>

</html>`;

module.exports = { hostPage };

