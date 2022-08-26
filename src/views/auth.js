const authPage = ({ ref, error, forSignup }) => `
<html>

<head>
  <title>Acquire - ${forSignup ? 'SignUp' : 'Login'}</title>

  <link rel="stylesheet" href="/css/index.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Recursive:regular,bold,bolditalic">
</head>

<body>
  <div class="page">
    <header class="header">
      <h1>Acquire</h1>
    </header>
    <div class="container">
      <form class="form" action="${forSignup ? '/sign-up' : '/login'}${ref}" method="post">
        <h2>${forSignup ? 'Sign Up' : 'Login'}</h2>
        <input type="text" name="username" id="username" placeholder="Username" />
        <input type="password" name="password" id="password" placeholder="Password" />
        <input type="submit" value="${forSignup ? 'Sign Up' : 'Login'}" class="btn theme-btn" />
        <div class="form-footer">
          ${forSignup ?
    `Already have an account? <a href="/login${ref}">login</a>`
    : `Need an account? <a href="/sign-up${ref}">sign-up</a>`}
        </div>
        ${error ? `<div class="message">${error}</div>` : ''}
      </form>
    </div>
  </div>
</body>

</html>
`;

module.exports = { authPage };