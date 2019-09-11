import React, { Component } from 'react';
import { Styles } from './types';

const classes: Styles = {
  container: {
    height: '100%',
  },
  spinner: {
    fontSize: 80,
    position: 'absolute',
    margin: 'auto',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 68,
    height: 68,
  },
};

type Props = {
  classes: Styles;
};

type State = {
  show: boolean;
};

export class LoadingSpinner extends Component<Props, State> {
  static defaultProps = {
    classes: classes,
  };

  readonly state: State = {
    show: true,
  };

  render() {
    return (
      <div style={classes['container']}>
        <i className="fa fa-cog fa-spin" style={classes['spinner']} />
      </div>
    );
  }
}
