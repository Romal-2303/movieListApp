import config from "./config.ts";
import http from "./http.ts";
import afterFetchHandlers from "./fetch.ts";

const api: any = {
  http,
  config,
  afterFetchHandlers,
};

export default api;
