(function() {
  var Rendering;
  Rendering = (function() {
    function Rendering() {}
    Rendering.prototype.render = function() {
      var _ref;
      if (this.response_body) {
        throw "Double Render Error";
      }
      Rendering.__super__.render.apply(this, arguments);
      if ((_ref = this.content_type) == null) {
        this.content_type = mime(this.formats);
      }
      return response_body;
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
