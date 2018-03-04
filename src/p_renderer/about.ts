import { ipcRenderer } from 'electron';
import { autoinject } from 'aurelia-framework';
import Greetings from '../shared/greetings';

@autoinject()
export class About {
  constructor(
    private greetings: Greetings
  ) {
  }
  message = "";
  process = process;
  mainMessage = "";

  attached() {
    this.message = this.greetings.sayHello('Renderer process');

    ipcRenderer.on('hello', (_, arg) => {
      this.mainMessage = arg;
    });
    ipcRenderer.send('say-hello');
  }
}
