var File, Pathfinder, Shift, async, exec, fs, path, print, puts, spawn, _path, _ref;

_ref = require('child_process'), exec = _ref.exec, spawn = _ref.spawn;

async = require('async');

fs = require('fs');

path = require('path');

Shift = require('shift');

_path = require('path');

Pathfinder = require('pathfinder');

File = Pathfinder.File;

puts = require('util').puts;

print = require('util').print;

Tower.Application.Assets = {
  loadManifest: function() {
    try {
      return Tower.assetManifest = JSON.parse(require('fs').readFileSync('public/assets/manifest.json', 'utf-8'));
    } catch (error) {
      return Tower.assetManifest = {};
    }
  },
  bundle: function() {
    var gzip;
    gzip = require('gzip');
    return exec("rm -r public/assets", function() {
      return exec("mkdir public/assets", function() {
        var bundle, bundleIterator, bundles, manifest;
        manifest = {};
        bundle = function(type, extension, compressor, callback) {
          var assetBlocks, assets, compile, name, paths;
          assets = Tower.assets[type];
          compile = function(data, next) {
            var content, name, path, paths, _i, _len;
            name = data.name, paths = data.paths;
            _console.debug("Bundling public/assets/" + name + extension);
            content = "";
            for (_i = 0, _len = paths.length; _i < _len; _i++) {
              path = paths[_i];
              content += File.read("public/" + type + path + extension) + "\n\n";
            }
            fs.writeFileSync("public/assets/" + name + extension, content);
            return process.nextTick(function() {
              return compressor.render(content, function(error, result) {
                var digestPath;
                if (error) {
                  console.log(error);
                  return next(error);
                }
                digestPath = File.digestFile("public/assets/" + name + extension);
                manifest["" + name + extension] = File.basename(digestPath);
                return gzip(result, function(error, result) {
                  fs.writeFileSync(digestPath, result);
                  return next();
                });
              });
            });
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
            compressor: new Shift.YuiCompressor
          }, {
            type: "javascripts",
            extension: ".js",
            compressor: new Shift.UglifyJS
          }
        ];
        return process.nextTick(function() {
          return Tower.async(bundles, bundleIterator, function(error) {
            if (error) throw error;
            _console.debug("Writing public/assets/manifest.json");
            fs.writeFileSync("public/assets/manifest.json", JSON.stringify(manifest, null, 2));
            return process.exit();
          });
        });
      });
    });
  },
  upload: function(block) {
    var assetCache, cacheHeaders, cachePath, expirationDate, fonts, gzip, gzipHeaders, images, javascripts, paths, stylesheets, upload;
    gzip = require('gzip');
    cachePath = "tmp/asset-cache.json";
    if (!_path.existsSync("tmp")) fs.mkdirSync("tmp");
    assetCache = File.exists(cachePath) ? JSON.parse(File.read(cachePath)) : {};
    _console.debug("Uploading to " + Tower.secrets.s3.bucket);
    images = _.select(File.files("public/images"), function(path) {
      return !!path.match(/\.(gif|ico|png|jpg)$/i);
    });
    fonts = _.select(File.files("public/fonts"), function(path) {
      return !!path.match(/\.(tff|woff|svg|eot)$/i);
    });
    stylesheets = _.select(File.files("public/assets"), function(path) {
      return !!path.match(/-[a-f0-9]+\.(css)$/i);
    });
    stylesheets = _.map(stylesheets, function(path) {
      return path.replace(/^public\/assets/, "stylesheets");
    });
    javascripts = _.select(File.files("public/assets"), function(path) {
      return !!path.match(/-[a-f0-9]+\.(js)$/i);
    });
    javascripts = _.map(javascripts, function(path) {
      return path.replace(/^public\/assets/, "javascripts");
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
    gzipHeaders = {
      "Content-Encoding": "gzip",
      "Vary": "Accept-Encoding"
    };
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
        return block("public/" + (path.replace(/^(stylesheets|javascripts)/, "assets")), "/" + path, headers, function(error, result) {
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
      if (error) console.log(error);
      return File.write(cachePath, JSON.stringify(assetCache, null, 2));
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
      table.push([path, compressedSize.toFixed(1), normalSize.toFixed(1), "" + percent + "%"]);
    }
    return console.log(table.toString());
  }
};

module.exports = Tower.Application.Assets;
