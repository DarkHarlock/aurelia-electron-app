# Aurelia Electron Typescript Demo Application

A reference project on how to implement an `Electron` application using `Aurelia` cli.

## Note

At this time it require some changes in the cli pipeline.
This is the reference [repo](https://github.com/DarkHarlock/cli/tree/electron_support) that contains all the changes you need on `aurelia cli` to have this project working.

## Clone and run

```bash
git clone https://github.com/DarkHarlock/aurelia-electron-app.git
cd aurelia-electron-app
npm install
npm install aurelia-cli@github:darkharlock/cli#electron_support
au run
```

## What inside the demo

In the project you can find:

1. a porting of the `contacts` demo application
2. examples on how to use `Ipc` and `native nodejs modules` (fs) from `requirejs` modules
3. usage of `aurelia-dependency-injection` from outside the classic browser example

## The project structure

### Source folder structure

Source files are grouped in:

* `p_main`: here the files that will run in the main (browser) Electron process. No bundling, just plain CommonJs modules.
* `p_renderer`: here the files that will run in the renderer process. All files in this folder will be bundled.
* `p_background`: here the files that will run in the renderer process but does not have UI (background tasks). No bundling, just plain CommonJs modules.
* `shared`: here common utilities that can be referenced by all other scripts/process. No bundling, just plain CommonJs modules.

The `requirejs-node-fix.js` is used as bridge from `node` to `requirejs`.

### The transpile gulp pipeline

Changes in commit [pipe unbundled files](https://github.com/DarkHarlock/cli/tree/pipe_unbundled_files) allow to pipe some additional transformation to all the files that are not managed by the aurelia bundle step.

In this case we have a bundle declared as:

```json
  {
    "name": "p_renderer-app-bundle.js",
    "source": {
      "include": [
        "[**/src/p_renderer/**/*.js]",
        "**/*.{css,html}"
      ]
    }
  }
```

> Note that `js` files are surrounded by `[]` that force the bundle task to not track, and so not include in the bundle, the dependecy files. In this way only source files in `p_renderer` are bundled.

```js
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
```

The last two pipe steps do:

1. adjust the source maps for all the not bundled files
2. copy not bundle file into destination

### The `ignoreNodeBuiltinLibs` flag

This flag is just a shortcut that include all the known builtin nodejs modules as `externalModules`. 

See my [Pull request - add support for external modules](https://github.com/aurelia/cli/pull/814) and [branch](https://github.com/DarkHarlock/cli/tree/ignore_node_builtinlibs)

### The `traceUnbundledFiles` flag

This flag allow to track unbundled files in the loader configuration. In this way when `RequireJs` search for un unblundled module it will search in the `output` folder instead of the `root` folder.

See my [branch](https://github.com/DarkHarlock/cli/tree/trace_unbundled_files)


### The `tsconfig.json`

All files must be transpiled as `umd`. In this way all source files can be referenced both as `requirejs` modules and as `commonjs` modules.

### The `Run` task

This task is changed to provide a comfortable experience during debug.

## Goals of this project

1. Just a single Typescript build pipeline
2. No warning during `Aurelia` build
3. Code shared between main and renderer `Electron` processes
4. All not `CommonJs` and UI (HTML Dom) modules are bundled/verified by the build pipeline. You does not need to import libraries like `jquery` from `node_modules` folder.

## Tests

Work in progress.
