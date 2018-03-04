import { RouterConfiguration, Router } from "aurelia-router";

export class Contacts {
  router: Router;

  constructor(
  ) {
  }
  configureRouter(config: RouterConfiguration, router: Router) {
    config.map([
      { route: '', moduleId: 'p_renderer/contacts/no-selection', title: 'Select' },
      { route: 'details/:id', moduleId: 'p_renderer/contacts/contact-detail', name: 'contacts' }
    ]);
    this.router = router;
  }
}
