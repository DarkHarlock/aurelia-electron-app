import { ipcRenderer } from 'electron';

export class Background {
  readonly nextId = (() => { let count = 0; return () => count++; })();

  constructor(
  ) {
  }
  processes = [];

  startJob() {
    const id = this.nextId();
    ipcRenderer.on('background-job-queued' + id, (event) => {
      this.processes.unshift({ id, status: 'running' });
      ipcRenderer.on('background-job-finished' + id, () => {
        this.processes.splice(this.processes.findIndex(x => x.id === id), 1);
      });
      ipcRenderer.on('background-job-error' + id, (event, error) => {
        this.processes.find(x => x.id === id)[0].status = error.message;
      });
    })
    ipcRenderer.send('background-job-start', id);

  }
}
