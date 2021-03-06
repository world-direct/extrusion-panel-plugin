import { PanelPlugin } from '@grafana/data';
import ExtrusionPanel from './ExtrusionPanel';
import ExtrusionPanelEditor from './ExtrusionPanelEditor';
import { defaults } from './types';

export const plugin = new PanelPlugin(ExtrusionPanel).setDefaults(defaults).setEditor(ExtrusionPanelEditor);
//setPanelChangeHandler();
