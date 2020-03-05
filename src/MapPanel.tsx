import React, { CSSProperties } from 'react';
import ReactMapboxGl, { Popup, GeoJSONLayer } from 'react-mapbox-gl';
import { LegendBox } from './LegendBox';
import { ColorScheme, ViewOptions } from './types';

const WAIT_INTERVAL = 2000;

const containerStyle: CSSProperties = {
  position: 'absolute',
  top: 6,
  bottom: 0,
  left: 0,
  width: '100%',
};

const markerStyle: CSSProperties = {
  color: '#000',
};

type PropertyType = {
  name: string;
  description: string;
  longitude: number;
  latitude: number;
  height: number;
};

type Props = Readonly<{
  colorSchemes: ColorScheme[];
  viewOptions: ViewOptions;
  mapJson: object;
  accessToken: string;
  metric: number;
}>;

type State = Readonly<{
  marker?: PropertyType;
  Map: any;
}>;

class MapPanel extends React.Component<Props, State> {
  timer?: number;

  state: State = {
    marker: undefined,
    Map: ReactMapboxGl({
      minZoom: 12.5,
      maxZoom: 15.5,
      accessToken: this.props.accessToken,
    }),
  };

  getColorScheme = (): ColorScheme | undefined => {
    const { colorSchemes, metric } = this.props;

    let colorScheme = undefined;
    if (colorSchemes) {
      colorScheme = colorSchemes.find(c => c.metricId === metric);
    }
    return colorScheme;
  };

  showMarker = (event: any) => {
    clearTimeout(this.timer);

    this.setState({
      marker: event.features[0].properties,
    });
  };

  hideMarker = () => {
    this.setState({
      marker: undefined,
    });
  };

  onMouseLeave = () => {
    const { hideMarker } = this;

    clearTimeout(this.timer);
    this.timer = window.setTimeout(hideMarker, WAIT_INTERVAL);
  };

  render() {
    const { getColorScheme, showMarker, onMouseLeave } = this;
    const { viewOptions, mapJson } = this.props;
    const { marker, Map } = this.state;

    const paint = {
      // See the Mapbox Style Specification for details on data expressions.
      // https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions

      // Get the fill-extrusion-color from the source 'color' property.
      'fill-extrusion-color': ['get', 'color'],

      // Get fill-extrusion-height from the source 'height' property.
      'fill-extrusion-height': ['get', 'height'],

      // Get fill-extrusion-base from the source 'base_height' property.
      'fill-extrusion-base': ['get', 'base_height'],

      // Make extrusions slightly opaque for see through indoor walls.
      'fill-extrusion-opacity': 0.7,
    };

    return (
      <div>
        <Map
          style="mapbox://styles/mapbox/streets-v11"
          center={viewOptions.center}
          zoom={viewOptions.zoom}
          pitch={viewOptions.pitch}
          bearing={viewOptions.bearing}
          containerStyle={containerStyle}
          movingMethod="easeTo"
        >
          <GeoJSONLayer
            data={mapJson}
            type="fill-extrusion"
            id="metric"
            fillExtrusionPaint={paint}
            fillExtrusionOnMouseMove={showMarker}
            fillExtrusionOnMouseLeave={onMouseLeave}
          />

          {marker && (
            <Popup key={marker.name} coordinates={[marker.longitude, marker.latitude, marker.height]}>
              <div style={markerStyle}>{Number(marker.description.replace(',', '.')).toFixed(2)}</div>
            </Popup>
          )}
        </Map>
        <LegendBox colorScheme={getColorScheme()} />
      </div>
    );
  }
}
export default MapPanel;
