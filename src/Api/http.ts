const httpConfig = {
  mode: "cors", // no-cors, cors, *same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
};

const http = {
  get: (headers = {}) => ({
    method: "GET",
    ...httpConfig,
    headers: {
      ...httpConfig.headers,
      ...headers,
    },
  }),
};

export default http;
