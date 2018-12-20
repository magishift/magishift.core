export interface IGoogleMapLocation {
  text: string;
  titleAddress: string;
  address: string;
  lat: number;
  lng: number;
}

export interface IGoogleMapService {
  calculateDistance(origin: IGoogleMapLocation, destination: IGoogleMapLocation): Promise<number>;
}
