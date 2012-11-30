
Tower.ControllerSockets = {
  ClassMethods: {
    on: function() {}
  }
};

Tower.Controller.reopen({
  emit: function() {
    return console.log("Working...");
  }
});

module.exports = Tower.ControllerSockets;
