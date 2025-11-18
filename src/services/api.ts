import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//Envia o token
api.interceptors.request.use(
  config => {


    console.log('Starting Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data, // For POST/PUT requests
      params: config.params, // For GET requests
      headers: config.headers,
    });


    const token = Cookies.get('token'); 

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;