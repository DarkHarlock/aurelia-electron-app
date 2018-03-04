import * as Electron from "electron";
import { inject, factory } from "aurelia-dependency-injection";
import { requireTaskPool } from 'electron-remote';

export var requireResolve = require.resolve;
type CreateWindow = (opt: Electron.BrowserWindowConstructorOptions) => Electron.BrowserWindow;

export class WindowTracker {
  private _mainWindow: Electron.BrowserWindow;

  constructor(
    @factory(Electron.BrowserWindow) private readonly createWindow: CreateWindow,
    @inject(Electron.ipcMain) ipcMain: Electron.IpcMain,
    @inject(requireResolve) requireResolve: RequireResolve,
    @inject(requireTaskPool) taskPool: any
  ) {
    const work: () => Promise<void> = taskPool(
      requireResolve('./../p_background/useless-heavy-work')
    ).work;

    ipcMain.on('background-job-start', async (event, id) => {
      try {
        event.sender.send('background-job-queued' + id);
        var result = await work()
        event.sender.send('background-job-finished' + id);
      } catch (e) {
        event.sender.send('background-job-error' + id, e);
      }
    });
  }

  get mainWindow() { return this._mainWindow; }

  createMainWindow(url: string): boolean {
    if (this._mainWindow) {
      return false;
    }

    // Create the browser window.
    this._mainWindow = this.createWindow({
      height: 600,
      width: 1000,
    });

    this._mainWindow.loadURL(url);
    // Emitted when the window is closed.
    this._mainWindow.on("closed", () => {
      // Dereference the window object, usually you would store windows
      // in an array if your app supports multi windows, this is the time
      // when you should delete the corresponding element.
      this._mainWindow = null;
    });
    return true;
  }
}
