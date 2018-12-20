import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ConfigService } from '../config/config.service';

@Injectable()
export class HttpService {
  private gqlHost: string;
  private gqlPort: number;
  private isHttps: boolean;
  private gqlServer: string;

  constructor() {
    this.gqlHost = ConfigService.getConfig.gql.host;
    this.gqlPort = ConfigService.getConfig.gql.port;
    this.isHttps = ConfigService.getConfig.isHttps;
    this.gqlServer = `${this.isHttps ? 'https' : 'http'}://${this.gqlHost}:${this.gqlPort}/graphql`;
  }

  async ExecGql(body: object): Promise<object> {
    try {
      const result: AxiosResponse<{ errors; data }> = await axios.post(this.gqlServer, body);

      const data = result.data;

      if (data.errors && data.errors.length > 0) {
        const errors = [];

        data.errors.forEach(element => {
          errors.push(element.message);
        });

        throw errors.toString();
      }

      return data.data;
    } catch (e) {
      const message = (e as AxiosError).response || (e as AxiosError).message;
      throw message;
    }
  }

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
