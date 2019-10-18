import { TimeRange, TimeZone, GraphSeriesValue, GraphSeriesXY } from '@grafana/data';
import { Graph, Button } from '@grafana/ui';
import React, { CSSProperties } from 'react';
import { ExtrusionSelect } from './ExtrusionSelect';
import { Metric } from './types';
import moment from 'moment';

const metricSelectStyle: CSSProperties = {
    width: 200,
    opacity: 0.8,
    position: 'absolute',
    top: 6,
    left: 6,
    zIndex: 1,
    boxShadow: '2px 2px #888',
};

const containerStyle: CSSProperties = {
    position: 'absolute',
    top: 50,
    bottom: 0,
    left: 0,
    width: '100%',
    padding: '6px',
};

const exportButtonStyle: CSSProperties = {
    opacity: 0.8,
    position: 'absolute',
    top: 6,
    right: 8,
    zIndex: 1,
};

type Props = Readonly<{
    metrics: Metric[];
    onMetricChange: (item: Metric) => void;
    timeRange: TimeRange;
    graphJson: object;
    metric: Metric;
    showLines: boolean;
    showPoints: boolean;
    showMap: boolean;
    onHorizontalRegionSelected: (from: number, to: number) => void;
}>;

type State = Readonly<{
    timeRange: TimeRange;
}>;

class GraphPanel extends React.Component<Props, State> {
    readonly state: State = {
        timeRange: this.props.timeRange,
    };

    getSeries = () => {
        const { graphJson, metric } = this.props;

        const data: GraphSeriesValue[][] = [];
        const anyGraphJson = graphJson as any;

        console.log(anyGraphJson);

        if (anyGraphJson && Array.isArray(anyGraphJson.values)) {
            anyGraphJson.values.forEach((value: { value?: number; timestamp?: number }) => {
                if (value.value && value.timestamp) {
                    data.push([value.timestamp * 1000, value.value]);
                }
            });
        }

        const series: GraphSeriesXY[] = [
            {
                label: metric.toString(),
                data: data,
                color: '#7EB26D',
                info: [{ title: 'min', text: '0', numeric: 0.0 }, { title: 'max', text: '200', numeric: 200.0 }],
                isVisible: true,
                yAxis: {
                    index: 1, // left === 1
                    min: 0,
                },
            },
        ];

        console.log(series);
        return series;
    };

    onMetricChange = (item: Metric) => {
        const { onMetricChange } = this.props;

        onMetricChange(item);
    };

    onExportClick = () => {
        const { graphJson, metric } = this.props;

        const bytes: BlobPart[] = [];
        const anyGraphJson = graphJson as any;

        bytes.push('value; timestamp\n');
        if (anyGraphJson && Array.isArray(anyGraphJson.values)) {
            anyGraphJson.values.forEach((value: { value?: string; timestamp?: number; latitude?: string; longitude?: string; serial?: string }) => {
                if (value.value && value.timestamp) {
                    bytes.push(
                        String(value.value).replace('.', ',') +
                        '; ' +
                        moment(value.timestamp).format('DD-MM-YYYY hh:mm:ss') +
                        '; ' +
                        String(value.latitude).replace('.', ',') +
                        '; ' +
                        String(value.longitude).replace('.', ',') +
                        '; ' +
                        String(value.serial).replace('.', ',') +
                        '\n'
                    );
                }
            });
        }

        const file = new Blob(bytes, { type: 'text/csv' });
        const fileName: string = 'export_' + metric + '.csv';

        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    render() {
        const { onMetricChange, onExportClick } = this;
        const { metrics, metric, showLines, showPoints, showMap, onHorizontalRegionSelected } = this.props;
        const { timeRange } = this.state;

        const timeZone: TimeZone = 'utc';
        let width = 10 * 100; // ticks = width / 100;
        if (showMap) {
            width /= 2;
        }

        return (
            <div>
                <ExtrusionSelect<Metric> options={metrics} style={metricSelectStyle} onChange={onMetricChange} value={metric} />
                <div style={containerStyle}>
                    <Graph
                        series={this.getSeries()}
                        timeRange={timeRange}
                        width={width}
                        height={100}
                        onHorizontalRegionSelected={onHorizontalRegionSelected}
                        timeZone={timeZone}
                        showLines={showLines}
                        showPoints={showPoints}
                    />
                </div>
                <Button style={exportButtonStyle} onClick={onExportClick}>
                    Export
        </Button>
            </div>
        );
    }
}
export default GraphPanel;
