
Tower.Controller.addRenderers({
  json: function(json, options, callback) {
    var _base;
    if (typeof json !== "string") json = JSON.stringify(json);
    if (options.callback) json = "" + options.callback + "(" + json + ")";
    (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = require("mime").lookup("json"));
    if (callback) callback(null, json);
    return json;
  }
});
