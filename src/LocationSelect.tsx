import { SelectableValue } from '@grafana/data';
import { Select } from '@grafana/ui';
import React, { Component, CSSProperties } from 'react';
import { VirtualLocation } from './types';

type Props = {
  style: CSSProperties;
  onChange: (item: VirtualLocation) => {} | void;
  options: VirtualLocation[];
  value: VirtualLocation;
};

export class LocationSelect extends Component<Props> {
  componentDidMount() {
    const $style = document.createElement('style');
    if (document && document.head) {
      document.head.appendChild($style);
      $style.innerHTML = '#extrusionSelect .gf-form-input {border-radius: 0;}';
    }
  }

  onChange = (selected: SelectableValue<VirtualLocation>) => {
    const { onChange } = this.props;

    if (selected.value) {
      onChange(selected.value);
    }
  };

  getSelectable(object: VirtualLocation): SelectableValue<VirtualLocation> {
    let label = 'None';
    if (object && object.name) {
      label = object.name;
    }
    label = label.replace(/([a-z])([A-Z]|[0-9])/g, '$1 $2');

    return { label: label, value: object, key: label };
  }

  getSelectableOptions = (): Array<SelectableValue<VirtualLocation>> => {
    const { getSelectable } = this;
    const { options } = this.props;

    const selectableOptions: SelectableValue<VirtualLocation>[] = [];

    options.map(m => {
      selectableOptions.push(getSelectable(m));
    });

    return selectableOptions;
  };

  render() {
    const { onChange, getSelectable, getSelectableOptions } = this;
    const { value, style } = this.props;

    return (
      <div id="locationSelect" style={style}>
        <Select value={getSelectable(value)} options={getSelectableOptions()} onChange={onChange} />
      </div>
    );
  }
}
