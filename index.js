var path = require('path');
require('coffee-script');

if (path.existsSync('./lib/tower.js'))
  module.exports = require('./lib/tower.js');
else
  module.exports = require('./packages/tower.coffee');
