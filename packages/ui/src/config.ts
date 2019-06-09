import dotenv from 'dotenv';
import url from 'url';

dotenv.config();

let apiVersion = process.env.EXCELLERIFY_API_VERSION || '';

apiVersion = apiVersion ? `/${apiVersion}` : '';

const apiBaseUrl =
  process.env.VUE_APP_API_URL || `http://localhost:3000/api${apiVersion}`;

export const config = {
  appTitle: '',
  locale: 'en-US', // en-US, zh-CN
  ajaxUploadUrl: url.resolve(apiBaseUrl, 'files'),
  debug: {
    mock: false, // enable mock
    http: false, // http request log
  },
  api: url.format(apiBaseUrl),
  grid: {
    limit: 25,
  },
  format: {
    date: 'YYYY-MM-DD',
    time: 'HH:mm',
  },
};
