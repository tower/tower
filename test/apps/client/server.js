require("coffee-script");
require("../../../lib/tower")

Tower.root = process.cwd() + '/test/apps/client'
Tower.publicPath    = Tower.root + "/public"
Tower.View.engine = "coffee"
Tower.View.store().loadPaths = ["test/apps/client/app/views"]

Tower.watch = false

Tower.run(process.argv);
