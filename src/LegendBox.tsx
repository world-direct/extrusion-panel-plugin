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

  renderColorRange(colorRange: ColorRange) {
    const colorStyle: CSSProperties = {
      color: '#000',
      backgroundColor: colorRange.color,
      marginBottom: 0,
      borderBottom: '1px dotted #000',
    };

    return (
      <p style={colorStyle}>
        <span>{colorRange.fromInclusive}</span> - <span>{colorRange.toExclusive}</span>
      </p>
    );
  }

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
