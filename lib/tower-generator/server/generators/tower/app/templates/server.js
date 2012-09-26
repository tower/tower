if (!process.env.TOWER_ROOT) process.env.TOWER_ROOT = __dirname;

require('coffee-script');
require('tower').run(process.argv);
