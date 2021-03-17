import { CSSProperties } from 'react';

export interface ViewOptions {
  center?: [number, number];
  zoom?: [number];
  bearing?: [number];
  pitch?: [number];
}

export interface GeoJsonDataState {
  isLoading: boolean;
  mapJson: object;
  viewOptions: ViewOptions;
  colorSchemes: ColorScheme[];
  colorItems: ColorItem[];
  locations: VirtualLocation[];
  dynamic: boolean;
  metrics: Metric[];
  offset: number;
}

export interface Options {
  accessToken: string;
  apiMapUri: string;
  apiUser: string;
  apiPassword: string;
  showLocations: boolean;
  flatMap: boolean;
}

export const defaults: Options = {
  accessToken: '<insert access token>',
  apiMapUri: '<set api root-uri>',
  apiUser: '<set api user>',
  apiPassword: '<set api password>',
  showLocations: true,
  flatMap: false,
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

export interface ColorItem {
  serial: string;
  color: string;
}

export interface Metric {
  value: number;
  text: string;
}

export interface VirtualLocation {
  name: string;
  longitude: number;
  latitude: number;
  link?: string;
}
