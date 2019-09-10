import React, { Component, CSSProperties } from 'react';
import 'react-dropdown/style.css';
import { Styles, ColorScheme, ColorRange } from './types';
import 'mapbox-gl/dist/mapbox-gl.css';

const classes: Styles = {
  container: {
    zIndex: 1,
    position: 'absolute',
    bottom: 20,
    right: 0,
    width: 100,
    background: '#fff',
    padding: 4,
    opacity: 0.8,
  },
};

type Props = {
  classes: Styles;
  colorScheme?: ColorScheme;
};

type State = {
  show: boolean;
};

export class LegendBox extends Component<Props, State> {
  static defaultProps = {
    classes: classes,
  };

  readonly state: State = {
    show: true,
  };

  // see https://stackoverflow.com/a/46151626
  isTooDark(color: string) {
    const r = parseInt(color.substr(1, 2), 16);
    const g = parseInt(color.substr(3, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq < 85;
  }

  renderColorRange = (colorRange: ColorRange): JSX.Element => {
    const { isTooDark } = this;

    const color = colorRange.color ? colorRange.color : '#fff';

    const colorStyle: CSSProperties = {
      color: isTooDark(color) ? '#fff' : '#000',
      backgroundColor: color,
      marginBottom: 0,
      borderBottom: '1px dotted #000',
      padding: '0 2px',
      textShadow: '1px 1px #888',
    };

    return (
      <p style={colorStyle}>
        <span>{colorRange.fromInclusive || 'NaN'}</span> - <span>{colorRange.toExclusive || 'NaN'}</span>
      </p>
    );
  };

  render() {
    const { renderColorRange } = this;
    const { colorScheme, classes } = this.props;

    return (
      <div id="container" style={classes['container']}>
        {!colorScheme && <p>No color scheme received.</p>}
        {colorScheme &&
          colorScheme.colorRangeItems.map(c => {
            return renderColorRange(c);
          })}
      </div>
    );
  }
}
