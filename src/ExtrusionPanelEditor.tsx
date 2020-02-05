import { FormField, PanelEditorProps, PanelOptionsGrid, PanelOptionsGroup } from '@grafana/ui';
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

  onRadiusChange = (event: ChangeEvent<HTMLInputElement>) => {
    let radius = Number(event.target.value);
    if (radius > 200) {
      radius = 20;
    }

    this.props.onOptionsChange({
      ...this.props.options,
      radius: radius,
    });
  };

  onLongitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      longitude: Number(event.target.value),
    });
  };

  onLatitudeChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      latitude: Number(event.target.value),
    });
  };

  onSerialChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      serial: event.target.value,
    });
  };

  render() {
    const {
      onApiMapUriChange,
      onApiUserChange,
      onApiPasswordChange,
      onAccessTokenChange,
      onRadiusChange,
      onLongitudeChange,
      onLatitudeChange,
      onSerialChange,
    } = this;
    const { options } = this.props;
    const { accessToken, apiMapUri, apiUser, apiPassword, radius, longitude, latitude, serial } = options;

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
          <div className="gf-form">
            <FormField label="Radius" onChange={onRadiusChange} value={radius} />
          </div>
          <div className="gf-form">
            <FormField label="Longitude" onChange={onLongitudeChange} value={longitude} />
          </div>
          <div className="gf-form">
            <FormField label="Latitude" onChange={onLatitudeChange} value={latitude} />
          </div>
          <div className="gf-form">
            <FormField label="Serial" onChange={onSerialChange} value={serial} />
          </div>
        </PanelOptionsGroup>
        <PanelOptionsGroup title="Mapbox credentials">
          <div className="gf-form">
            <FormField label={'Access token'} labelWidth={20} inputWidth={30} onChange={onAccessTokenChange} value={accessToken} />
          </div>
        </PanelOptionsGroup>
      </PanelOptionsGrid>
    );
  }
}
export default ExtrusionPanelEditor;
