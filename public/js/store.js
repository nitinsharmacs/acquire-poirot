const storeItem = (key, value) => {
  sessionStorage.setItem(key, value);
};

const getItem = (key) => {
  return sessionStorage.getItem(key);
};

