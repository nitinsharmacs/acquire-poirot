const landingPage = (username) => `<html>

<head>
  <title>Acquire</title>
  <link rel="stylesheet" href="/css/index.css">
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Recursive:regular,bold,bolditalic">
</head>

<body>

  <div class="main">
    <div class="header">
      <div class="heading">
        Acquire
      </div>
      <div class="adv">plan, build and own the next super city</div>
      <div class="username">
        Welcome, ${username} !
      </div>

    </div>

    <div class="option-block">

      <div class="avatar">
        <img src="/images/hand_share.jpeg" alt="hand-share"
          class="acquire-avatar">
      </div>

      <div class="options">
        <div class="option">
          <a href="/host">Create game</a>
        </div>
        <div class="option">
          <a href="/guide-page.html">How to play</a>
        </div>
      </div>

    </div>

    <div class="footer-lane">
      <div class="buildings"><img src="/images/buildingRow.jpeg"
          alt="buildings">
      </div>
      <div class="buildings"><img src="/images/buildingRow.jpeg"
          alt="buildings">
      </div>
      <div class="buildings"><img src="/images/buildingRow.jpeg"
          alt="buildings">
      </div>
    </div>
  </div>

</body>

</html>`;

module.exports = {
  landingPage
};
