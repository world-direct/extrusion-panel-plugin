import { TimeRange } from '@grafana/data';
import { Graph, GraphSeriesValue, GraphSeriesXY } from '@grafana/ui';
import React, { CSSProperties } from 'react';
import { ExtrusionSelect } from './ExtrusionSelect';
import { LocationSelect } from './LocationSelect';
import { Metric, VirtualLocation } from './types';

const metricSelectStyle: CSSProperties = {
  width: 200,
  opacity: 0.8,
  position: 'absolute',
  top: 2,
  left: 2,
  zIndex: 1,
  boxShadow: '2px 2px #888',
};

const locationSelectStyles: CSSProperties = {
  width: 200,
  opacity: 0.8,
  position: 'absolute',
  top: 2,
  right: 6,
  zIndex: 1,
  boxShadow: '2px 2px #888',
};

const containerStyle: CSSProperties = {
  position: 'absolute',
  top: 50,
  bottom: 0,
  left: 0,
  width: '100%',
  padding: '4px',
};

type Props = Readonly<{
  metrics: Metric[];
  onMetricChange: (item: Metric) => void;
  onLocationChange: (item: VirtualLocation) => void;
  timeRange: TimeRange;
  locations: VirtualLocation[];
  graphJson: object;
  metric: Metric;
  location: VirtualLocation;
}>;

class GraphPanel extends React.Component<Props> {
  getLocationOptions = () => {
    const { locations } = this.props;

    const options = new Array<VirtualLocation>();

    options.push({});
    locations.forEach(location => {
      options.push(location);
    });

    return options;
  };

  getSeries = () => {
    const { graphJson, metric } = this.props;

    const data: GraphSeriesValue[][] = [];
    const anyGraphJson = graphJson as any;

    console.log(anyGraphJson);

    // TODO!
    if (anyGraphJson && Array.isArray(anyGraphJson.values)) {
      anyGraphJson.values.forEach((value: { value?: number; timestamp?: number }) => {
        if (value.value && value.timestamp) {
          data.push([value.timestamp, value.value]);
        }
      });
    }

    const series: GraphSeriesXY[] = [
      {
        label: (metric as unknown) as string,
        data: data,
        color: '#7EB26D',
        info: [{ title: 'min', text: '0', numeric: 0.0 }, { title: 'max', text: '200', numeric: 200.0 }],
        isVisible: true,
        yAxis: 1,
      },
    ];

    console.log(series);
    return series;
  };

  onMetricChange = (item: Metric) => {
    const { onMetricChange } = this.props;

    onMetricChange(item);
  };

  onLocationChange = (item: VirtualLocation) => {
    const { onLocationChange } = this.props;

    onLocationChange(item);
  };

  render() {
    const { getLocationOptions, onMetricChange, onLocationChange } = this;
    const { metrics, timeRange, metric, location } = this.props;

    return (
      <div>
        <ExtrusionSelect<Metric> options={metrics} style={metricSelectStyle} onChange={onMetricChange} value={metric} />
        <div style={containerStyle}>
          <Graph series={this.getSeries()} timeRange={timeRange} width={100} height={100} />
        </div>
        <LocationSelect options={getLocationOptions()} style={locationSelectStyles} onChange={onLocationChange} value={location} />
      </div>
    );
  }
}
export default GraphPanel;
