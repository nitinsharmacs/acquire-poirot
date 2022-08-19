const highlight = (element) => {
  const backdropTemplate = ['div', { class: 'overlay' }, {}];
  element.style['z-index'] = 10;
  element.style.background = 'white';
  document.body.appendChild(...createElements([backdropTemplate]));
};
