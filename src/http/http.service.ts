import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  async Post(url: string, payload?: any, config?: AxiosRequestConfig): Promise<any> {
    try {
      const result: AxiosResponse<{ errors; rows }> = await axios.post(url, payload, config);

      const data = result.data;

      if (data.errors && data.errors.length > 0) {
        const errors = [];
        data.errors.forEach(element => {
          errors.push(element.message);
        });

        throw errors.toString();
      }

      return data;
    } catch (e) {
      const message = (e as AxiosError).response || (e as AxiosError).message;
      throw message;
    }
  }

  async Get(url: string, config?: AxiosRequestConfig): Promise<any> {
    try {
      const result: AxiosResponse<{ errors; rows }> = await axios.get(url, config);

      const data = result.data;

      if (data.errors && data.errors.length > 0) {
        const errors = [];
        data.errors.forEach(element => {
          errors.push(element.message);
        });

        throw errors.toString();
      }

      return data;
    } catch (e) {
      const message = (e as AxiosError).response || (e as AxiosError).message;
      throw message;
    }
  }

  async Delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    try {
      const result: AxiosResponse<{ errors; rows }> = await axios.delete(url, config);

      const data = result.data;

      if (data.errors && data.errors.length > 0) {
        const errors = [];
        data.errors.forEach(element => {
          errors.push(element.message);
        });

        throw errors.toString();
      }

      return data;
    } catch (e) {
      const message = (e as AxiosError).response || (e as AxiosError).message;
      throw message;
    }
  }
}
