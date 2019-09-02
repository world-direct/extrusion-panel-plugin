export interface ViewOptions {
  center?: [number, number];
  zoom?: [number];
  bearing?: [number];
  pitch?: [number];
}

export enum Metric {
  Temperature = 'Temperature',
  Humidity = 'Humidity',
  Pressure = 'Pressure',
  ParticulateMatter = 'Particulate Matter',
  CarbonMonoxide = 'Carbon Monoxide',
  NitrogenDioxide = 'Nitrogen Dioxide',
  SulfurDioxide = 'Sulfur Dioxide',
  Ozone = 'Ozone',
  NitricOxide = 'Nitric Oxide',
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
