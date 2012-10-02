var fs = require('fs');
var path = require('path');

try {
  require('./coffee-inheritance');
} catch (e) {}

// node path resolution was broken before
if (process.platform == 'win32' && process.version <= 'v0.8.5') {
  require('./path')
}

// require tower
var root = path.join(__dirname, 'lib/tower.js');

if (fs.existsSync(root))
  module.exports = require(root);
else
  module.exports = require(path.join(__dirname, 'packages/tower.coffee'));
