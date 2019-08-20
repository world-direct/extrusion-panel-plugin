import { PanelPlugin } from '@grafana/ui';
import { defaults } from './types';
import { ExtrusionPanel } from './ExtrusionPanel';
import { ExtrusionPanelEditor } from './ExtrusionPanelEditor';

export const plugin = new PanelPlugin(ExtrusionPanel).setDefaults(defaults).setEditor(ExtrusionPanelEditor);
