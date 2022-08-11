const parseResponseBody = (body, contentType) => {
  if (contentType.startsWith('application/json')) {
    return JSON.parse(body);
  }
  return body;
};

const setRequestHeaders = (xhr, headers) => {
  for (const name in headers) {
    xhr.setRequestHeader(name, headers[name]);
  }
};

const fetchReq = (url, options, onDone) => {
  const xhr = new XMLHttpRequest();

  xhr.onload = () => {
    const contentType = xhr.getResponseHeader('content-type');
    onDone({
      status: xhr.status,
      body: parseResponseBody(xhr.response, contentType)
    });
  };

  xhr.open(options.method, url);

  if (options.headers) {
    setRequestHeaders(xhr, options.headers);
  }

  xhr.send(options.body);
};

const toURLSearchParams = (object) => {
  const formData = new FormData();
  for (const key in object) {
    const value = object[key];
    formData.append(key, value);
  }
  return new URLSearchParams(formData);
};
