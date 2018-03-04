import * as gulp from 'gulp';
import * as autoprefixer from 'gulp-autoprefixer';
import * as sourcemaps from 'gulp-sourcemaps';
import * as sass from 'gulp-sass';
import * as project from '../aurelia.json';
import {build} from 'aurelia-cli';

export default function processCSS() {
  return gulp.src(project.cssProcessor.source)
    //.pipe(sourcemaps.init()) //disable by issue: https://github.com/aurelia/cli/issues/796
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(build.bundle());
};
