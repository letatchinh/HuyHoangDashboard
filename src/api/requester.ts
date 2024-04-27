import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_URL } from '~/constants/defaultValue';

export function setupAxios() {
  axios.defaults.baseURL = BASE_URL;
  axios.defaults.headers.common['Content-Type'] = 'application/json';
}

export function setAxiosToken(token : string) {
  axios.defaults.headers.common.Authorization = 'Bearer ' + token;
}


export function removeAxiosToken() {
  axios.defaults.headers.common.Authorization = '';
}
export function setAxiosCompanyId(companyId:any) {
  axios.defaults.headers.common['companyId'] = companyId;
}
const responseBody = <T>(res: AxiosResponse<T>): T => res.data;

const requester = {
  get: (url : string, params? : any, config : AxiosRequestConfig = {}) =>
    axios
      .get(url, {
        params,
        ...config
      })
      .then(responseBody),

  post: (url : string, data? : any, config : AxiosRequestConfig = {}) =>
    axios.post(url, data, config).then(responseBody),
  postFormData: (url : string, data? : any, config : AxiosRequestConfig = {}) => {
    const bodyFormData = new FormData();
    bodyFormData.append('files', data);
    return axios({
      method: 'post',
      url,
      data: bodyFormData,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(responseBody);
  },
  put: (url : string, data? : any, config : AxiosRequestConfig = {}) =>
    axios.put(url, data, config).then(responseBody),
  delete: (url : string, data? : any) => axios.delete(url, { data }).then(responseBody)
};

export default requester;
