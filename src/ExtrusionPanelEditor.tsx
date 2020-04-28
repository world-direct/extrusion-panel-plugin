import { FormField, PanelEditorProps, PanelOptionsGrid, PanelOptionsGroup, Switch } from '@grafana/ui';
import React, { ChangeEvent, PureComponent } from 'react';
import { Options } from './types';

class ExtrusionPanelEditor extends PureComponent<PanelEditorProps<Options>> {
  constructor(props: PanelEditorProps<Options>) {
    super(props);
  }

  onAccessTokenChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      accessToken: event.target.value,
    });
  };

  onApiMapUriChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      apiMapUri: event.target.value,
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

  onShowLocationChange = (event?: React.SyntheticEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      showLocations: !this.props.options.showLocations,
    });
  };

  onFlatMapChange = (event?: React.SyntheticEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      flatMap: !this.props.options.flatMap,
    });
  };

  render() {
    const { onApiMapUriChange, onApiUserChange, onApiPasswordChange, onAccessTokenChange, onShowLocationChange, onFlatMapChange } = this;
    const { options } = this.props;
    const { accessToken, apiMapUri, apiUser, apiPassword, showLocations, flatMap } = options;

    return (
      <PanelOptionsGrid>
        <PanelOptionsGroup title="JSON REST API">
          <div className="gf-form">
            <FormField label={'Map-Data-Uri'} labelWidth={20} inputWidth={30} onChange={onApiMapUriChange} value={apiMapUri} />
          </div>
          <div className="gf-form">
            <FormField label={'Basic-Authentication-User'} labelWidth={20} inputWidth={30} onChange={onApiUserChange} value={apiUser} />
          </div>
          <div className="gf-form">
            <FormField label={'Basic-Authentication-Password'} labelWidth={20} inputWidth={30} onChange={onApiPasswordChange} value={apiPassword} />
          </div>
        </PanelOptionsGroup>
        <PanelOptionsGroup title="Mapbox credentials">
          <div className="gf-form">
            <FormField label={'Access token'} labelWidth={20} inputWidth={30} onChange={onAccessTokenChange} value={accessToken} />
          </div>
        </PanelOptionsGroup>
        <PanelOptionsGroup title="Settings">
          <div className="gf-form">
            <Switch label={'Show locations'} onChange={onShowLocationChange} checked={showLocations} />
          </div>
          <div className="gf-form">
            <Switch label={'Flat map'} onChange={onFlatMapChange} checked={flatMap} />
          </div>
        </PanelOptionsGroup>
      </PanelOptionsGrid>
    );
  }
}
export default ExtrusionPanelEditor;
