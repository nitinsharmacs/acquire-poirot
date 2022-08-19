const backDrop = () => ['div', { class: 'overlay' }, {}];

const addBackDrop = () =>
  document.body.appendChild(...createElements([backDrop()]));

const highlight = (element) => {
  element.style['z-index'] = 10;
  element.style.background = 'white';
  addBackDrop();
};
