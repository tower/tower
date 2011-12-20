(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Coach.View = (function() {

    __extends(View, Coach.Class);

    View.extend({
      engine: "jade",
      prettyPrint: false,
      loadPaths: ["app/views"],
      store: function(store) {
        if (store) this._store = store;
        return this._store || (this._store = new Coach.Store.Memory({
          name: "view"
        }));
      }
    });

    function View(context) {
      if (context == null) context = {};
      this._context = context;
    }

    return View;

  })();

  require('./view/helpers');

  require('./view/rendering');

  Coach.View.include(Coach.View.Rendering);

  Coach.View.include(Coach.View.Helpers);

  module.exports = Coach.View;

}).call(this);
