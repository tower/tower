var mime;

mime = require('mime');

Tower.Controller.addRenderers({
  json: function(json, options, callback) {
    if (typeof json !== "string") json = JSON.stringify(json);
    if (options.callback) json = "" + options.callback + "(" + json + ")";
    this.contentType || (this.contentType = mime.lookup("json"));
    if (callback) callback(null, json);
    return json;
  },
  csv: function(csv, options, callback) {},
  pdf: function(data, options, callback) {}
});
