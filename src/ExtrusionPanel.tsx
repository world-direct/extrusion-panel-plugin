import React, { PureComponent } from 'react';
import Dropdown, { Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import { PanelProps } from '@grafana/ui';
import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';
import { Options, GeoJsonDataState, Metric } from './types';
import 'mapbox-gl/dist/mapbox-gl.css';
import { LegendBox } from 'LegendBox';

export class ExtrusionPanel extends PureComponent<PanelProps<Options>, GeoJsonDataState> {
  private staticMetricOptions: Option[];
  private onMetricChange: (selectedOption: Option) => void;

  constructor(props: any) {
    super(props);

    this.staticMetricOptions = this.getMetricOptions();

    this.onMetricChange = this.onMetricChangeFunction.bind(this);

    this.state = {
      isLoading: false,
      geoJson: {},
      viewOptions: {},
      metric: Metric.ParticulateMatter10 as Metric,
      colorSchemes: [],
    };
  }

  getMetricOptions(): Option[] {
    const options = new Array<Option>();
    for (const metric in Metric) {
      options.push({ label: Metric[metric], value: metric });
    }
    return options;
  }

  onMetricChangeFunction(selectedOption: Option) {
    const tmpMetric = (selectedOption.value as unknown) as Metric;
    this.setState({ metric: tmpMetric });
    this.reload(this.props.options.apiUri, this.props.options.apiUser, this.props.options.apiPassword, tmpMetric);
  }

  reload(apiUri: string, apiUser: string, apiPassword: string, metric: Metric) {
    this.setState({ isLoading: true });
    fetch(
      apiUri.concat(
        '?metric=' +
          encodeURIComponent((metric as unknown) as string) +
          '&fromUTC=' +
          encodeURIComponent(this.props.timeRange.from.unix() + '') +
          '&toUTC=' +
          encodeURIComponent(this.props.timeRange.to.unix() + '')
      ),
      {
        mode: 'cors',
        headers: new Headers({
          Authorization: 'Basic ' + btoa(apiUser + ':' + apiPassword),
          'Content-Type': 'application/json',
        }),
      }
    )
      .then(response => response.json())
      .then(data =>
        this.setState({
          isLoading: false,
          geoJson: data.geoJson,
          viewOptions: data.viewOptions,
          colorSchemes: data.colorScheme,
        })
      );
  }

  componentDidUpdate(prevProps: PanelProps<Options>) {
    if (
      this.props.options.apiUser !== prevProps.options.apiUser ||
      this.props.options.apiPassword !== prevProps.options.apiPassword ||
      this.props.options.apiUri !== prevProps.options.apiUri ||
      this.props.timeRange.from.unix() !== prevProps.timeRange.from.unix() ||
      this.props.timeRange.to.unix() !== prevProps.timeRange.to.unix()
    ) {
      this.reload(this.props.options.apiUri, this.props.options.apiUser, this.props.options.apiPassword, this.state.metric);
    }
  }

  componentDidMount() {
    this.reload(this.props.options.apiUri, this.props.options.apiUser, this.props.options.apiPassword, this.state.metric);
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
      'fill-extrusion-opacity': 0.5,
    };

    const options = this.staticMetricOptions;

    let colorScheme = undefined;

    if (this.state.colorSchemes) {
      colorScheme = this.state.colorSchemes.find(c => c.metric === this.state.metric);
    }

    return (
      <div>
        <div>
          <Dropdown options={options} value={(this.state.metric as unknown) as string} onChange={this.onMetricChange} />
        </div>
        <div>
          <Map
            style="mapbox://styles/mapbox/streets-v11"
            center={viewOptions.center}
            zoom={viewOptions.zoom}
            pitch={viewOptions.pitch}
            bearing={viewOptions.bearing}
            containerStyle={{
              position: 'absolute',
              top: 50,
              bottom: 0,
              width: '100%',
            }}
          >
            <GeoJSONLayer id="metric" type="fill-extrusion" data={geoJson} fillExtrusionPaint={paint} />
          </Map>
          <LegendBox colorScheme={colorScheme} />
        </div>
      </div>
    );
  }
}
