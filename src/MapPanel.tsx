import React, { CSSProperties } from 'react';
import ReactMapboxGl, { GeoJSONLayer, Marker, Popup } from 'react-mapbox-gl';
import { LegendBox } from './LegendBox';
import { SerialColorBox } from './SerialColorBox';
import { ColorItem, ColorScheme, ViewOptions, VirtualLocation } from './types';

const WAIT_INTERVAL = 1000;

const containerStyle: CSSProperties = {
  position: 'absolute',
  top: 6,
  bottom: 0,
  left: 0,
  width: '100%',
};

const markerStyle: CSSProperties = {
  color: '#000',
  padding: '5px',
  background: '#fff',
  borderRadius: '4px',
};

const markerLinkStyle: CSSProperties = {
  color: '#000',
};

const toggleContainerStyle: CSSProperties = {
  zIndex: 1,
  position: 'absolute',
  top: 10,
  left: 5,
  width: 100,
  background: '#fff',
  padding: 4,
  opacity: 0.8,
};

const toggleButtonStyle: CSSProperties = {
  width: '100%',
  color: '#fff',
  backgroundColor: 'rgb(110, 170, 240)',
  padding: '0px 2px',
  textShadow: '1px 1px #888',
  boxShadow: '2px 2px #888',
  border: 'none',
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
  colorItems: ColorItem[];
  viewOptions: ViewOptions;
  mapJson: object;
  accessToken: string;
  metric: number;
  locations: VirtualLocation[];
  showLocations: boolean;
  flatMap: boolean;
  switchColorScheme: () => void;
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
    const { viewOptions, mapJson, locations, showLocations, flatMap, colorItems, switchColorScheme, metric } = this.props;
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

    let markerContent = <></>;

    if (marker) {
      var numberMarker = Number(marker.description.replace(',', '.'));

      if (isNaN(numberMarker)) {
        markerContent = <>{marker.description}</>;
      } else {
        markerContent = <>{numberMarker.toFixed(2)}</>;
      }
    }

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

          {showLocations &&
            locations.map(value => (
              <Marker coordinates={[value.longitude, value.latitude]} anchor="bottom">
                <div style={markerStyle}>
                  {!value.link && <>{value.name}</>}
                  {value.link && (
                    <a style={markerLinkStyle} href={value.link} target="_blank">
                      {value.name}
                    </a>
                  )}
                </div>
              </Marker>
            ))}

          {marker && (
            <Popup key={marker.name} coordinates={[marker.longitude, marker.latitude, marker.height]}>
              <div>
                <a style={markerLinkStyle} href="/d/Monitor/monitor" target="_blank">
                  {markerContent}
                </a>
              </div>
            </Popup>
          )}
        </Map>
        {flatMap ? <SerialColorBox colorItems={colorItems} /> : <LegendBox colorScheme={getColorScheme()} />}
        {metric === 1 &&
          <div style={toggleContainerStyle}>
            <button onClick={switchColorScheme} style={toggleButtonStyle}>Toggle</button>
          </div>
        }
      </div>
    );
  }
}
export default MapPanel;
