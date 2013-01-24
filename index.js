global._time = new Date;
var fs = require('fs');
var path = require('path');
// require tower
var root = path.join(__dirname, 'packages/tower.js');
var rootExists = fs.existsSync(root);
global.__dir = __dirname;

if (process.cwd() == global.__dir) {
    global.__isApp = false;
} else {
    global.__isApp = true;
}

// node path resolution was broken before
if (process.platform == 'win32' && process.version <= 'v0.8.5') {
  require('./packages/tower-platform/path.js')
}

if (rootExists) {
  module.exports = require(root);
} 