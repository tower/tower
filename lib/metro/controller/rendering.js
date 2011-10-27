(function() {
  var Rendering;
  Rendering = (function() {
    function Rendering() {}
    Rendering.prototype.render = function() {
      var body, view, _base, _ref;
      view = new Metro.Views.Base(this);
      body = view.render.apply(view, arguments);
      if (this.response) {
        if ((_ref = (_base = this.headers)["Content-Type"]) == null) {
          _base["Content-Type"] = this.content_type;
        }
        this.response.writeHead(200, this.headers);
        this.response.write(body);
        this.response.end();
        this.response = null;
        this.request = null;
      }
      return body;
    };
    Rendering.prototype.render_to_body = function(options) {
      this._process_options(options);
      return this._render_template(options);
    };
    Rendering.prototype.render_to_string = function() {
      var options;
      options = this._normalize_render.apply(this, arguments);
      return this.render_to_body(options);
    };
    Rendering.prototype._render_template = function(options) {
      return this.template.render(view_context, options);
    };
    return Rendering;
  })();
}).call(this);
