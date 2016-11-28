'use strict';

const co = require('co');
const fsp = require('fs-promise');
const FileEncodingDetector = require('./fileEncodingDetector');
const AtomIdAppender = require('./atomIdAppender');
const iconv = require('iconv-lite');

exports.validate = co.wrap(function* validate(filePath, path) {
  try {
    // Read the input diff file into a buffer
    let outputFileBuffer = yield fsp.readFile(filePath);
    let outputFileDecoded = iconv.decode(outputFileBuffer, 'utf-8');

    let AtomIdAppenderInstance = new AtomIdAppender();
    let newFileContents = yield AtomIdAppenderInstance.addAssignmentIds(
        filePath, outputFileDecoded, path);

  } catch (error) {
    /* eslint-disable no-console */
    console.log(error.stack);
    /* eslint-enable no-console */
  }
});

exports.updateSyllabus = co.wrap(function* updateSyllabus(filePath, option) {
  try {
    let FileEncodingDetectorInstance = new FileEncodingDetector();
    let AtomIdAppenderInstance = new AtomIdAppender();

    // Read the input diff file into a buffer
    let outputFileBuffer = yield fsp.readFile(filePath);

    let fileContentsDecoded = FileEncodingDetectorInstance.detectAndRead('<',
      outputFileBuffer);

    // Add atomId attribute to assignment elements
    let newFileContents;
    if (option === 'duplicateId') {
      newFileContents = yield AtomIdAppenderInstance.addDuplicateAssignmentId(
      filePath, fileContentsDecoded.fileContents, option);
    } else {
      newFileContents = yield AtomIdAppenderInstance.addMalformAssignmentId(
      filePath, fileContentsDecoded.fileContents, option);
    }
    yield fsp.writeFile(filePath, newFileContents,
      { encoding: fileContentsDecoded.encodingType });
  } catch (error) {
    /* eslint-disable no-console */
    console.log(error.stack);
    /* eslint-enable no-console */
    process.exit(1);
  }
});

