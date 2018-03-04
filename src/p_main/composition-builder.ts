import { Container } from "aurelia-dependency-injection";
import { requireTaskPool } from 'electron-remote';
import { requireResolve } from "./window-tracker";
import * as Electron from "electron";

let container = new Container();
container.registerInstance(Electron.Menu);
container.registerInstance(requireTaskPool);
container.registerInstance(requireResolve);

export default container;
