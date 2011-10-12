## Compression

### CSS Compression

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

### JavaScript Compression

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
