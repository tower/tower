
Tower.Event.StateMachine = (function() {

  function StateMachine(name, options, block) {
    if (typeof options === "function") {
      block = options;
      options = {};
    }
    block.call(this);
    this.events = [];
    this.states = [];
  }

  StateMachine.prototype.transition = function(from, to) {};

  StateMachine.prototype.state = function(name) {
    return this.states.push(name);
  };

  StateMachine.prototype.event = function(name, block) {
    return this.events.push(name);
  };

  return StateMachine;

})();

module.exports = Tower.Event.StateMachine;
