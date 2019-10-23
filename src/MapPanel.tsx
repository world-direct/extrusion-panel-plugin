import React, { CSSProperties } from 'react';
import ReactMapboxGl, { GeoJSONLayer, Popup } from 'react-mapbox-gl';
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

type Marker = {
  features: [
    {
      properties: {
        name: string;
        description: string;
        longitude: number;
        latitude: number;
      };
    }
  ];
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
  marker?: Marker;
}>;

class MapPanel extends React.Component<Props, State> {
  state: State = {
    marker: undefined,
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

  onExtrusionClick = (marker: Marker) => {
    this.setState({
      marker: marker,
    });
  };

  render() {
    const { getColorScheme, onMetricChange, onExtrusionClick } = this;
    const { metrics, viewOptions, mapJson, accessToken, metric, showGraph } = this.props;
    const { marker } = this.state;

    const Map = ReactMapboxGl({
      accessToken: accessToken,
    });

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
          renderChildrenInPortal={true}
        >
          <GeoJSONLayer
            id="metric"
            type="fill-extrusion"
            data={mapJson}
            fillExtrusionPaint={paint}
            fillExtrusionOnClick={(marker: Marker) => onExtrusionClick(marker)}
          />
          {marker && (
            <Popup
              key={marker.features[0].properties.name}
              coordinates={{ lon: marker.features[0].properties.longitude, lat: marker.features[0].properties.latitude }}
            >
              <div style={markerStyle}>{Number(marker.features[0].properties.description).toFixed(2)}</div>
            </Popup>
          )}
        </Map>
        <LegendBox colorScheme={getColorScheme()} />
      </div>
    );
  }
}
export default MapPanel;
