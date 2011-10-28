(function() {
  var Rendering;
  Rendering = (function() {
    function Rendering() {
      Rendering.__super__.constructor.apply(this, arguments);
    }
    Rendering.prototype.render = function() {
      var body, view, _base, _ref;
      view = new Metro.Views.Base(this);
      body = view.render.apply(view, arguments);
      if (this.response) {
        if ((_ref = (_base = this.headers)["Content-Type"]) == null) {
          _base["Content-Type"] = this.contentType;
        }
        this.response.writeHead(200, this.headers);
        this.response.write(body);
        this.response.end();
        this.response = null;
        this.request = null;
      }
      return body;
    };
    Rendering.prototype.renderToBody = function(options) {
      this._processOptions(options);
      return this._renderTemplate(options);
    };
    Rendering.prototype.renderToString = function() {
      var options;
      options = this._normalizeRender.apply(this, arguments);
      return this.renderToBody(options);
    };
    Rendering.prototype._renderTemplate = function(options) {
      return this.template.render(viewContext, options);
    };
    return Rendering;
  })();
  module.exports = Rendering;
}).call(this);
