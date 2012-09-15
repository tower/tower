// node test/example/server --static true
process.env.TOWER_ROOT = __dirname;

require("coffee-script");
require("../..");

Tower.View.engine = "coffee"
// must run `node server` relative to this test/example folder
Tower.View.store().loadPaths = ["app/templates/shared", "app/templates/server"]

Tower.watch = false

Tower.run(process.argv);
