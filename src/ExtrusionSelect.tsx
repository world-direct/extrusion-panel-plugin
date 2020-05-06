import { SelectableValue } from '@grafana/data';
import { Select } from '@grafana/ui';
import React, { Component, CSSProperties } from 'react';

type Props<T> = {
  style?: CSSProperties;
  onChange: (item: T) => {} | void;
  options: T[];
  value: T;
};

export class ExtrusionSelect<T> extends Component<Props<T>> {
  componentDidMount() {
    const $style = document.createElement('style');
    if (document && document.head) {
      document.head.appendChild($style);
      $style.innerHTML = '#extrusionSelect .gf-form-input {border-radius: 0;}';
    }
  }

  onChange = (selected: SelectableValue<T>) => {
    const { onChange } = this.props;

    if (selected.value) {
      onChange(selected.value);
    }
  };

  getSelectable(object: any): SelectableValue<T> {
    if (object && object.id && object.name) {
      return { label: object.name, value: object, key: object.id };
    }

    let label = (object as unknown) as string;
    label = label.replace(/([a-z])([A-Z]|[0-9])/g, '$1 $2');

    return { text: label, value: object, key: label };
  }

  getSelectableOptions = (): Array<SelectableValue<T>> => {
    const { getSelectable } = this;
    const { options } = this.props;

    const selectableOptions: Array<SelectableValue<T>> = [];

    options.map(m => {
      selectableOptions.push(getSelectable(m));
    });

    return selectableOptions;
  };

  render() {
    const { onChange, getSelectable, getSelectableOptions } = this;
    const { value, style } = this.props;

    return (
      <div id="extrusionSelect" style={style}>
        <Select value={getSelectable(value)} options={getSelectableOptions()} onChange={onChange} />
      </div>
    );
  }
}
