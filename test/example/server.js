// node test/example/server --static true

require("coffee-script");
require("../../lib/tower")

Tower.root = process.cwd() + '/test/example'
Tower.publicPath    = Tower.root + "/public"
Tower.View.engine = "coffee"
Tower.View.store().loadPaths = ["test/example/app/views"]

Tower.watch = false

Tower.run(process.argv);
