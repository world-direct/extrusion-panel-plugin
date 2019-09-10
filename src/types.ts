import { CSSProperties } from 'react';

export interface ViewOptions {
  center?: [number, number];
  zoom?: [number];
  bearing?: [number];
  pitch?: [number];
}

export enum Metric {
  ParticulateMatter10 = 'ParticulateMatter10' as any,
  ParticulateMatter25 = 'ParticulateMatter25' as any,
  NitrogenDioxide = 'NitrogenDioxide' as any,
  Ozone = 'Ozone' as any,
  SulfurDioxide = 'SulfurDioxide' as any,
  Temperature = 'Temperature' as any,
  Humidity = 'Humidity' as any,
  Pressure = 'Pressure' as any,
}

export interface GeoJsonDataState {
  isLoading: boolean;
  geoJson: object;
  viewOptions: ViewOptions;
  metric: Metric;
  colorSchemes: ColorScheme[];
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

export interface Styles {
  [key: string]: CSSProperties;
}

export interface ColorScheme {
  metric: Metric;
  colorRangeItems: ColorRange[];
}

export interface ColorRange {
  fromInclusive?: number | null;
  toExclusive?: number | null;
  color: string;
}
