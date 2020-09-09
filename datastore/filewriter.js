const fs = require('fs');
const path = require('path');
const sprintf = require('sprintf-js').sprintf;

var counter = 0;

// Private helper functions ////////////////////////////////////////////////////

// Zero padded numbers can only be represented as strings.
// If you don't know what a zero-padded number is, read the
// Wikipedia entry on Leading Zeros and check out some of code links:
// https://www.google.com/search?q=what+is+a+zero+padded+number%3F

const zeroPaddedNumber = (num) => {
  return sprintf('%05d', num);
};

const readFile = (callback) => {
  fs.readFile(exports.counterFile, (err, fileData) => {
    debugger;
    if (err) {
      callback(null, 0);
    } else {
      callback(null, Number(fileData));
    }
  });
};

const writeFile = (count, callback) => {
  var counterString = zeroPaddedNumber(count);
  fs.writeFile(exports.counterFile, counterString, (err) => {
    debugger;
    if (err) {
      throw ('error writing counter');
    } else {
      callback(null, counterString);
    }
  });
};

// Public API - Fix this function //////////////////////////////////////////////

exports.getNextUniqueId = (done = () => {}) => {
  var count = null;
  readCounter((err, counter) => {
    if (err) {
      console.log(err);
    } else {
      writeCounter(++counter, (err, counterString) => {
        if (err) {
          console.log(err);
        }
        count = counterString;
        done(err, count);
      });
    }
  });
  return count;
};

// exports.getNextUniqueId = () => {
//   counter = counter + 1;
//   return zeroPaddedNumber(counter);
// };



// Configuration -- DO NOT MODIFY //////////////////////////////////////////////

exports.counterFile = path.join(__dirname, 'counter.txt');
