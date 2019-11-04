import React, { CSSProperties, MouseEvent } from 'react';
import ReactMapboxGl, { Popup, GeoJSONLayer } from 'react-mapbox-gl';
import { ExtrusionSelect } from './ExtrusionSelect';
import { LegendBox } from './LegendBox';
import { ColorScheme, Metric, ViewOptions } from './types';

const selectStyle: CSSProperties = {
  width: 200,
  opacity: 0.8,
  position: 'absolute',
  top: 8,
  left: 2,
  zIndex: 1,
  boxShadow: '2px 2px #888',
};

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
  metrics: Metric[];
  onMetricChange: (item: Metric) => void;
  colorSchemes: ColorScheme[];
  viewOptions: ViewOptions;
  mapJson: object;
  accessToken: string;
  metric: Metric;
  showGraph: boolean;
}>;

type State = Readonly<{
  marker?: PropertyType;
  Map: any;
}>;

class MapPanel extends React.Component<Props, State> {
  state: State = {
    marker: undefined,
    Map: ReactMapboxGl({
      //minZoom: 2,
      //maxZoom: 10,
      accessToken: this.props.accessToken,
    }),
  };

  getColorScheme = (): ColorScheme | undefined => {
    const { colorSchemes, metric } = this.props;

    let colorScheme = undefined;
    if (colorSchemes) {
      colorScheme = colorSchemes.find(c => c.metric === metric);
    }
    return colorScheme;
  };

  onMetricChange = (metric: Metric) => {
    const { onMetricChange } = this.props;

    onMetricChange(metric);
  };

  fillExtrusionOnMouseEnter = (event: any) => {
    this.setState({
      marker: event.features[0].properties,
    });
  };

  fillExtrusionOnMouseLeave = (event: any) => {
    this.setState({
      marker: undefined,
    });
  };

  fillExtrusionOnMouseClick = (event: MouseEvent<any>) => {
    this.setState({
      marker: event.currentTarget.properties,
    });
  };

  render() {
    const { getColorScheme, onMetricChange, fillExtrusionOnMouseEnter, fillExtrusionOnMouseLeave } = this;
    const { metrics, viewOptions, mapJson, metric, showGraph } = this.props;
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
      'fill-extrusion-opacity': 0.5,
    };

    return (
      <div>
        {!showGraph && <ExtrusionSelect<Metric> options={metrics} style={selectStyle} onChange={onMetricChange} value={metric} />}

        <Map
          style="mapbox://styles/mapbox/streets-v11"
          center={viewOptions.center}
          zoom={viewOptions.zoom}
          pitch={viewOptions.pitch}
          bearing={viewOptions.bearing}
          containerStyle={containerStyle}
        >
          <GeoJSONLayer
            data={mapJson}
            type="fill-extrusion"
            id="metric"
            fillExtrusionPaint={paint}
            fillExtrusionOnMouseEnter={fillExtrusionOnMouseEnter}
            fillExtrusionOnMouseLeave={fillExtrusionOnMouseLeave}
          />

          {marker && (
            <Popup key={marker.name} coordinates={{ lon: marker.longitude, lat: marker.latitude }} offset={marker.height}>
              <div style={markerStyle}>{Number(marker.description).toFixed(2)}</div>
            </Popup>
          )}
        </Map>
        <LegendBox colorScheme={getColorScheme()} />
      </div>
    );
  }
}
export default MapPanel;
