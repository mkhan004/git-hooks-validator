'use strict';
const Dom = require('xmldom').DOMParser;
const xpath = require('xpath');
var clc = require('cli-color');
const validate = require('uuid-validate');

const atomAssignmentIdAttributeName = 'atomId';

class AtomIdAppender {

  addAssignmentIds(filePath, fileContents, path) {
    let doc;
    let parseError;


    return new Promise((resolve, reject) => {
      doc = new Dom({
        locator: {},
        errorHandler: {
          warning: (error) => {
            parseError = error;
          },
          error: (error) => {
            parseError = error;
          },
          fatalEror: (error) => {
            parseError = error;
          }
        }
      }).parseFromString(fileContents);

      if (parseError) {
        throw new Error(parseError);
      }

      let existingAtomAssignmentIds = [];
      const select = xpath.useNamespaces({ xsi: 'http://www.w3.org/2001/XMLSchema-instance' });
      const assignmentNodes = select('//assignment', doc);
      console.log(clc.yellow(`\nTest: ${filePath}`));
      assignmentNodes.forEach(assignmentNode => {
        let atomAssignmentIdAttribute = assignmentNode.getAttribute(atomAssignmentIdAttributeName);

        if (atomAssignmentIdAttribute) {
          if(existingAtomAssignmentIds.indexOf(atomAssignmentIdAttribute) < 0) {
            existingAtomAssignmentIds.push(atomAssignmentIdAttribute);

            let parts = atomAssignmentIdAttribute.split('/');
            let uuid = parts[parts.length-1];
            let pathPrefix = atomAssignmentIdAttribute.replace('/' + uuid, '');

            if (pathPrefix === path) {
              if (validate(uuid)) {
                console.log(clc.green(`\t√ pass: valid pathPrefix \n\t\t√ pass: valid uuid`));
              } else {
                console.log(clc.green(`\t√ pass: valid pathPrefix`), clc.redBright(`\n\t\tx failed: invalid uuid ${uuid}`));
              }
            } else {
              if (validate(uuid)) {
                console.log(clc.redBright(`\tx failed: invalid pathPrefix actual '${pathPrefix}' expected '${path}'`), clc.green(`\n\t\t√ pass: valid uuid`));
              } else {
                console.log(clc.redBright(`\tx failed: invalid pathPrefix ${pathPrefix} \n\t\tx failed: invalid uuid ${uuid}`));
              }
            }
          } else {
            console.log(clc.redBright(`\tx failed: duplicate assignment id ${atomAssignmentIdAttribute}`));
          }

        } else {
          console.log(clc.redBright(`\tx failed: atomId does not Exist`));
        }
      });

      resolve(doc.toString());
    });
  }

  addMalformAssignmentId(filePath, fileContents, option) {
    let doc;
    let parseError;

    return new Promise((resolve, reject) => {
      doc = new Dom({
        locator: {},
        errorHandler: {
          warning: (error) => {
            parseError = error;
          },
          error: (error) => {
            parseError = error;
          },
          fatalEror: (error) => {
            parseError = error;
          }
        }
      }).parseFromString(fileContents);


      if (parseError) {
        throw new Error(parseError);
      }

      const select = xpath.useNamespaces({ xsi: 'http://www.w3.org/2001/XMLSchema-instance' });
      const assignmentNodes = select('//assignment', doc);
      let existingAtomAssignmentIds = [];
      assignmentNodes.forEach(assignmentNode => {
        let atomAssignmentIdAttribute = assignmentNode.getAttribute(atomAssignmentIdAttributeName);
        if (option === 'malformUuid') {
          this._malformUuid(assignmentNode, atomAssignmentIdAttribute);
        } else if (option === 'malformPath') {
          this._malformPathPrefix(assignmentNode, atomAssignmentIdAttribute);
        }
      });
    resolve(doc.toString());
    });
  }

  addDuplicateAssignmentId(filePath, fileContents, option) {
    let doc;
    let parseError;

    return new Promise((resolve, reject) => {
      doc = new Dom({
        locator: {},
        errorHandler: {
          warning: (error) => {
            parseError = error;
          },
          error: (error) => {
            parseError = error;
          },
          fatalEror: (error) => {
            parseError = error;
          }
        }
      }).parseFromString(fileContents);


      if (parseError) {
        throw new Error(parseError);
      }

      const select = xpath.useNamespaces({ xsi: 'http://www.w3.org/2001/XMLSchema-instance' });
      const assignmentNodes = select('//assignment', doc);
      // console.log(assignmentNodes.length);
      let existingAtomAssignmentIds = [];
      let atomAssignmentIdAttribute = assignmentNodes[0].getAttribute(atomAssignmentIdAttributeName);
      assignmentNodes.forEach(assignmentNode => {
        if (option === 'duplicateId') {
          this._duplicateAssignmentId(assignmentNode, atomAssignmentIdAttribute);
        }
      });
    resolve(doc.toString());
    });
  }

  _duplicateAssignmentId(node, oldAssignmentId) {
    node.setAttribute(atomAssignmentIdAttributeName, oldAssignmentId);
  }

  _malformUuid(node, oldAssignmentId) {
    let uuidData = `malformedAssignmentId`;
    let newAssignmentId = `${oldAssignmentId}` + `${uuidData}`;
    node.setAttribute(atomAssignmentIdAttributeName, newAssignmentId);
  }

  _malformPathPrefix(node, oldAssignmentId) {
    let uuidData = `malformedAssignmentPathPrefix`;
    let newAssignmentId = `${uuidData}` + `${oldAssignmentId}`;
    node.setAttribute(atomAssignmentIdAttributeName, newAssignmentId);
  }
}

module.exports = AtomIdAppender;
