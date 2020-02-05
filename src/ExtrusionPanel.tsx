import { PanelProps } from '@grafana/ui';
import { LoadingSpinner } from 'LoadingSpinner';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { PureComponent } from 'react';
import MapPanel from './MapPanel';
import { GeoJsonDataState, Metric, Options } from './types';
import { AbsoluteTimeRange } from '@grafana/data';

const WAIT_INTERVAL = 2000;

class ExtrusionPanel extends PureComponent<PanelProps<Options>, GeoJsonDataState> {
  timer?: number;

  readonly state: GeoJsonDataState = {
    isLoading: false,
    mapJson: {},
    viewOptions: {},
    metricOptions: [],
    colorSchemes: [],
  };

  onMetricChange = (item: Metric) => {
    const { getMapData } = this;

    this.setState({ metric: item });

    getMapData(item);
  };

  componentDidUpdate(prevProps: PanelProps<Options>) {
    const { triggerChange } = this;

    if (
      this.props.options.apiMapUri !== prevProps.options.apiMapUri ||
      this.props.options.apiUser !== prevProps.options.apiUser ||
      this.props.options.apiPassword !== prevProps.options.apiPassword ||
      this.props.timeRange.from.unix() !== prevProps.timeRange.from.unix() ||
      this.props.timeRange.to.unix() !== prevProps.timeRange.to.unix() ||
      this.props.options.radius !== prevProps.options.radius ||
      this.props.options.longitude !== prevProps.options.longitude ||
      this.props.options.latitude !== prevProps.options.latitude ||
      this.props.options.serial !== prevProps.options.serial
    ) {
      clearTimeout(this.timer);

      this.timer = setTimeout(triggerChange, WAIT_INTERVAL);
    }
  }

  componentDidMount() {
    const { triggerChange } = this;

    triggerChange();
  }

  triggerChange = () => {
    const { metric } = this.state;
    const { getMapData } = this;

    getMapData(metric);
  };

  onHorizontalRegionSelected = (from: number, to: number) => {
    const newTimeRange: AbsoluteTimeRange = {
      from: from,
      to: to,
    };

    this.props.onChangeTimeRange(newTimeRange);
  };

  render() {
    const { onMetricChange } = this;
    const { accessToken } = this.props.options;
    const { isLoading, colorSchemes, viewOptions, mapJson, metric, metricOptions } = this.state;

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (!metric) {
      return <p>No metric selected</p>;
    }

    return (
      <MapPanel
        metrics={metricOptions}
        onMetricChange={onMetricChange}
        colorSchemes={colorSchemes}
        viewOptions={viewOptions}
        mapJson={mapJson}
        accessToken={accessToken}
        metric={metric}
      />
    );
  }

  getMapData = (metric?: Metric) => {
    const { fetchMetrics, fetchData } = this;

    this.setState({ isLoading: true });

    if (!metric) {
      fetchMetrics();
    } else {
      fetchData();
    }
  };

  fetchMetrics = () => {
    const { fetchData } = this;
    const { apiMapUri, apiUser, apiPassword } = this.props.options;

    const query = apiMapUri + '/api/AirQuality/metrics';

    fetch(query, {
      mode: 'cors',
      headers: new Headers({
        Authorization: 'Basic ' + btoa(apiUser + ':' + apiPassword),
        'Content-Type': 'application/json',
      }),
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          metricOptions: data,
          metric: data[0],
        });

        fetchData();
      });
  };

  fetchData = () => {
    const { metric } = this.state;
    const { apiMapUri, apiUser, apiPassword, radius, longitude, latitude, serial } = this.props.options;

    if (!metric) {
      return;
    }

    let query = apiMapUri.concat(
      '/api/AirQuality/map' +
        '?from=' +
        encodeURIComponent(this.props.timeRange.from.valueOf() + '') +
        '&to=' +
        encodeURIComponent(this.props.timeRange.to.valueOf() + '') +
        '&metric=' +
        encodeURIComponent(metric.id)
    );

    if (longitude && latitude) {
      query = query.concat(
        '&radius=' +
          encodeURIComponent((radius || 1) * 20) +
          '&longitude=' +
          encodeURIComponent(longitude + '') +
          '&latitude=' +
          encodeURIComponent(latitude + '')
      );
    }

    if (serial) {
      query = query.concat('&serial=' + encodeURIComponent(serial));
    }

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
        })
      );
  };
}

export default ExtrusionPanel;
