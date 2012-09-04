// node test/example/server --static true
process.env.TOWER_ROOT = __dirname;

require("coffee-script");
require("../../lib/tower");

Tower.View.engine = "coffee"
Tower.View.store().loadPaths = ["test/example/app/templates"]

Tower.watch = false

Tower.run(process.argv);
