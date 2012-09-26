
Tower.Controller.addRenderers({
  text: function(text, options, callback) {
    var _base;
    if (typeof text !== 'string') {
      text = JSON.stringify(text);
    }
    (_base = this.headers)['Content-Type'] || (_base['Content-Type'] = require('mime').lookup('text'));
    if (callback) {
      callback(null, text);
    }
    return text;
  },
  json: function(json, options, callback) {
    var jsonpCallback;
    jsonpCallback = options.callback !== false ? options.callback || this.params.callback : void 0;
    if (typeof json !== 'string') {
      if (this.params.pretty && this.params.pretty.toString() === 'true') {
        json = JSON.stringify(json, null, 2);
      } else {
        json = JSON.stringify(json);
      }
    }
    if (!this.getContentType()) {
      this.setContentType(require('mime').lookup('json'));
      if (this.encoding !== 'utf-8') {
        json = this.encodeContent(json, 'utf-8', this.encoding);
      }
    }
    if (jsonpCallback != null) {
      json = "" + jsonpCallback + "(" + json + ")";
    }
    if (callback) {
      callback(null, json);
    }
    return json;
  }
});
