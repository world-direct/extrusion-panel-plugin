import { AbsoluteTimeRange, PanelProps } from '@grafana/data';
import { LoadingSpinner } from 'LoadingSpinner';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { PureComponent } from 'react';
import MapPanel from './MapPanel';
import { GeoJsonDataState, Options } from './types';

const WAIT_INTERVAL = 2000;

class ExtrusionPanel extends PureComponent<PanelProps<Options>, GeoJsonDataState> {
  timer?: number;

  readonly state: GeoJsonDataState = {
    isLoading: false,
    mapJson: {},
    viewOptions: {},
    colorSchemes: [],
    colorItems: [],
    locations: [],
    dynamic: true,
  };

  componentDidUpdate(prevProps: PanelProps<Options>, prevState: GeoJsonDataState) {
    const { triggerChange } = this;

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

      this.timer = window.setTimeout(triggerChange, WAIT_INTERVAL);
    }
  }

  componentDidMount() {
    const { triggerChange } = this;

    triggerChange();
  }

  triggerChange = () => {
    const { getMapData } = this;

    getMapData();
  };

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
    const { isLoading, colorSchemes, colorItems, viewOptions, mapJson, locations } = this.state;

    if (isLoading) {
      return <LoadingSpinner />;
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
        locations={locations}
        showLocations={showLocations}
        flatMap={flatMap}
        switchColorScheme={switchColorScheme}
      />
    );
  }

  getMapData = () => {
    const { fetchData } = this;

    this.setState({ isLoading: true });

    fetchData();
  };

  fetchData = () => {
    const { apiMapUri, apiUser, apiPassword, flatMap } = this.props.options;
    const { dynamic } = this.state;

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
        encodeURIComponent(this.props.timeRange.from.valueOf() + '') +
        '&to=' +
        encodeURIComponent(this.props.timeRange.to.valueOf() + '')
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
        })
      );
  };
}

export default ExtrusionPanel;
