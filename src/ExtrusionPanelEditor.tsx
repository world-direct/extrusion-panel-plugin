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

  onApiGraphUriChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onOptionsChange({
      ...this.props.options,
      apiGraphUri: event.target.value,
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

  onShowMapChange = () => {
    this.props.onOptionsChange({
      ...this.props.options,
      showMap: !this.props.options.showMap,
    });
  };

  onShowGraphChange = () => {
    this.props.onOptionsChange({
      ...this.props.options,
      showGraph: !this.props.options.showGraph,
    });
  };

  onShowLinesChange = () => {
    this.props.onOptionsChange({
      ...this.props.options,
      showLines: !this.props.options.showLines,
    });
  };

  onShowPointsChange = () => {
    this.props.onOptionsChange({
      ...this.props.options,
      showPoints: !this.props.options.showPoints,
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

  render() {
    const {
      onApiMapUriChange,
      onApiGraphUriChange,
      onApiUserChange,
      onApiPasswordChange,
      onAccessTokenChange,
      onShowMapChange,
      onShowGraphChange,
      onShowLinesChange,
      onShowPointsChange,
      onLongitudeChange,
      onLatitudeChange,
    } = this;
    const { options } = this.props;
    const { accessToken, apiMapUri, apiGraphUri, apiUser, apiPassword, showGraph, showMap, showLines, showPoints, longitude, latitude } = options;

    return (
      <PanelOptionsGrid>
        <PanelOptionsGroup title="JSON REST API">
          <div className="gf-form">
            <FormField label={'Map-Data-Uri'} labelWidth={20} inputWidth={30} onChange={onApiMapUriChange} value={apiMapUri} />
          </div>
          <div className="gf-form">
            <FormField label={'Graph-Data-Uri'} labelWidth={20} inputWidth={30} onChange={onApiGraphUriChange} value={apiGraphUri} />
          </div>
          <div className="gf-form">
            <FormField label={'Basic-Authentication-User'} labelWidth={20} inputWidth={30} onChange={onApiUserChange} value={apiUser} />
          </div>
          <div className="gf-form">
            <FormField label={'Basic-Authentication-Password'} labelWidth={20} inputWidth={30} onChange={onApiPasswordChange} value={apiPassword} />
          </div>
          <div className="gf-form">
            <FormField label="Longitude" onChange={onLongitudeChange} value={longitude} />
          </div>
          <div className="gf-form">
            <FormField label="Latitude" onChange={onLatitudeChange} value={latitude} />
          </div>
        </PanelOptionsGroup>
        <PanelOptionsGroup title="Mapbox credentials">
          <div className="gf-form">
            <FormField label={'Access token'} labelWidth={20} inputWidth={30} onChange={onAccessTokenChange} value={accessToken} />
          </div>
        </PanelOptionsGroup>
        <PanelOptionsGroup title="Display options">
          <div className="gf-form">
            <Switch label="Show map" checked={showMap} onChange={onShowMapChange} />
          </div>
          <div className="gf-form">
            <Switch label="Show graph" checked={showGraph} onChange={onShowGraphChange} />
          </div>
          <div className="gf-form">
            <Switch label="Show lines" checked={showLines} onChange={onShowLinesChange} />
          </div>
          <div className="gf-form">
            <Switch label="Show points" checked={showPoints} onChange={onShowPointsChange} />
          </div>
        </PanelOptionsGroup>
      </PanelOptionsGrid>
    );
  }
}
export default ExtrusionPanelEditor;
