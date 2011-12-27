var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.View = (function() {

  __extends(View, Tower.Class);

  View.extend({
    engine: "jade",
    prettyPrint: false,
    loadPaths: ["app/views"],
    store: function(store) {
      if (store) this._store = store;
      return this._store || (this._store = new Tower.Store.Memory({
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

Tower.View.include(Tower.View.Rendering);

Tower.View.include(Tower.View.Helpers);

module.exports = Tower.View;
