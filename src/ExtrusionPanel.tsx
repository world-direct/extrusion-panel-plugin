import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/ui';
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';
import { Options, GeoJsonDataState } from './types';
import 'mapbox-gl/dist/mapbox-gl.css';

export class ExtrusionPanel extends PureComponent<PanelProps<Options>, GeoJsonDataState> {
  constructor(props: any) {
    super(props);

    this.state = {
      isLoading: false,
      geoJson: {},
      viewOptions: {},
    };
  }

  reload(apiUri: string) {
    this.setState({ isLoading: true });
    fetch(apiUri)
      .then(response => response.json())
      .then(data => this.setState({ isLoading: false, geoJson: data.geoJson, viewOptions: data.viewOptions }));

    // const data =
    // {
    //   "viewOptions":{
    //       "center":[11.3863734397508, 47.2639689998285],
    //       "zoom":[15.99],
    //       "bearing":[20],
    //       "pitch":[40]
    //   },
    //   "geoJson": {
    //     "type": "FeatureCollection",
    //     "features": [
    //       {
    //         "type": "Feature",
    //         "properties": {
    //           "level": 1,
    //           "name": "Location-Test",
    //           "height": 200,
    //           "base_height": 0,
    //           "color": "red"
    //         },
    //         "geometry": {
    //           "type": "Polygon",
    //           "coordinates": [
    //             [
    //               [11.3863734397508, 47.2639689998285],
    //               [11.386572, 47.2638342527074],
    //               [11.3867705602492, 47.2639689998285],
    //               [11.386572, 47.2641037472926],
    //               [11.3863734397508, 47.2639689998285]
    //             ]
    //           ]
    //         }
    //       }
    //     ]
    //   }
    // };
  }

  componentWillReceiveProps(newProps: PanelProps<Options>) {
    if (this.props.options.apiUri !== newProps.options.apiUri) {
      this.reload(newProps.options.apiUri);
    }
  }

  componentDidMount() {
    this.reload(this.props.options.apiUri);
  }

  render() {
    const Map = ReactMapboxGl({
      accessToken: this.props.options.accessToken,
    });

    if (this.state.isLoading) {
      return <p>Loading ...</p>;
    }

    const geoJson = this.state.geoJson;
    const viewOptions = this.state.viewOptions;

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
      'fill-extrusion-opacity': 0.6,
    };

    return (
      <Map
        style="mapbox://styles/mapbox/streets-v11"
        center={viewOptions.center}
        zoom={viewOptions.zoom}
        pitch={viewOptions.pitch}
        bearing={viewOptions.bearing}
        containerStyle={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: '100%',
        }}
      >
        <GeoJSONLayer id="metric" type="fill-extrusion" data={geoJson} fillExtrusionPaint={paint} />
      </Map>
    );
  }
}
