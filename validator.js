#!/usr/bin/env node

'use strict';

const co = require('co');
const clc = require('cli-color');
const isGitRepo = require('is-git-repo');
const TestDataHelper = require('./src/lib/testDataHelper');
const uuidTool = require('./src/lib/uuidTool');
const GitRepoNameParser = require('./src/lib/gitRepoNameParser');
const execSync = require('child_process').execSync;

let testDataHelperInstance = new TestDataHelper();
let GitRepoNameParserInstance = new GitRepoNameParser(execSync);

let repoName = GitRepoNameParserInstance.getRepoName();

let workingDir = process.cwd();
let option = process.argv[2];
let repoParts = repoName.split('/');

let repoRootDir;

// if (workingDir.indexOf('-') >= 0) {
//   repoRootDir = workingDir.replace(repoParts[0] + '-' + repoParts[1], '');
// } else {
//   repoRootDir = workingDir.replace(repoName, '');
// }

repoRootDir = workingDir.replace(repoName, '');

isGitRepo(workingDir, function(git) {
  if (git) {
    let files = testDataHelperInstance.getFiles(workingDir);
    (co(function* start() {
  	  for (let file in files) {
        let path = files[file]
          .replace(repoRootDir, '')
          .replace('-', '/')
          .replace('/syllabus.ditamap', '');
        if (option === 'validate') {
          yield uuidTool.validate(files[file], path);
        } else if (
          option === 'malformUuid' ||
          option === 'malformPath' ||
          option === 'duplicateId') {
          yield uuidTool.updateSyllabus(files[file], option);
        } else {
          console.log(clc.red(`Error:'${option}' is invalid command!`));
          process.exit(1);
        }
  	  }
    })).catch(err => {
  	  console.error(`Error: ${err}`);
    });
  } else {
    console.log(clc.red(`Error:'${workingDir}' is not a git repo!`));
    process.exit(1);
  }
});

