# Metro.js

> Rails-esque Framework For Node.js

## Install

``` bash
npm install metro
```

## Usage

### Compression

``` coffeescript
css = '''
body {
  background: red;
}
'''
css_compressor = new Metro.Asset.YUICompressor
css_compressor.compress(css)
  # 'body{background:red}'

js = '''
$(document).ready(function() {
  alert("ready!");
});
'''
js_compressor = new Metro.Asset.UglifyJSCompressor
js_compressor.compress(js)
  # '$(document).ready(function(){alert("ready!")})'

```

## Development

``` bash
npm install uglify-js jasmine-node
coffee -c --no-wrap -o lib -w src
coffee -c -o lib -w src
jasmine-node --coffee spec/.
cake build
```

## Resources

### Projects

- https://github.com/rails/rails
- https://github.com/senchalabs/connect
- https://github.com/1602/express-on-railway
- https://github.com/mauricemach/zappa
- https://github.com/mde/geddy
- https://github.com/rails/rails/tree/master/actionpack/lib/sprockets
- https://github.com/Tim-Smart/node-asset/blob/master/src/index.coffee
- https://github.com/craigspaeth/nap
- https://github.com/mape/connect-assetmanager
- https://github.com/cjohansen/juicer/
- https://github.com/One-com/assetgraph
- https://github.com/mishoo/UglifyJS/
- https://github.com/TrevorBurnham/connect-assets
- https://github.com/TrevorBurnham/snockets
- https://github.com/TrevorBurnham/snockets/blob/master/src/snockets.coffee
- https://github.com/sstephenson/sprockets
- https://github.com/stoyan/yuicompressor/blob/master/ports/js/cssmin.js

- https://github.com/LearnBoost/juice (inject styles to html for emails)
- http://visionmedia.github.com/nib/ (cross browser css)

### Articles

- http://imulus.com/blog/casey/javascript/coffeescript-namespaces-modules-and-inheritance/
- https://github.com/jashkenas/coffee-script/wiki/FAQ

### Docs

- http://nodejs.org/docs/v0.3.1/api/assert.html

## Notes

- Personally I would recommend a stack of express(Server, view engine, middleware), now(Client-Server communication), cradle(CouchDB database abstraction), backbone(Lightweight MVC abstraction), underscore.