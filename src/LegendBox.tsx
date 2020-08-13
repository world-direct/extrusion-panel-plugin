import React, { Component, CSSProperties } from 'react';
import { ColorRange, ColorScheme, Styles } from './types';

const classes: Styles = {
  container: {
    zIndex: 1,
    position: 'absolute',
    bottom: 20,
    right: 0,
    width: 137,
    background: '#fff',
    padding: 4,
    opacity: 0.8,
  },
  infinity: {
    position: 'relative',
    top: 1,
  },
};

type Props = {
  classes: Styles;
  colorScheme?: ColorScheme;
  metric?: string;
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
    const { classes } = this.props;

    const color = colorRange.color ? colorRange.color : '#fff';

    const colorStyle: CSSProperties = {
      color: isTooDark(color) ? '#fff' : '#000',
      backgroundColor: color,
      marginBottom: 3,
      padding: '0 2px',
      textShadow: '1px 1px #888',
      boxShadow: '2px 2px #888',
    };
    return (
      <p style={colorStyle}>
        {colorRange.fromInclusive !== null ? colorRange.fromInclusive : <span style={classes['infinity']}>&infin;</span>} -{' '}
        {colorRange.toExclusive !== null ? colorRange.toExclusive : <span style={classes['infinity']}>&infin;</span>}
      </p>
    );
  };

  render() {
    const { renderColorRange } = this;
    const { colorScheme, metric, classes } = this.props;

    const titleStyle: CSSProperties = {
      color: '#000',
      marginBottom: 3,
      padding: '0 2px',
    };

    return (
      <div id="container" style={classes['container']}>
        {!colorScheme && <p>No color scheme received.</p>}
        {colorScheme && (
          <>
            {metric && <p style={titleStyle}>{metric}</p>}
            {colorScheme.colorRangeItems.map(c => {
              return renderColorRange(c);
            })}
          </>
        )}
      </div>
    );
  }
}
