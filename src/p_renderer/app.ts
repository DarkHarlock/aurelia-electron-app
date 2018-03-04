import { Router, RouterConfiguration } from 'aurelia-router';
import { autoinject, inject } from 'aurelia-dependency-injection';
import { WebAPI } from './web-api';
import * as Electron from 'electron';

export class App { 
  router: Router; 

  constructor(
    @inject public api: WebAPI, //used by loader indicater
    @inject(Electron.ipcRenderer) readonly ipcRenderer: Electron.IpcRenderer
  ) {
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia';
    config.map([
      { route: '', redirect: '/contacts' },
      { route: '/contacts', moduleId: 'p_renderer/contacts/index', nav: true, title: 'Contacts' },
      { route: '/nodejs', moduleId: 'p_renderer/nodejs', nav: true, title: 'Node JS' },
      { route: '/background', moduleId: 'p_renderer/background', nav: true, title: 'Background jobs' },
      { route: '/about', moduleId: 'p_renderer/about', nav: true, title: 'About' }
    ]);

    this.router = router;

    this.ipcRenderer.on('show-contact', (event, id) => {
      this.router.navigate(`/contacts/details/${id}`);
    })
  }
}
