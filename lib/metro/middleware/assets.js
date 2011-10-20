(function() {
  var Assets;
  Assets = (function() {
    function Assets() {}
    Assets.middleware = function(request, response, next) {
      return (new Assets).call(request, response, next);
    };
    Assets.prototype.call = function(request, response, next) {
      var asset, start_time;
      start_time = new Date();
      asset = Metro.Application.assets().find(request.path);
      if (!asset) {
        return this.not_found_response();
      } else if (this.not_modified(asset)) {
        return this.not_modified_response(asset);
      } else {
        return this.ok_response(asset);
      }
    };
    Assets.prototype.forbidden_request = function(request) {
      return !!request.url.match(/\.{2}/);
    };
    Assets.prototype.not_modified = function(asset) {
      return env["HTTP_IF_MODIFIED_SINCE"] === asset.mtime.httpdate;
    };
    Assets.prototype.not_modified_response = function(asset, env) {
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
      if (this.body_only(env)) {
        return [200, this.headers(env, asset, asset.size()), [asset.body()]];
      } else {
        return [200, this.headers(env, asset, asset.length), asset];
      }
    };
    Assets.prototype.headers = function(env, asset, length) {
      var headers;
      headers = {};
      headers["Content-Type"] = asset.content_type;
      headers["Content-Length"] = length.to_s;
      headers["Cache-Control"] = "public";
      headers["Last-Modified"] = asset.mtime.httpdate;
      headers["ETag"] = etag(asset);
      if (asset.path_fingerprint) {
        headers["Cache-Control"] += ", max-age=31536000";
      } else {
        headers["Cache-Control"] += ", must-revalidate";
      }
      return headers;
    };
    Assets.prototype.etag = function(asset) {
      return "" + asset.digest;
    };
    return Assets;
  })();
  module.exports = Assets;
}).call(this);
