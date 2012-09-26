var File, Pathfinder, fs, path, _, _path;

fs = require('fs');

path = require('path');

_path = require('path');

Pathfinder = require('pathfinder');

File = Pathfinder.File;

_ = Tower._;

Tower.ApplicationAssets = {
  loadManifest: function() {
    try {
      return Tower.assetManifest = JSON.parse(require('fs').readFileSync('public/asset-manifest.json', 'utf-8'));
    } catch (error) {
      return Tower.assetManifest = {};
    }
  },
  bundle: function(options) {
    var bundle, bundleIterator, bundles, gzip, manifest, mint;
    if (options == null) {
      options = {};
    }
    gzip = require('gzip');
    mint = Tower.module('mint');
    if (!options.hasOwnProperty('minify')) {
      options.minify = true;
    }
    manifest = {};
    bundle = function(type, extension, compressor, callback) {
      var assetBlocks, assets, compile, name, paths;
      assets = Tower.config.assets[type];
      compile = function(data, next) {
        var content, name, paths, _i, _len;
        name = data.name, paths = data.paths;
        _console.debug("Bundling public/" + type + "/" + name + extension);
        content = "";
        for (_i = 0, _len = paths.length; _i < _len; _i++) {
          path = paths[_i];
          content += File.read("public/" + type + path + extension) + "\n\n";
        }
        fs.writeFileSync("public/" + type + "/" + name + extension, content);
        if (options.minify) {
          return process.nextTick(function() {
            return compressor(content, {}, function(error, content) {
              var _this = this;
              if (error) {
                console.log(error);
                return next(error);
              }
              return (function(content) {
                var digestPath, result;
                result = content;
                digestPath = File.digestFile("public/" + type + "/" + name + extension);
                manifest["" + name + extension] = File.basename(digestPath);
                return fs.writeFile(digestPath, result, function() {
                  return next();
                });
              })(content);
            });
          });
        } else {
          return process.nextTick(next);
        }
      };
      assetBlocks = [];
      for (name in assets) {
        paths = assets[name];
        assetBlocks.push({
          name: name,
          paths: paths
        });
      }
      return Tower.async(assetBlocks, compile, function(error) {
        return callback(error);
      });
    };
    bundleIterator = function(data, next) {
      return bundle(data.type, data.extension, data.compressor, next);
    };
    bundles = [
      {
        type: "stylesheets",
        extension: ".css",
        compressor: mint.yui
      }, {
        type: "javascripts",
        extension: ".js",
        compressor: mint.uglifyjs
      }
    ];
    return process.nextTick(function() {
      return Tower.async(bundles, bundleIterator, function(error) {
        if (error) {
          throw error;
        }
        _console.debug("Writing public/asset-manifest.json");
        return fs.writeFile("public/asset-manifest.json", JSON.stringify(manifest, null, 2), function() {
          return process.nextTick(function() {
            return process.exit();
          });
        });
      });
    });
  },
  upload: function(block) {
    var assetCache, cacheHeaders, cachePath, config, expirationDate, fonts, gzip, gzipHeaders, images, javascripts, paths, stylesheets, upload;
    gzip = require('gzip');
    cachePath = "tmp/asset-cache.json";
    if (!_path.existsSync("tmp")) {
      fs.mkdirSync("tmp");
    }
    try {
      assetCache = File.exists(cachePath) ? JSON.parse(File.read(cachePath)) : {};
    } catch (error) {
      console.log(error.message);
      assetCache = {};
    }
    config = (function() {
      try {
        return Tower.config.credentials.s3;
      } catch (_error) {}
    })();
    if (config && config.bucket) {
      _console.debug("Uploading to " + config.bucket);
    }
    images = _.select(File.files("public/images"), function(path) {
      return !!path.match(/\.(gif|ico|png|jpg)$/i);
    });
    fonts = _.select(File.files("public/fonts"), function(path) {
      return !!path.match(/\.(tff|woff|svg|eot)$/i);
    });
    stylesheets = _.select(File.files("public/assets"), function(path) {
      return !!path.match(/-[a-f0-9]+\.(css)$/i);
    });
    javascripts = _.select(File.files("public/assets"), function(path) {
      return !!path.match(/-[a-f0-9]+\.(js)$/i);
    });
    paths = _.map(images.concat(fonts).concat(stylesheets).concat(javascripts), function(path) {
      return path.replace(/^public\//, "");
    });
    expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + 1000 * 60 * 60 * 24 * 365);
    cacheHeaders = {
      "Cache-Control": "public",
      "Expires": expirationDate.toUTCString()
    };
    gzipHeaders = {};
    process.on('exit', function() {
      return File.write(cachePath, JSON.stringify(assetCache, null, 2));
    });
    process.on('SIGINT', function() {
      return process.exit();
    });
    upload = function(path, next) {
      var cached, headers;
      _console.debug("Uploading /" + path);
      headers = _.extend({}, cacheHeaders);
      if (!!path.match(/^(stylesheets|javascripts)/)) {
        headers = _.extend(headers, gzipHeaders, {
          "Etag": File.pathFingerprint(path)
        });
      } else {
        headers = _.extend(headers, {
          "Etag": File.digest("public/" + path)
        });
      }
      cached = assetCache[path];
      if (!(cached && cached["Etag"] === headers["Etag"])) {
        cached = _.extend({}, headers);
        return block("public/" + path, "/" + path, headers, function(error, result) {
          if (error) {
            console.log(error);
          }
          return process.nextTick(function() {
            assetCache[path] = cached;
            return next(error);
          });
        });
      } else {
        return next();
      }
    };
    return Tower.async(paths, upload, function(error) {
      if (error) {
        console.log(error);
      }
      return process.nextTick(function() {
        return fs.writeFile(cachePath, JSON.stringify(assetCache, null, 2), function() {
          return process.nextTick(function() {
            return process.exit();
          });
        });
      });
    });
  },
  uploadToS3: function(callback) {
    var client, knox;
    knox = require('knox');
    client = knox.createClient(Tower.config.credentials.s3);
    return this.upload(function(from, to, headers, next) {
      return client.putFile(from, to, headers, next);
    });
  },
  stats: function() {
    var Table, big, compressedSize, manifest, normalSize, percent, small, stat, table;
    Table = require('cli-table');
    manifest = Tower.assetManifest;
    table = new Table({
      head: ['Path', 'Compressed (kb)', 'Normal (kb)', '%'],
      colWidths: [60, 20, 20, 10]
    });
    for (big in manifest) {
      small = manifest[big];
      path = "public/assets/" + small;
      stat = fs.statSync(path);
      compressedSize = stat.size / 1000.0;
      path = "public/assets/" + big;
      stat = fs.statSync(path);
      normalSize = stat.size / 1000.0;
      percent = (1 - (compressedSize / normalSize)) * 100.0;
      percent = percent.toFixed(1);
      compressedSize = compressedSize.toFixed(1);
      normalSize = normalSize.toFixed(1);
      if ((compressedSize === normalSize && normalSize === "0.0")) {
        percent = "-";
      } else {
        percent = "" + percent + "%";
      }
      table.push([path, compressedSize, normalSize, percent]);
    }
    return console.log(table.toString());
  }
};

module.exports = Tower.ApplicationAssets;
