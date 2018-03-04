import "reflect-metadata"
import * as Electron from "electron";
import * as path from "path";
import * as url from "url";
import environment from './../environment';
import Greetings from "./../shared/greetings";
import { Container, factory, newInstance, autoinject, inject } from "aurelia-dependency-injection"
import { WindowTracker } from "./window-tracker";
import { MenuManager } from "./menu-manager";
import container from './composition-builder';

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
Electron.app.on("ready", () => {
  var application = container.get(Application) as Application;
  application.activate(Electron.app.getName());

  // Quit when all windows are closed.
  Electron.app.on("window-all-closed", () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      Electron.app.quit();
    }
  });

  Electron.app.on("activate", () => {
    // On OS X it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    application.activate(Electron.app.getName());
  }); 
});
 

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

class Application {
  constructor(
    @inject(Electron.ipcMain) private ipcMain: typeof Electron.ipcMain,
    @inject(WindowTracker) private tracker: WindowTracker,
    @inject(MenuManager) private menuManager: MenuManager,
    @inject(Greetings) private greetings: Greetings
  ) {
    ipcMain.on("say-hello", (event) => {
      const msg = greetings.sayHello("main process");
      event.sender.send('hello', msg);
    })

    ipcMain.on("open-dev-tools", (event) => {
      this.openDevTools();
    }) 
  }

  activate(appName: string) {
    if (this.tracker.createMainWindow(url.format({
      pathname: path.join(__dirname, "../../index.html"),
      protocol: "file:",
      slashes: true,
    }))) {
      this.menuManager.initilize(appName);
    };
  }

  openDevTools() {
    const mainWindow = this.tracker.mainWindow;
    if (mainWindow) {
      mainWindow.webContents.openDevTools();
    }
  }
}
