# Assets

## Compression

``` coffeescript
Metro = require("metro")

Metro.configure ->
  @assets.path            = "./spec/tmp/assets"
  @assets.css_compressor  = "yui"
  @assets.js_compressor   = "uglifier"
  @assets.js              = ["application.js"]
  @assets.css             = ["application.css", "theme.css"]
  @assets.css_paths       = ["./app/assets/stylesheets"]
  @assets.js_paths        = ["./app/assets/javascripts"]

Metro.Asset.compile()
```

## Manually Compress CSS

``` coffeescript
Metro = require("metro")

css = '''
body {
  background: red;
}
'''
css_compressor = new Metro.Asset.YUICompressor
css_compressor.compress(css)
  # 'body{background:red}'
```

## Manually Compress JavaScript

``` coffeescript
Metro = require("metro")

js = '''
$(document).ready(function() {
  alert("ready!");
});
'''
js_compressor = new Metro.Asset.UglifyJSCompressor
js_compressor.compress(js)
  # '$(document).ready(function(){alert("ready!")})'

```
