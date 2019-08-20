import React, { PureComponent, ChangeEvent } from 'react';
import { PanelEditorProps, PanelOptionsGrid, PanelOptionsGroup, FormField } from '@grafana/ui';
import { Options } from './types';

export class ExtrusionPanelEditor extends PureComponent<PanelEditorProps<Options>> {
  constructor(props: PanelEditorProps<Options>) {
    super(props);
  }

  onAccessTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      accessToken: event.target.value,
    });
  };

  onApiUriChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      apiUri: event.target.value,
    });
  };

  render() {
    const { options } = this.props;
    const { accessToken, apiUri } = options;

    return (
      <PanelOptionsGrid>
        <PanelOptionsGroup title="Mapbox credentials">
          <div className="gf-form">
            <FormField label={'Access token'} labelWidth={10} inputWidth={30} onChange={this.onAccessTokenChange} value={accessToken} />
          </div>
        </PanelOptionsGroup>
        <PanelOptionsGroup title="JSON REST API">
          <div className="gf-form">
            <FormField label={'Root-Uri'} labelWidth={10} inputWidth={30} onChange={this.onApiUriChange} value={apiUri} />
          </div>
        </PanelOptionsGroup>
      </PanelOptionsGrid>
    );
  }
}
