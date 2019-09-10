export interface ViewOptions {
  center?: [number, number];
  zoom?: [number];
  bearing?: [number];
  pitch?: [number];
}

export enum Metric {
  ParticulateMatter10 = <any>'Particulate Matter 10',
  ParticulateMatter25 = <any>'Particulate Matter 25',
  NitrogenDioxide = <any>'Nitrogen Dioxide',
  Ozone = <any>'Ozone',
  SulfurDioxide = <any>'Sulfur Dioxide',
  Temperature = <any>'Temperature',
  Humidity = <any>'Humidity',
  Pressure = <any>'Pressure',
}

export interface GeoJsonDataState {
  isLoading: boolean;
  geoJson: object;
  viewOptions: ViewOptions;
  metric: Metric;
}

export interface Options {
  accessToken: string;
  apiUri: string;
  apiUser: string;
  apiPassword: string;
}

export const defaults: Options = {
  accessToken: '<insert access token>',
  apiUri: '<set api root-uri>',
  apiUser: '<set api user>',
  apiPassword: '<set api password>',
};
