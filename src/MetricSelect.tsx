import { Select } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import 'mapbox-gl/dist/mapbox-gl.css';
import React, { Component } from 'react';
import { Metric, Styles } from './types';

const classes: Styles = {
  container: {
    width: 200,
    opacity: 0.8,
    position: 'absolute',
    top: 2,
    left: 2,
    zIndex: 1,
    boxShadow: '2px 2px #888',
  },
};

type Props = {
  classes: Styles;
  onChange: (item: Metric) => {} | void;
  options: Metric[];
  value: Metric;
};

type State = {
  show: boolean;
};

export class MetricSelect extends Component<Props, State> {
  static defaultProps = {
    classes: classes,
  };

  readonly state: State = {
    show: true,
  };

  onMetricChange = (selected: SelectableValue<Metric>) => {
    const { onChange } = this.props;

    if (selected.value) {
      onChange(selected.value);
    }
  };

  getSelectable(metric: Metric): SelectableValue<Metric> {
    return { label: (metric as unknown) as string, value: metric, key: metric };
  }

  getSelectableOptions = (): Array<SelectableValue<Metric>> => {
    const { getSelectable } = this;
    const { options } = this.props;

    const selectableOptions = new Array<SelectableValue<Metric>>();

    options.map(m => {
      selectableOptions.push(getSelectable(m));
    });

    return selectableOptions;
  };

  render() {
    const { onMetricChange, getSelectable, getSelectableOptions } = this;
    const { value } = this.props;

    return (
      <div style={classes['container']}>
        <Select value={getSelectable(value)} options={getSelectableOptions()} onChange={onMetricChange} />
      </div>
    );
  }
}
