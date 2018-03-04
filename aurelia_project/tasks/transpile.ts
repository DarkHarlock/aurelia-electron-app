import * as gulp from 'gulp';
import * as changedInPlace from 'gulp-changed-in-place';
import * as plumber from 'gulp-plumber';
import * as sourcemaps from 'gulp-sourcemaps';
import * as notify from 'gulp-notify';
import * as rename from 'gulp-rename';
import * as ts from 'gulp-typescript';
import * as project from '../aurelia.json';
import { CLIOptions, build } from 'aurelia-cli';
import * as Convert from 'aurelia-cli/lib/build/convert-source-map';
import * as eventStream from 'event-stream';
import * as through from 'through2';
import * as filter from 'gulp-filter';
import * as spy from 'gulp-spy';
import * as path from 'path';


function configureEnvironment() {
  let env = CLIOptions.getEnvironment();

  return gulp.src(`aurelia_project/environments/${env}.ts`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(rename('environment.ts'))
    .pipe(gulp.dest(project.paths.root));
}

const typescriptCompiler = ts.createProject('tsconfig.json', {
  typescript: require('typescript')
});

const cache = {};
function buildTypeScript() {
  var dts = gulp.src(project.transpiler.dtsSource);

  var src = gulp.src(project.transpiler.source)
    .pipe(changedInPlace({ firstPass: true, cache }));

  var destinationFolder = path.normalize(path.join(process.cwd(), project.platform.output));
  var sourceFolder = path.normalize(path.join(process.cwd(), project.paths.root));

  return eventStream.merge(dts, src)
    .pipe(plumber({ errorHandler: notify.onError('Error: <%= error.message %>') }))
    .pipe(sourcemaps.init())
    .pipe(typescriptCompiler())
    .pipe(sourcemaps.write({ sourceRoot: "src", addComment: false }))
    .pipe(build.bundle())
    .pipe(sourcemaps.write({
      sourceRoot: (file) => {
        let filePathSrc = path.normalize(file.path);
        let filePathDest = filePathSrc.replace(sourceFolder, destinationFolder);
        let mapSourceRoot = path.relative(
          path.dirname(filePathDest),
          sourceFolder
        );
        let ret = mapSourceRoot.replace(/[\\\/]+/g, '/');;
        return ret;
      }
    }))
    .pipe(gulp.dest(project.platform.output))
}

export default gulp.series(
  configureEnvironment,
  buildTypeScript
);
