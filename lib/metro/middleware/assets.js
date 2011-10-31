var Assets;
Assets = (function() {
  function Assets() {}
  Assets.middleware = function(request, response, next) {
    return (new Metro.Middleware.Assets).call(request, response, next);
  };
  Assets.prototype.call = function(request, response, next) {
    var asset, respond;
    if (!Metro.Asset.match(request.uri.pathname)) {
      return next();
    }
    asset = Metro.Asset.find(request.uri.pathname);
    respond = function(status, headers, body) {
      response.writeHead(status, headers);
      response.write(body);
      return response.end();
    };
    if (!asset) {
      return this.notFoundResponse(respond);
    } else {
      return this.okResponse(asset, respond);
    }
  };
  Assets.prototype.forbiddenRequest = function(request) {
    return !!request.url.match(/\.{2}/);
  };
  Assets.prototype.notModified = function(asset) {
    return env["HTTP_IF_MODIFIED_SINCE"] === asset.mtime.httpdate;
  };
  Assets.prototype.notModifiedResponse = function(asset, callback) {
    return callback(304, {}, []);
  };
  Assets.prototype.forbiddenResponse = function(callback) {
    return callback(403, {
      "Content-Type": "text/plain",
      "Content-Length": "9"
    }, "Forbidden");
  };
  Assets.prototype.notFoundResponse = function(callback) {
    return callback(404, {
      "Content-Type": "text/plain",
      "Content-Length": "9",
      "X-Cascade": "pass"
    }, "Not found");
  };
  Assets.prototype.okResponse = function(asset, callback) {
    var paths, self;
    paths = Metro.Asset.pathsFor(asset.extension);
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
    headers["Content-Type"] = Metro.Support.Path.contentType("text/" + asset.extension.slice(1));
    headers["Cache-Control"] = "public";
    headers["Last-Modified"] = asset.mtime();
    headers["ETag"] = this.etag(asset);
    if (asset.pathFingerprint) {
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