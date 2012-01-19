var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Tower.View = (function() {

  __extends(View, Tower.Class);

  View.extend({
    engine: "coffee",
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

require('./view/table');

require('./view/form');

require('./view/helpers/assetHelper');

require('./view/helpers/componentHelper');

require('./view/helpers/dateHelper');

require('./view/helpers/headHelper');

require('./view/helpers/numberHelper');

require('./view/helpers/stringHelper');

Tower.View.include(Tower.View.Rendering);

Tower.View.include(Tower.View.Helpers);

Tower.View.include(Tower.View.AssetHelper);

Tower.View.include(Tower.View.ComponentHelper);

Tower.View.include(Tower.View.DateHelper);

Tower.View.include(Tower.View.HeadHelper);

Tower.View.include(Tower.View.NumberHelper);

Tower.View.include(Tower.View.StringHelper);

module.exports = Tower.View;
