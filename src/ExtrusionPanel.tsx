import { PanelProps } from '@grafana/ui';
import { LoadingSpinner } from 'LoadingSpinner';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { PureComponent } from 'react';
import GraphPanel from './GraphPanel';
import MapPanel from './MapPanel';
import { DisplayOption, GeoJsonDataState, Metric, Options, VirtualLocation } from './types';

class ExtrusionPanel extends PureComponent<PanelProps<Options>, GeoJsonDataState> {
  readonly state: GeoJsonDataState = {
    isLoading: false,
    mapJson: {},
    graphJson: {},
    viewOptions: {},
    colorSchemes: [],
    locations: [],
    metric: Metric.ParticulateMatter10,
    location: {},
  };

  getMetricOptions(): Metric[] {
    const options = new Array<Metric>();
    for (const metric in Metric) {
      options.push((Metric[metric] as unknown) as Metric);
    }
    return options;
  }

  onMetricChange = (item: Metric) => {
    const { getMapData } = this;
    const { apiMapUri, apiUser, apiPassword } = this.props.options;

    this.setState({ metric: item });
    getMapData(apiMapUri, apiUser, apiPassword, item);
  };

  onLocationChange = (item: VirtualLocation) => {
    const { getGraphData } = this;
    const { apiGraphUri, apiUser, apiPassword } = this.props.options;
    const { metric } = this.state;

    this.setState({ location: item });
    getGraphData(apiGraphUri, apiUser, apiPassword, metric, item);
  };

  componentDidUpdate(prevProps: PanelProps<Options>) {
    const { getMapData, getGraphData } = this;
    const { apiGraphUri, apiMapUri, apiUser, apiPassword } = this.props.options;
    const { metric, location } = this.state;

    if (
      this.props.options.apiUser !== prevProps.options.apiUser ||
      this.props.options.apiPassword !== prevProps.options.apiPassword ||
      this.props.timeRange.from.unix() !== prevProps.timeRange.from.unix() ||
      this.props.timeRange.to.unix() !== prevProps.timeRange.to.unix()
    ) {
      getMapData(apiMapUri, apiUser, apiPassword, metric);
      getGraphData(apiGraphUri, apiUser, apiPassword, metric, location);
    }

    if (this.props.options.apiMapUri !== prevProps.options.apiMapUri) {
      getMapData(apiMapUri, apiUser, apiPassword, metric);
    }

    if (this.props.options.apiGraphUri !== prevProps.options.apiGraphUri) {
      getGraphData(apiGraphUri, apiUser, apiPassword, metric, location);
    }
  }

  componentDidMount() {
    const { getMapData, getGraphData } = this;
    const { apiGraphUri, apiMapUri, apiUser, apiPassword } = this.props.options;
    const { metric, location } = this.state;

    getMapData(apiMapUri, apiUser, apiPassword, metric);
    getGraphData(apiGraphUri, apiUser, apiPassword, metric, location);
  }

  render() {
    const { getMetricOptions, onMetricChange, onLocationChange } = this;
    const { timeRange } = this.props;
    const { accessToken } = this.props.options;
    const { isLoading, colorSchemes, viewOptions, mapJson, locations, graphJson, metric, location } = this.state;

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (this.props.options.display === DisplayOption.Map) {
      return (
        <MapPanel
          metrics={getMetricOptions()}
          onMetricChange={onMetricChange}
          colorSchemes={colorSchemes}
          viewOptions={viewOptions}
          mapJson={mapJson}
          accessToken={accessToken}
          metric={metric}
        />
      );
    }

    if (this.props.options.display === DisplayOption.Graph) {
      return (
        <GraphPanel
          metrics={getMetricOptions()}
          onMetricChange={onMetricChange}
          onLocationChange={onLocationChange}
          timeRange={timeRange}
          locations={locations}
          graphJson={graphJson}
          metric={metric}
          location={location}
        />
      );
    }

    return <p>Invalid display option.</p>;
  }

  getMapData = (apiMapUri: string, apiUser: string, apiPassword: string, metric: Metric) => {
    this.setState({ isLoading: true });

    const query = apiMapUri.concat(
      '?metric=' +
        encodeURIComponent((metric as unknown) as string) +
        '&fromUTC=' +
        encodeURIComponent(this.props.timeRange.from.unix() + '') +
        '&toUTC=' +
        encodeURIComponent(this.props.timeRange.to.unix() + '')
    );

    fetch(query, {
      mode: 'cors',
      headers: new Headers({
        Authorization: 'Basic ' + btoa(apiUser + ':' + apiPassword),
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          isLoading: false,
          mapJson: data.geoJson,
          viewOptions: data.viewOptions,
          colorSchemes: data.colorSchemes,
          locations: data.virtualLocations,
        })
      );
  };

  getGraphData = (apiGraphUri: string, apiUser: string, apiPassword: string, metric: Metric, location: VirtualLocation) => {
    if (!location.longitude || !location.latitude) {
      return;
    }

    this.setState({ isLoading: true });

    const query = apiGraphUri.concat(
      '?latitude=' +
        encodeURIComponent(location.latitude + '') +
        '&longitude=' +
        encodeURIComponent(location.longitude + '') +
        '&metric=' +
        encodeURIComponent((metric as unknown) as string) +
        '&fromUTC=' +
        encodeURIComponent(this.props.timeRange.from.unix() + '') +
        '&toUTC=' +
        encodeURIComponent(this.props.timeRange.to.unix() + '')
    );

    fetch(query, {
      mode: 'cors',
      headers: new Headers({
        Authorization: 'Basic ' + btoa(apiUser + ':' + apiPassword),
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(data =>
        this.setState({
          isLoading: false,
          graphJson: data.graphJson,
          locations: data.virtualLocations,
        })
      );
  };
}
export default ExtrusionPanel;
