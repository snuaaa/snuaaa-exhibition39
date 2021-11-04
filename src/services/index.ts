import axios from 'axios';

const SERVER_URL = process.env.REACT_APP_API_SERVER_URL;

const getToken = () => window.localStorage.getItem('token');

axios.defaults.headers.common.Authorization = `Bearer ${getToken()}`;

const BaseService = {
  async get<T>(url: string) {
    const response = await axios.get<T>(`${SERVER_URL}/${url}`);
    return response.data;
  },
  async post<T>(url: string, data: object) {
    const response = await axios.post<T>(`${SERVER_URL}/${url}`, data);
    return response.data;
  },
  async postWithProgress<T>(url: string, data: object, cb: (pg: ProgressEvent) => void) {
    const response = await axios.post<T>(`${SERVER_URL}/${url}`, data, {
      onUploadProgress: cb,
    });
    return response.data;
  },
  async patch<T>(url: string, data: object) {
    const response = await axios.patch<T>(`${SERVER_URL}/${url}`, data);
    return response.data;
  },
  async delete<T>(url: string) {
    const response = await axios.delete<T>(`${SERVER_URL}/${url}`);
    return response.data;
  },
};

export default BaseService;
