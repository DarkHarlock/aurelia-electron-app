import * as gulp from 'gulp';
import * as browserSync from 'browser-sync';
import * as historyApiFallback from 'connect-history-api-fallback/lib';
import { CLIOptions } from 'aurelia-cli';
import * as project from '../aurelia.json';
import build from './build';
import watch from './watch';
import { electronAutomation } from 'electron-automation';
import * as debounce from 'debounce';

let electron = electronAutomation();

let serve = gulp.series(
  build,
  async () => {
    await electron.start(process.cwd() + '/scripts/p_main/index');
  }
);

let watchInfo = {
  requireRestart: false,
  requireReload: false,
  requireReloadBg: false
}

let checkReload = (function () {
  var busy = false;
  return debounce(() => {
    if (busy) {
      checkReload();
      return;
    }

    if (!watchInfo.requireRestart && !watchInfo.requireReload && !watchInfo.requireReloadBg) {
      log('Nothing to do...');
      return;
    }
    busy = true;
    const wi = Object.assign({}, watchInfo);

    watchInfo.requireRestart = false;
    watchInfo.requireReload = false;
    watchInfo.requireReloadBg = false;

    if (wi.requireRestart) {
      log('Restarting electron...');
      electron.restart().then(() => {
        busy = false;
      });
    } else if (wi.requireReload){
      log('Reloading electron UI...');
      electron.reloadUI().then(() => {
        busy = false;
      });
    } else {
      log('Reloading electron background...');
      electron.reloadBackground().then(() => {
        busy = false;
      });
    }
  }, 100, true);
})();

let watchBuild = gulp.parallel(
  done => { watch(() => { }); done(); },
  () => gulp.watch(['./scripts/**/*', '!scripts/p_renderer*.*', '!scripts/p_background/**/*'], function (done) { watchInfo.requireRestart = true; checkReload(); done(); }),
  () => gulp.watch(['./scripts/**/*', '!scripts/p_main/**/*', '!scripts/p_background/**/*'], function (done) { watchInfo.requireReload = true; checkReload(); done(); }),
  () => gulp.watch(['./scripts/**/*', '!scripts/p_main/**/*', '!scripts/p_renderer*.*'], function (done) { watchInfo.requireReloadBg = true; checkReload(); done(); })
)

function log(message) {
  console.log(message);
}

let run;

if (CLIOptions.hasFlag('watch')) {
  run = gulp.series(
    serve,
    watchBuild
  );
} else {
  run = serve;
}

export default run;
