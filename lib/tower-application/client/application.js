/*
global error handling

$(window).error (event) ->
  try
    App.errorHandler(event)
  catch error
    console.log(error)
*/

var __hasProp = {}.hasOwnProperty,
  __extends =   function(child, parent) {
    if (typeof parent.__extend == 'function') return parent.__extend(child);
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } 
    function ctor() { this.constructor = child; } 
    ctor.prototype = parent.prototype; 
    child.prototype = new ctor; 
    child.__super__ = parent.prototype; 
    if (typeof parent.extended == 'function') parent.extended(child); 
    return child; 
};

Tower.Application = (function(_super) {
  var Application;

  function Application() {
    return Application.__super__.constructor.apply(this, arguments);
  }

  Application = __extends(Application, _super);

  Application.reopenClass({
    _callbacks: {},
    instance: function() {
      return this._instance;
    }
  });

  Application.before('initialize', 'setDefaults');

  Application.reopen({
    setDefaults: function() {
      return true;
    },
    teardown: function() {
      return Tower.Route.reload();
    },
    init: function() {
      this._super.apply(this, arguments);
      if (Tower.Application._instance) {
        throw new Error("Already initialized application");
      }
      return Tower.Application._instance = this;
    },
    ready: function() {
      return this._super.apply(this, arguments);
    },
    initialize: function() {
      this.extractAgent();
      this.setDefaults();
      this._super(Tower.router);
      return this;
    },
    extractAgent: function() {
      Tower.cookies = Tower.NetCookies.parse();
      return Tower.agent = new Tower.NetAgent(JSON.parse(Tower.cookies["user-agent"] || '{}'));
    },
    listen: function() {
      if (this.listening) {
        return;
      }
      this.listening = true;
      Tower.url || (Tower.url = "" + window.location.protocol + "//" + window.location.host);
      Tower.socketUrl || (Tower.socketUrl = Tower.url);
      Tower.NetConnection.initialize();
      return Tower.NetConnection.listen(Tower.socketUrl);
    },
    run: function() {
      return this.listen();
    }
  });

  return Application;

})(Tower.Engine);

module.exports = Tower.Application;
