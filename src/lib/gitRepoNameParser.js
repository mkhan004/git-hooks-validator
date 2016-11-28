'use strict';

class GitRepoNameParser {
  constructor(execSync) {
    this.execSync = execSync;
  }

  getRepoName() {
    let getRemoteCommand = 'git remote -v | grep origin | grep push';
    let remoteCommandOutput = this.execSync(getRemoteCommand).toString().replace(/\n/g, '');
    let repoNameUrlSegments = remoteCommandOutput.split(' ')[0].split('/');
    return repoNameUrlSegments[repoNameUrlSegments.length - 1]
      .replace('-', '/')
      .replace('.git', '');
  }
}
module.exports = GitRepoNameParser;
