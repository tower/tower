
Tower.Model.States = {
  ClassMethods: {
    states: function(name) {
      return this.stateMachines()[name] = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return typeof result === "object" ? result : child;
      })(Tower.Event.StateMachine, arguments, function() {});
    },
    stateMachines: function() {
      return this._stateMachines || (this._stateMachines = {});
    }
  }
};

module.exports = Tower.Model.States;
