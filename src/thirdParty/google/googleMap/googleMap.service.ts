import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../../config/config.service';
import { HttpService } from '../../../http/http.service';
import { IGoogleMapLocation, IGoogleMapService } from './interfaces/googleMap.interface';

@Injectable()
export class GoogleMapService implements IGoogleMapService {
  private googleApiKey: string;
  private urlDistanceMatrix: string = 'https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial';

  constructor(protected readonly http: HttpService) {
    this.googleApiKey = ConfigService.getConfig.googleApiKey;
  }

  async calculateDistance(origin: IGoogleMapLocation, destination: IGoogleMapLocation): Promise<number> {
    const url =
      this.urlDistanceMatrix +
      `&origins=${origin.lat},${origin.lng}\
      &destinations=${destination.lat},${destination.lng}\
      &key=${this.googleApiKey}`;

    const result = await this.http.Get(url);

    return Number(result);
  }
}
