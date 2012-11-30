if (!process.env.TOWER_ROOT) process.env.TOWER_ROOT = __dirname;

require('tower').run(process.argv);
