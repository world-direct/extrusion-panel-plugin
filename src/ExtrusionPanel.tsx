import { PanelProps } from '@grafana/ui';
import { LoadingSpinner } from 'LoadingSpinner';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { PureComponent, CSSProperties } from 'react';
import GraphPanel from './GraphPanel';
import MapPanel from './MapPanel';
import { GeoJsonDataState, Metric, Options } from './types';
import { AbsoluteTimeRange } from '@grafana/data';

const leftContainerStyle: CSSProperties = {
  width: '50%',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: '50%',
};

const rightContainerStyle: CSSProperties = {
  width: '50%',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: '50%',
};

class ExtrusionPanel extends PureComponent<PanelProps<Options>, GeoJsonDataState> {
  readonly state: GeoJsonDataState = {
    isLoading: false,
    mapJson: {},
    graphJson: {},
    viewOptions: {},
    colorSchemes: [],
    metric: Metric.ParticulateMatter10,
  };

  getMetricOptions(): Metric[] {
    const options = new Array<Metric>();
    for (const metric in Metric) {
      options.push((Metric[metric] as unknown) as Metric);
    }
    return options;
  }

  onMetricChange = (item: Metric) => {
    const { getMapData, getGraphData } = this;
    const { showMap, showGraph } = this.props.options;

    this.setState({ metric: item });
    if (showMap) {
      getMapData();
    }
    if (showGraph) {
      getGraphData();
    }
  };

  componentDidUpdate(prevProps: PanelProps<Options>) {
    const { getMapData, getGraphData } = this;

    if (
      this.props.options.apiUser !== prevProps.options.apiUser ||
      this.props.options.apiPassword !== prevProps.options.apiPassword ||
      this.props.timeRange.from.unix() !== prevProps.timeRange.from.unix() ||
      this.props.timeRange.to.unix() !== prevProps.timeRange.to.unix() ||
      this.props.options.longitude !== prevProps.options.longitude ||
      this.props.options.latitude !== prevProps.options.latitude
    ) {
      getMapData();
      getGraphData();
    } else {
      if (this.props.options.apiMapUri !== prevProps.options.apiMapUri) {
        getMapData();
      }

      if (this.props.options.apiGraphUri !== prevProps.options.apiGraphUri) {
        getGraphData();
      }
    }
  }

  componentDidMount() {
    const { getMapData, getGraphData } = this;

    getMapData();
    getGraphData();
  }

  onHorizontalRegionSelected = (from: number, to: number) => {
    const newTimeRange: AbsoluteTimeRange = {
      from: from,
      to: to,
    };

    this.props.onChangeTimeRange(newTimeRange);
  };

  render() {
    const { getMetricOptions, onMetricChange, onHorizontalRegionSelected } = this;
    const { timeRange } = this.props;
    const { accessToken, showGraph, showMap, showLines, showPoints } = this.props.options;
    const { isLoading, colorSchemes, viewOptions, mapJson, graphJson, metric } = this.state;

    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (showMap && showGraph) {
      return (
        <>
          <div style={leftContainerStyle}>
            <MapPanel
              metrics={getMetricOptions()}
              onMetricChange={onMetricChange}
              colorSchemes={colorSchemes}
              viewOptions={viewOptions}
              mapJson={mapJson}
              accessToken={accessToken}
              metric={metric}
              showGraph={showGraph}
            />
          </div>
          <div style={rightContainerStyle}>
            <GraphPanel
              metrics={getMetricOptions()}
              onMetricChange={onMetricChange}
              timeRange={timeRange}
              graphJson={graphJson}
              metric={metric}
              showLines={showLines}
              showPoints={showPoints}
              showMap={showMap}
              onHorizontalRegionSelected={onHorizontalRegionSelected}
            />
          </div>
        </>
      );
    }

    if (showMap) {
      return (
        <MapPanel
          metrics={getMetricOptions()}
          onMetricChange={onMetricChange}
          colorSchemes={colorSchemes}
          viewOptions={viewOptions}
          mapJson={mapJson}
          accessToken={accessToken}
          metric={metric}
          showGraph={showGraph}
        />
      );
    }

    if (showGraph) {
      return (
        <GraphPanel
          metrics={getMetricOptions()}
          onMetricChange={onMetricChange}
          timeRange={timeRange}
          graphJson={graphJson}
          metric={metric}
          showLines={showLines}
          showPoints={showPoints}
          showMap={showMap}
          onHorizontalRegionSelected={onHorizontalRegionSelected}
        />
      );
    }

    return <p>Invalid display option.</p>;
  }

  getMapData = () => {
    const { apiMapUri, apiUser, apiPassword, longitude, latitude } = this.props.options;
    const { metric } = this.state;

    this.setState({ isLoading: true });

    let query = apiMapUri.concat(
      '?metric=' +
        encodeURIComponent(metric.toString()) +
        '&fromUTC=' +
        encodeURIComponent(this.props.timeRange.from.unix() + '') +
        '&toUTC=' +
        encodeURIComponent(this.props.timeRange.to.unix() + '')
    );

    if (longitude && latitude) {
      query = query.concat(
        '&radius=' + encodeURIComponent(20) + '&longitude=' + encodeURIComponent(longitude + '') + '&latitude=' + encodeURIComponent(latitude + '')
      );
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

  getGraphData = () => {
    const { apiGraphUri, apiUser, apiPassword, longitude, latitude } = this.props.options;
    const { metric } = this.state;

    if (!longitude || !latitude) {
      this.setState({
        graphJson: { values: [] },
      });
      return;
    }

    this.setState({ isLoading: true });

    const query = apiGraphUri.concat(
      '?longitude=' +
        encodeURIComponent(longitude + '') +
        '&latitude=' +
        encodeURIComponent(latitude + '') +
        '&metric=' +
        encodeURIComponent(metric.toString()) +
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
        })
      );
  };
}
export default ExtrusionPanel;
