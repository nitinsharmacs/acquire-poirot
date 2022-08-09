const insertAttrs = (element, attrs) => {
  for (const attr in attrs) {
    element.setAttribute(attr, attrs[attr]);
  }

  return element;
};

const attachEvents = (element, events) => {
  for (const eventName in events) {
    element[eventName] = events[eventName];
  }
  return element;
};

const isNode = (element) => {
  return element instanceof Node;
};

const createElement = (tag, attrs, events, content) => {
  const element = document.createElement(tag);

  insertAttrs(element, attrs);
  attachEvents(element, events);

  if (Array.isArray(content)) {
    element.append(...content);
    return element;
  }

  if (typeof content === 'string') {
    element.appendChild(new Text(content));
    return element;
  }

  if (isNode(content)) {
    element.appendChild(content);
    return element;
  }

  return element;
};

const createElements = (elements = []) => {
  if (typeof elements === 'string') {
    return new Text(elements);
  }

  return elements.map((element) => {
    if (typeof element === 'string') {
      return new Text(element);
    }

    if (isNode(element)) {
      return element;
    }

    const [tag, attrs, events, ...children] = element;
    return createElement(tag, attrs, events, createElements(children));
  });
};

const createDOMTree = (rootElement) => {
  const [tag, attrs, events, ...children] = rootElement;
  return createElement(tag, attrs, events, createElements(children));
};
