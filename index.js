var fs = require('fs');
var path = require('path');
// require tower
var root = path.join(__dirname, 'lib/tower.js');
var rootExists = fs.existsSync(root);

// node path resolution was broken before
if (process.platform == 'win32' && process.version <= 'v0.8.5') {
  require('./path')
}

if (!rootExists || process.env.TOWER_COMMAND != 'new') {
  try {
    require('./coffee-inheritance.js');
  } catch (e) {
    //if (process.env.DEBUG)
    console.log(e);
  } 
}


if (rootExists) {
  module.exports = require(root);
} else {
  module.exports = require(path.join(__dirname, 'packages/tower'));
}