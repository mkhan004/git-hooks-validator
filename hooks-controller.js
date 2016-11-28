#!/usr/bin/env node
'use strict';

require('shelljs/global');
var clc = require('cli-color');

let testDir = 'gitHookTestDir';
let biz = 'WAYNENTERPRISES';
let sbu = 'TECHNOLOGY';
let program = 'WEAPONS';
let product = 'MOTHERBOX';

let rootDir = __dirname;
let syllabus = rootDir + '/MotherBox_ClassStartDateNov11';

// Create Test Dir
mkdir(testDir);
cd(testDir);

// clone the repo
echo(clc.yellow('\nStart: Setup'));
exec('git clone https://github.com/mkhan004/WAYNENTERPRISES', {silent:true});

cd(biz);
let bizdir = pwd();

// Install GitHook
let message = exec('curl -fL https://gist.githubusercontent.com/AtomBot/d060cbc061b1a19d80d8efed4037e679/raw/install-studyplan-pre-commit.sh | sh', {silent:true});
// console.log(as);

if (message.stderr.indexOf(`404 Not Found`) >= 0) {
  echo(clc.redBright('\nError: GitHook installation path is invalid', message.stderr));
} else {
  if (message.code !== 0) {
    echo(clc.redBright('\nError: GitHook installation failed', message.stderr));
  } else {
    echo(clc.yellow('\nGitHook installation successful'));
  }
}


// Create dir for sbu, program, product
mkdir(sbu);
cd(sbu);
let sbudir = pwd();

mkdir(program);
cd(program);
let programdir = pwd();

mkdir(product);
cd(product);
let productDir = pwd();

// Copy fresh Syllabus
cp('-R', syllabus, './');

let syllabusDir = productDir + '/MotherBox_ClassStartDateNov11';

// Add new syllabus in git repo
exec('git add --all', {silent:true});
exec('git commit -m "Auto-commit-1"', {silent:true});
cd('..');
cd('..');
cd('..');
echo(clc.yellow('\nGitHook validation for Assignment Id (path and uuid)'));
exec('validator validate', {silent:false});
// exec('git push', {silent:true});

// Validation for Malformed UUID Error message
exec('validator malformUuid', {silent:true});
exec('git add --all', {silent:true});

message = exec('git commit -m "Auto-commit-2"', {silent:true});
// console.log(message)
echo(clc.yellow('\nGitHook validation for malformed UUID Error message'));
if (message.code !== 0) {
  if (message.stderr.indexOf(`must contain a path prefix`) >= 0) {
    echo(clc.green(`\t√ pass: GitHook Successfully throws Error Message for Malformed UUID`));
  } else {
    echo(clc.redBright(`\tx failed: GitHook failed to throws Error Message for Malformed UUID`, message.stderr));
  }
} else {
  echo(clc.redBright('\tx failed: GitHook failed to stop commit for existing Error of Malformed UUID', message.stdout));
}

// Reset previous change in Syllabus
exec('git reset HEAD --hard', {silent:true});
// exec('git stash', {silent:true});

// Validation for Malformed Path Prefix Error message
exec('validator malformPath', {silent:true});
exec('git add --all', {silent:true});

// git checkout

message = exec('git commit -m "Auto-commit-3"', {silent:true});
// console.log(message)
echo(clc.yellow('\nGitHook validation for malformed Path Prefix Error message'));
if (message.code !== 0) {
  if (message.stderr.indexOf(`contains the wrong file path prefix`) >= 0) {
    echo(clc.green(`\t√ pass: GitHook Successfully throws Error Message for Malformed path prefix`));
  } else {
    echo(clc.redBright(`\tx failed: GitHook failed to throws Error Message for Malformed path prefix`, message.stderr));
  }
} else {
  echo(clc.redBright('\tx failed: GitHook failed to stop commit for existing Error of Malformed path prefix', message.stdout));
}

// Reset previous change in Syllabus
exec('git reset HEAD --hard', {silent:true});
// exec('git stash', {silent:true});

// Validation for Duplicate Assignment Id
exec('validator duplicateId', {silent:true});
exec('git add --all', {silent:true});

message = exec('git commit -m "Auto-commit-4"', {silent:true});
// console.log(message)
echo(clc.yellow('\nValidation of duplicate Assignment Id'));
if (message.code !== 0) {
  if (message.stderr.indexOf(`is a duplicate`) >= 0) {
    echo(clc.green(`\t√ pass: GitHook Successfully throws Error Message for duplicate Assignment Id`));
  } else {
    echo(clc.redBright(`\tx failed: GitHook failed to throws Error Message for duplicate Assignment Id`, message.stdout));
  }
} else {
  echo(clc.redBright('\tx failed: GitHook failed to stop commit for existing Error of duplicate Assignment Id', message.stdout));
}

// Remove any existing repo
// rm('-rf', sbu);

// Cleanup repo
// exec('git add --all', {silent:true});
// exec('git commit -m "Auto-commit-5"', {silent:true});
// exec('git push', {silent:true});

// Delete test repo from local machine
echo(clc.yellow('\nStop: Cleanup\n'));
cd(`..`);
cd(`..`);
rm('-rf', testDir);

