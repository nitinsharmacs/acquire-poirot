const backDrop = () => ['div', { class: 'overlay' }, {}];

const addBackDrop = () =>
  document.body.appendChild(...createElements([backDrop()]));

const highlight = (element) => {
  element.classList.add('highlight-element');
  const overlay = select('.overlay');
  overlay || addBackDrop();
};

const removeOverlay = () => {
  const overlay = select('.overlay');
  overlay && overlay.remove();
};

const removeHighLight = () => {
  removeOverlay();
  const highLightedElement = select('.highlight-element');
  if (highLightedElement) {
    removeClass(highLightedElement, 'highlight-element');
  }
};
