(function() {
  var Assets;
  Assets = (function() {
    function Assets() {}
    Assets.middleware = function(request, response, next) {
      return (new Assets).call(request, response, next);
    };
    Assets.prototype.call = function(request, response, next) {
      var asset, assets, result;
      assets = Metro.Application.instance().assets();
      if (!assets.match(request.uri.pathname)) {
        return next();
      }
      asset = assets.find(request.uri.pathname);
      if (!asset) {
        result = this.not_found_response();
      } else {
        result = this.ok_response(asset);
      }
      response.writeHead(result[0], result[1]);
      response.write(result[2]);
      return response.end();
    };
    Assets.prototype.forbidden_request = function(request) {
      return !!request.url.match(/\.{2}/);
    };
    Assets.prototype.not_modified = function(asset) {
      return env["HTTP_IF_MODIFIED_SINCE"] === asset.mtime.httpdate;
    };
    Assets.prototype.not_modified_response = function(asset) {
      return [304, {}, []];
    };
    Assets.prototype.forbidden_response = function() {
      return [
        403, {
          "Content-Type": "text/plain",
          "Content-Length": "9"
        }, ["Forbidden"]
      ];
    };
    Assets.prototype.not_found_response = function() {
      return [
        404, {
          "Content-Type": "text/plain",
          "Content-Length": "9",
          "X-Cascade": "pass"
        }, ["Not found"]
      ];
    };
    Assets.prototype.ok_response = function(asset) {
      return [200, this.headers(asset, asset.size()), asset.body()];
    };
    Assets.prototype.body_only = function() {};
    Assets.prototype.headers = function(asset, length) {
      var headers;
      headers = {};
      headers["Content-Type"] = Metro.Support.Path.content_type("text/" + (asset.extensions()[0].slice(1)));
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
