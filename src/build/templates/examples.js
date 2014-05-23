'use strict';
var fs = require('fs');

function readFileSync(localpath){
  return fs.readFileSync(__dirname +'/'+localpath, "utf8");
}

module.exports = {
  example:{
    overview: readFileSync('./example.overview.js'),
    bower: {
      amd:    readFileSync('./example.bower.amd.js'),
      global: readFileSync('./example.bower.global.js'),
    },
    component: readFileSync('./example.component.js'),
    node: readFileSync('./example.node.js'),
  },
};
