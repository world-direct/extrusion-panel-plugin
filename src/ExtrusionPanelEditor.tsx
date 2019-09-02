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

  onApiUserChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      apiUser: event.target.value,
    });
  };

  onApiPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      apiPassword: event.target.value,
    });
  };

  render() {
    const { options } = this.props;
    const { accessToken, apiUri, apiUser, apiPassword } = options;

    return (
      <PanelOptionsGrid>
        <PanelOptionsGroup title="JSON REST API">
          <div className="gf-form">
            <FormField label={'Root-Uri'} labelWidth={20} inputWidth={30} onChange={this.onApiUriChange} value={apiUri} />
          </div>
          <div className="gf-form">
            <FormField label={'Basic-Authentication-User'} labelWidth={20} inputWidth={30} onChange={this.onApiUserChange} value={apiUser} />
          </div>
          <div className="gf-form">
            <FormField
              label={'Basic-Authentication-Password'}
              labelWidth={20}
              inputWidth={30}
              onChange={this.onApiPasswordChange}
              value={apiPassword}
            />
          </div>
        </PanelOptionsGroup>
        <PanelOptionsGroup title="Mapbox credentials">
          <div className="gf-form">
            <FormField label={'Access token'} labelWidth={20} inputWidth={30} onChange={this.onAccessTokenChange} value={accessToken} />
          </div>
        </PanelOptionsGroup>
      </PanelOptionsGrid>
    );
  }
}
