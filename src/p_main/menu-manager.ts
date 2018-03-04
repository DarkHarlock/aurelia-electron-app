import * as Electron from "electron";
import { inject, factory } from "aurelia-dependency-injection";
import { ContactMenuItem } from "../shared/contact-menu-item";
import { WindowTracker } from "./window-tracker";


export class MenuManager {
  static createMenu(appName: string): Electron.MenuItemConstructorOptions[] {
    const template: Electron.MenuItemConstructorOptions[] = [
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { role: 'toggledevtools' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        role: 'window',
        submenu: [
          { role: 'minimize' },
          { role: 'close' }
        ]
      },
      {
        id: 'contacts',
        label: 'Contacts',
        submenu: [
        ]
      }
    ]

    if (process.platform === 'darwin') {
      template.unshift({
        label: appName,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services', submenu: [] },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      })

      // Edit menu
      let edit = template[1].submenu as Electron.MenuItemConstructorOptions[];
      edit.push(
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      )

      // Window menu
      template[3].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ]
    }

    return template;
  }

  private pinContainer: Electron.MenuItem;
  private menuTemplate: Electron.MenuItemConstructorOptions[];
  private appName: string;

  constructor(
    @inject(Electron.Menu) private menuStatic: typeof Electron.Menu,
    @inject(WindowTracker) private tracker: WindowTracker,
    @inject(Electron.ipcMain) ipcMain: typeof Electron.ipcMain
  ) {
    ipcMain.on('menu-contacts-pin', (event, contact: ContactMenuItem) => {
      this.pinContact(contact);
    });
  }

  initilize(appName: string) {
    this.appName = appName;
    this.menuTemplate = MenuManager.createMenu(appName);

    const submenu = this.menuTemplate
      .find(x => x.id === 'contacts')
      .submenu as Electron.MenuItemConstructorOptions[];

    submenu.push(
      { type: 'separator', visible: false },
      {
        label: 'Reset', click: () => {
          this.initilize(appName);
        }
      }
    )
    this.loadMenu();
  }

  loadMenu() {
    const appMenu = this.menuStatic.buildFromTemplate(this.menuTemplate);
    this.menuStatic.setApplicationMenu(appMenu);
  }

  pinContact({ id, label }: ContactMenuItem) {
    console.log(label);

    const submenu = this.menuTemplate
      .find(x => x.id === 'contacts')
      .submenu as Electron.MenuItemConstructorOptions[];

    submenu[submenu.length - 2].visible = true;
    
    submenu.unshift({
      label,
      click: () => {
        this.tracker.mainWindow.webContents.send('show-contact', id);
      }
    })

    this.loadMenu();
  }
}
