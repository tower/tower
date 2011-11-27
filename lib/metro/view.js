(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.View = (function() {

    __extends(View, Metro.Object);

    View.extend({
      loadPaths: ["./app/views"],
      engine: "jade",
      prettyPrint: false,
      store: function(store) {
        if (store) this._store = store;
        return this._store || (this._store = new Metro.Store.FileSystem);
      }
    });

    function View(controller) {
      this.controller = controller;
    }

    View.prototype.store = function() {
      return this.constructor.store();
    };

    return View;

  })();

  require('./view/helpers');

  module.exports = Metro.View;

}).call(this);
