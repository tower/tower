(function() {
  var Rendering;
  Rendering = (function() {
    function Rendering() {
      Rendering.__super__.constructor.apply(this, arguments);
    }
    Rendering.prototype.render = function() {
      var args, callback, finish, self, view, _base, _ref;
      args = Array.prototype.slice.call(arguments, 0, arguments.length);
      if (args.length >= 2 && typeof args[args.length - 1] === "function") {
        callback = args.pop();
      }
      view = new Metro.View(this);
      if ((_ref = (_base = this.headers)["Content-Type"]) == null) {
        _base["Content-Type"] = this.contentType;
      }
      self = this;
      args.push(finish = function(error, body) {
        var _ref2;
        self.body = body;
        if ((_ref2 = self.body) == null) {
          self.body = error.toString();
        }
        if (callback) {
          callback(error, body);
        }
        return self.callback();
      });
      return view.render.apply(view, args);
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
