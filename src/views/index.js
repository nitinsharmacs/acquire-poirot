const landingPage = (username) => `<html>

<head>
  <title>Acquire</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Recursive:regular,bold,bolditalic">
  <link rel="stylesheet" href="/css/index.css">
  <link rel="stylesheet" href="/css/landingPage.css">
</head>

<body>

  <div class="page">
    <header class="landing-page-header">
      <div class="logo">
        Acquire
      </div>
      <div class="adv">plan, build and own the next super city</div>
      <div class="username">
        Welcome, ${username} !
      </div>
    </header>

    <div class="landing-options">
      <a href="/host" class="btn">Create game</a>
      <a href="/guide-page.html" class="btn">How to play</a>
    </div>

  </div>
</body>

</html>`;

module.exports = {
landingPage
};