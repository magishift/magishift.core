import { config } from '@/config';
import { router } from '@/router';
import { store } from '@/store';
import axios, { AxiosError, AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';
import validator from 'validator';

export const http: AxiosInstance = axios.create({
  baseURL: config.api,
  timeout: 10000,
  headers: {
    "realm": 'master',
    'x-realm': 'master',
    'Cache-Control': 'no-cache',
    "authorization": JSON.parse(
      localStorage.getItem('token') || '"Bearer public"',
    ),
  },
});

axiosRetry(http, {
  retries: 3,
  retryDelay: retryCount => {
    return retryCount * 1000;
  },
  retryCondition: (error: AxiosError): boolean => {
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.status === 403 ||
        error.response.status === 500)
    ) {
      return false;
    }

    if (error.config.method && ['get'].indexOf(error.config.method) > -1) {
      return true;
    }

    return false;
  },
});

http.interceptors.request.use(
  request => request,
  error =>
    // Do something with request error
    Promise.reject(error),
);

http.interceptors.response.use(
  response => {
    const request = response.config;
    if (config.debug.http) {
      // eslint-disable-next-line
      console.info(
        '>>>',
        request.method && request.method.toUpperCase(),
        request.url,
        request.params,
        '\n   ',
        response.status,
        response.data,
      );
    }
    return response;
  },
  error => {
    if (config.debug.http) {
      const { response, config: request } = error;
      if (request) {
        // eslint-disable-next-line
        console.info(
          '>>>',
          request.method.toUpperCase(),
          request.url,
          request.params,
          '\n   ',
          response.status,
          response.data,
        );
      }
    }

    if (!error.response) {
      // eslint-disable-next-line
      error.response = {
        status: 503,
        data: {
          error: error.message,
        },
      };
    } else if (error.response.status === 401 || error.response.status === 403) {
      router.push('/login');
    }

    const message = `[API ${error.config.method.toUpperCase()} ${
      error.config.url
    }] ${
      error.response && error.response.data && error.response.data.message
        ? typeof error.response.data.message.error === 'string'
          ? error.response.data.message.error
          : error.response.data.message
        : error.message
    }`;

    store.commit('setGlobalError', message);

    return Promise.reject(error);
  },
);

export async function fetchFile(
  file: { id: string } | string,
): Promise<string> {
  let url: string = '/fileStorage/openFile/';

  if (typeof file === 'object' && validator.isUUID(file.id)) {
    url += file.id;
  } else if (typeof file === 'string') {
    if (validator.isUUID(file)) {
      url += file;
    } else {
      url = file;
    }
  } else {
    throw new Error('Invalid file object structure');
  }

  const { data } = await http.get(url);

  return URL.createObjectURL(data);
}
