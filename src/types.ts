import { CSSProperties } from 'react';

export interface ViewOptions {
  center?: [number, number];
  zoom?: [number];
  bearing?: [number];
  pitch?: [number];
}

export interface Metric {
  id: number;
  name: string;
  unit: string;
}

export interface GeoJsonDataState {
  isLoading: boolean;
  mapJson: object;
  viewOptions: ViewOptions;
  metricOptions: Metric[];
  metric?: Metric;
  colorSchemes: ColorScheme[];
}

export interface Options {
  accessToken: string;
  apiMapUri: string;
  apiUser: string;
  apiPassword: string;
  radius?: number;
  longitude?: number;
  latitude?: number;
  serial?: string;
}

export const defaults: Options = {
  accessToken: '<insert access token>',
  apiMapUri: '<set api root-uri>',
  apiUser: '<set api user>',
  apiPassword: '<set api password>',
};

export interface Styles {
  [key: string]: CSSProperties;
}

export interface ColorScheme {
  metricId: number;
  colorRangeItems: ColorRange[];
}

export interface ColorRange {
  fromInclusive?: number | null;
  toExclusive?: number | null;
  color: string;
}

export interface VirtualLocation {
  name?: string;
  longitude?: number;
  latitude?: number;
}
