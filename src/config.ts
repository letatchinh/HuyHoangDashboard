import { get } from "lodash";

const devConfigJson = '{ "REACT_APP_BASE_URL": "https://api.congtyso.com/" }';

let config = {};
try {
  config = JSON.parse(devConfigJson);
} catch { }

export const devConfig = {
  baseUrl: get(process.env, 'REACT_APP_BASE_URL', 'config.REACT_APP_BASE_URL'),
};

