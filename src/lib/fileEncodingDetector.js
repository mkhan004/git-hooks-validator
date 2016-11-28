'use strict';

const iconv = require('iconv-lite');
const supportedEncodings = ['ucs2', 'utf8', 'utf-8'];

class FileEncodingDetector {

  detectAndRead(startsWithText, buffer) {
    // Loop through each type of supported encoding and decode the buffer
    // to see if we can match the start of the content
    for (const encoding of supportedEncodings) {
      let fileContents = iconv.decode(buffer, encoding);

      // In the case of the diff file, the file contents could start with
      // A or M (added or modified), so we support an array input here to
      // check for multiple cases
      if (startsWithText.constructor === Array) {
        for (const startsWithTextOption of startsWithText) {
          if (fileContents.startsWith(startsWithTextOption)) {
            return {
              fileContents: fileContents,
              encodingType: encoding
            };
          }
        }
      } else {
        if (fileContents.startsWith(startsWithText)) {
          return {
            fileContents: fileContents,
            encodingType: encoding
          };
        }
      }
    }

    // If we can't match the start of the content, then we throw an error
    // assuming it was encoded in an unsupported format. There is no easy
    // way to detect the encoding type, so this should be sufficient for now.
    throw new Error('Could not detect format of buffer');
  }
}

module.exports = FileEncodingDetector;
