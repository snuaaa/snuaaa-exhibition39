import axios from 'axios';
import { APP_URL } from 'src/config';

const getToken = () => window.localStorage.getItem('token');

axios.defaults.headers.common.Authorization = `Bearer ${getToken()}`;

const BaseService = {
  async get<T>(url: string) {
    const response = await axios.get<T>(`${APP_URL}${url}`);
    return response.data;
  },
  async post<T>(url: string, data: object) {
    const response = await axios.post<T>(`${APP_URL}${url}`, data);
    return response.data;
  },
  async postWithProgress<T>(url: string, data: object, cb: (pg: ProgressEvent) => void) {
    const response = await axios.post<T>(`${APP_URL}${url}`, data, {
      onUploadProgress: cb,
    });
    return response.data;
  },
  async patch<T>(url: string, data: object) {
    const response = await axios.patch<T>(`${APP_URL}${url}`, data);
    return response.data;
  },
  async delete<T>(url: string) {
    const response = await axios.delete<T>(`${APP_URL}${url}`);
    return response.data;
  },
};

export default BaseService;
