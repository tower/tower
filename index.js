var path = require('path');
require('coffee-script');

var root = path.join(__dirname, 'lib/tower.js');

if (path.existsSync(root))
  module.exports = require(root);
else
  module.exports = require(path.join(__dirname, 'packages/tower.coffee'));
