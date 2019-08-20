export interface ViewOptions {
  center?: [number, number];
  zoom?: [number];
  bearing?: [number];
  pitch?: [number];
}

export interface GeoJsonDataState {
  isLoading: boolean;
  geoJson: object;
  viewOptions: ViewOptions;
}

export interface Options {
  accessToken: string;
  apiUri: string;
}

export const defaults: Options = {
  accessToken: '<insert access token>', // 'pk.eyJ1Ijoic2ltb25wZmVpZmhvZmVyIiwiYSI6ImNqejlzZms5ODAyeXQzbW5wMTRicWJweDcifQ.rQSLUl9722_65grJjjTK4A'
  apiUri: '<set api root-uri>', // http://www.mocky.io/v2/5d5a812e2f00002c0036f626
};
