const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

const Promise = require('bluebird');
const readFilePromise = Promise.promisify(fs.readFile);
var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      throw (err);
    } else {
      fs.writeFile(exports.dataDir + '/' + id + '.txt', text, (err) => {
        if (err) {
          throw ('error writing file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });

  // items[id] = text;
  // callback(null, { id, text });
};

exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      return callback(err);
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filepath = path.join(exports.dataDir, file);
      return readFilePromise(filepath).then((fileData) => {
        return {
          id: id,
          text: fileData.toString()
        };
      });
    });
    Promise.all(data)
      .then((items) => {
        callback(null, items);
      });

  });
  // fs.readdir(exports.dataDir + '/', (err, items) => {
  //   debugger;
  //   items.forEach((text, id) => {

  //     fs.readFile('./' + text, (err, fileData) => {
  //       debugger;
  //       if (err) {
  //         callback(null, 0);
  //       } else {
  //         // return { id: textID, text: text.slice(0, -4) };
  //         callback(null, fileData);
  //         data[text] = fileData;
  //       }
  //     });

  //     // textID = (id + 100001).toString().slice(1);
  //     // let textWeWant = ;
  //     // return { id: textID, text: text.slice(0, -4) };
  //   });
  //   // done();
  //   // callback(null, data);
  // });

  // callback(null, data);
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
