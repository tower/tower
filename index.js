var path = require('path');
require('coffee-script');
if (path.existsSync('./lib/tower.js'))
  require('./lib/tower.js');
else
  require('./src/tower.coffee');