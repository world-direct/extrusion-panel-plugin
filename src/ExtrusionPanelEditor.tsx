import { FormField, PanelEditorProps, PanelOptionsGrid, PanelOptionsGroup } from '@grafana/ui';
import { ExtrusionSelect } from 'ExtrusionSelect';
import React, { ChangeEvent, PureComponent } from 'react';
import { DisplayOption, Options } from './types';

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

  onDisplayChange = (option: DisplayOption) => {
    this.props.onOptionsChange({
      ...this.props.options,
      display: option,
    });
  };

  getDisplayOptions = () => {
    const options = new Array<DisplayOption>();
    for (const option in DisplayOption) {
      options.push((option as unknown) as DisplayOption);
    }
    return options;
  };

  render() {
    const {
      onApiMapUriChange,
      onApiGraphUriChange,
      onApiUserChange,
      onApiPasswordChange,
      onAccessTokenChange,
      onDisplayChange,
      getDisplayOptions,
    } = this;
    const { options } = this.props;
    const { accessToken, apiMapUri, apiGraphUri, apiUser, apiPassword, display } = options;

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
        </PanelOptionsGroup>
        <PanelOptionsGroup title="Mapbox credentials">
          <div className="gf-form">
            <FormField label={'Access token'} labelWidth={20} inputWidth={30} onChange={onAccessTokenChange} value={accessToken} />
          </div>
        </PanelOptionsGroup>
        <PanelOptionsGroup title="Display options">
          <div className="gf-form">
            <ExtrusionSelect<DisplayOption> options={getDisplayOptions()} onChange={onDisplayChange} value={display} />
          </div>
        </PanelOptionsGroup>
      </PanelOptionsGrid>
    );
  }
}
export default ExtrusionPanelEditor;
