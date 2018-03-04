import * as fs from 'fs';

export class NodeJs {
  constructor(
  ) {
  }
  files = [];

  attached() {
    fs.readdir(".", (err, f) => {
      this.files = f;
    })
  }
}
