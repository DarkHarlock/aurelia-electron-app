import { Aurelia } from 'aurelia-framework';
import * as Electron from 'electron';
import environment from '../environment';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('p_renderer/resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }
  console.log(Electron.ipcRenderer);
  // register the Electron.ipcRenderer instance
  aurelia.container.registerInstance(Electron.ipcRenderer);

  aurelia.start().then(() => aurelia.setRoot());
}
