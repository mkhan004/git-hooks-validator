'use strict';

const fs = require('fs');
const path = require('path');
const ext = require('extfs');

class TestDataHelper {

  getFiles(dir, files_) {
    files_ = files_ || [];
    let files = fs.readdirSync(dir);
    for (let index in files) {
      if (files.hasOwnProperty(index)) {
        let name = dir + '/' + files[index];
        if (fs.statSync(name).isDirectory()) {
          this.getFiles(name, files_);
          if (ext.isEmptySync(name)) {
            // files_.push(name.substr(2));
          }
        } else {
          if (path.extname(files[index]) === '.ditamap') {
            files_.push(name);
          }
        }
      }
    }
    return files_;
  }
}

module.exports = TestDataHelper;
