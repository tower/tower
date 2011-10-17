var Metro = require("metro");
require("coffee-script");

Metro.root = process.cwd();
Metro.Views.load_paths =  [Metro.root + "/app/views"]
Metro.env  = "development";
Metro.port = process.env.PORT || 1597;

Metro.Views.pretty_print = true

Metro.Application.bootstrap();
Metro.Application.run();
