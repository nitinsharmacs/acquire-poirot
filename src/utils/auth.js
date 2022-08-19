const refQueryString = (ref) => {
  return ref ? '?ref=' + ref : '';
};

module.exports = { refQueryString };
