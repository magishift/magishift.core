import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';

@Injectable()
export class HttpService {
  async Get(url: string): Promise<object> {
    try {
      const result: AxiosResponse<{ errors; rows }> = await axios.get(url);

      const data = result.data;

      if (data.errors && data.errors.length > 0) {
        const errors = [];

        data.errors.forEach(element => {
          errors.push(element.message);
        });

        throw errors.toString();
      }

      return data.rows[0].elements[0].distance.value;
    } catch (e) {
      const message = (e as AxiosError).response || (e as AxiosError).message;
      throw message;
    }
  }
}
