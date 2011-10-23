(function() {
  var Assets;
  Assets = (function() {
    function Assets() {}
    Assets.middleware = function(request, response, next) {
      return (new Assets).call(request, response, next);
    };
    Assets.prototype.call = function(request, response, next) {
      var asset, assets, respond;
      assets = Metro.Application.instance().assets();
      if (!assets.match(request.uri.pathname)) {
        return next();
      }
      asset = assets.find(request.uri.pathname);
      respond = function(status, headers, body) {
        response.writeHead(status, headers);
        response.write(body);
        return response.end();
      };
      if (!asset) {
        return this.not_found_response(respond);
      } else {
        return this.ok_response(asset, respond);
      }
    };
    Assets.prototype.forbidden_request = function(request) {
      return !!request.url.match(/\.{2}/);
    };
    Assets.prototype.not_modified = function(asset) {
      return env["HTTP_IF_MODIFIED_SINCE"] === asset.mtime.httpdate;
    };
    Assets.prototype.not_modified_response = function(asset, callback) {
      return callback(304, {}, []);
    };
    Assets.prototype.forbidden_response = function(callback) {
      return callback(403, {
        "Content-Type": "text/plain",
        "Content-Length": "9"
      }, "Forbidden");
    };
    Assets.prototype.not_found_response = function(callback) {
      return callback(404, {
        "Content-Type": "text/plain",
        "Content-Length": "9",
        "X-Cascade": "pass"
      }, "Not found");
    };
    Assets.prototype.ok_response = function(asset, callback) {
      var paths, self;
      paths = Metro.Application.instance().assets().paths_for(asset.extension);
      self = this;
      return asset.render({
        paths: paths,
        require: Metro.env !== "production"
      }, function(body) {
        return callback(200, self.headers(asset, asset.size()), body);
      });
    };
    Assets.prototype.headers = function(asset, length) {
      var headers;
      headers = {};
      headers["Content-Type"] = Metro.Support.Path.content_type("text/" + asset.extension.slice(1));
      headers["Cache-Control"] = "public";
      headers["Last-Modified"] = asset.mtime();
      headers["ETag"] = this.etag(asset);
      if (asset.path_fingerprint) {
        headers["Cache-Control"] += ", max-age=31536000";
      } else {
        headers["Cache-Control"] += ", must-revalidate";
      }
      return headers;
    };
    Assets.prototype.etag = function(asset) {
      return "" + (asset.digest());
    };
    return Assets;
  })();
  module.exports = Assets;
}).call(this);
