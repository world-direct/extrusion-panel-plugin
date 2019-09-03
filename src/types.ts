export interface ViewOptions {
  center?: [number, number];
  zoom?: [number];
  bearing?: [number];
  pitch?: [number];
}

export enum Metric {
  ParticulateMatter10 = 'Particulate Matter 10',
  ParticulateMatter25 = 'Particulate Matter 25',
  NitrogenDioxide = 'Nitrogen Dioxide',
  Ozone = 'Ozone',
  SulfurDioxide = 'Sulfur Dioxide',
  Temperature = 'Temperature',
  Humidity = 'Humidity',
  Pressure = 'Pressure',
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
