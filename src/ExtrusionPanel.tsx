import { AbsoluteTimeRange, PanelProps } from '@grafana/data';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { PureComponent } from 'react';
import MapPanel from './MapPanel';
import { GeoJsonDataState, Options } from './types';

const WAIT_INTERVAL = 10000;

class ExtrusionPanel extends PureComponent<PanelProps<Options>, GeoJsonDataState> {
  timer?: number;
  offset: number = 0;

  readonly state: GeoJsonDataState = {
    isLoading: false,
    mapJson: {},
    viewOptions: {},
    colorSchemes: [],
    colorItems: [],
    locations: [],
    dynamic: false,
    metrics: [],
    offset: 0,
  };

  componentDidUpdate(prevProps: PanelProps<Options>, prevState: GeoJsonDataState) {
    const { triggerReload } = this;

    if (
      this.props.options.apiMapUri !== prevProps.options.apiMapUri ||
      this.props.options.apiUser !== prevProps.options.apiUser ||
      this.props.options.apiPassword !== prevProps.options.apiPassword ||
      this.props.options.showLocations !== prevProps.options.showLocations ||
      this.props.options.flatMap !== prevProps.options.flatMap ||
      this.props.timeRange.from.unix() !== prevProps.timeRange.from.unix() ||
      this.props.timeRange.to.unix() !== prevProps.timeRange.to.unix() ||
      this.props.data !== prevProps.data ||
      this.state.dynamic !== prevState.dynamic
    ) {
      clearTimeout(this.timer);

      triggerReload();
    }
  }

  componentDidMount() {
    const { triggerReload } = this;

    triggerReload();
  }

  triggerChange = () => {
    const { getMapData } = this;

    getMapData();
  };

  triggerReload = () => {
    const { triggerReload, getMapData } = this;

    getMapData();
    this.timer = window.setTimeout(triggerReload, WAIT_INTERVAL);
  }

  onHorizontalRegionSelected = (from: number, to: number) => {
    const newTimeRange: AbsoluteTimeRange = {
      from: from,
      to: to,
    };

    this.props.onChangeTimeRange(newTimeRange);
  };

  switchColorScheme = () => {
    const { dynamic } = this.state;

    this.setState({ dynamic: !dynamic });
  };

  render() {
    const { switchColorScheme } = this;
    const { accessToken, showLocations, flatMap } = this.props.options;
    const { isLoading, colorSchemes, colorItems, viewOptions, mapJson, locations, dynamic, metrics } = this.state;

    if (isLoading) {
      //return <LoadingSpinner />;
    }

    let metric = null;
    if (this.props.data.series != null && this.props.data.series.length > 0) {
      if (this.props.data.series[0].fields != null) {
        this.props.data.series[0].fields.forEach(f => {
          if (f.name === 'metric') {
            metric = f.values.get(0);
          }
        });
      }
    }

    if (!metric) {
      return <p>No metric selected</p>;
    }

    return (
      <MapPanel
        colorSchemes={colorSchemes}
        colorItems={colorItems}
        viewOptions={viewOptions}
        mapJson={mapJson}
        accessToken={accessToken}
        metric={Number(metric)}
        metrics={metrics}
        locations={locations}
        showLocations={showLocations}
        flatMap={flatMap}
        dynamic={dynamic}
        switchColorScheme={switchColorScheme}
      />
    );
  }

  getMapData = () => {
    const { fetchData, fetchMetrics } = this;

    this.setState({ isLoading: true });

    fetchData();
    fetchMetrics();
  };

  fetchData = () => {
    const { apiMapUri, apiUser, apiPassword, flatMap } = this.props.options;
    const { dynamic, offset } = this.state;

    let metric = null;
    let radius = null;
    let longitude = null;
    let latitude = null;
    let location = null;
    let square = null;
    let serial = null;

    if (this.props.data.series != null && this.props.data.series.length > 0) {
      if (this.props.data.series[0].fields != null) {
        this.props.data.series[0].fields.forEach(f => {
          const value = f.values.get(0);
          switch (f.name) {
            case 'metric':
              metric = value;
              break;
            case 'radius':
              radius = value;
              break;
            case 'longitude':
              longitude = value;
              break;
            case 'latitude':
              latitude = value;
              break;
            case 'location':
              location = value;
              break;
            case 'square':
              square = value;
              break;
            case 'serial':
              serial = value;
              break;
          }
        });
      }
    }

    let query = apiMapUri.concat(
      '/api/Measurments/map' +
        '?from=' +
        encodeURIComponent((this.props.timeRange.from.valueOf() + (offset * 1000)) + '') +
        '&to=' +
        encodeURIComponent((this.props.timeRange.to.valueOf() + (offset * 1000)) + '')
    );

    if (metric) {
      query = query.concat('&metric=' + encodeURIComponent(metric));
    }

    if (radius) {
      query = query.concat('&radius=' + encodeURIComponent(radius));
    }

    if (radius && longitude && latitude) {
      query = query.concat('&longitude=' + encodeURIComponent(longitude + '') + '&latitude=' + encodeURIComponent(latitude + ''));
    }

    if (location) {
      query = query.concat('&location=' + encodeURIComponent(location));
    }

    if (square) {
      query = query.concat('&square=' + encodeURIComponent(square));
    }

    if (serial) {
      query = query.concat('&serial=' + encodeURIComponent(serial));
    }

    if (flatMap) {
      query = query.concat('&flat=true');
    }

    if (!dynamic) {
      query = query.concat('&dynamic=false');
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
          colorItems: data.serialColorItems,
          locations: data.virtualLocations,
          offset: offset + 86400,
        })
      );
  };

  fetchMetrics = () => {
    const { apiMapUri, apiUser, apiPassword } = this.props.options;

    let query = apiMapUri.concat('/api/Metrics');

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
          metrics: data,
        })
      );
  };
}

export default ExtrusionPanel;
