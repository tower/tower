(function() {

  Tower.Controller.addRenderers({
    text: function(text, options, callback) {
      var _base;
      if (typeof text !== "string") text = JSON.stringify(text);
      (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = require("mime").lookup("text"));
      if (callback) callback(null, text);
      return text;
    },
    json: function(json, options, callback) {
      var _base;
      if (typeof json !== "string") {
        if (this.params.prettify && this.params.prettify.toString() === "true") {
          json = JSON.stringify(json, null, 2);
        } else {
          json = JSON.stringify(json);
        }
      }
      if (options.callback) json = "" + options.callback + "(" + json + ")";
      (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = require("mime").lookup("json"));
      if (callback) callback(null, json);
      return json;
    }
  });

}).call(this);
