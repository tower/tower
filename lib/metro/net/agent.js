
  Metro.Net.Agent = (function() {

    function Agent(attributes) {
      var key, value;
      if (attributes == null) attributes = {};
      for (key in attributes) {
        value = attributes[key];
        this[key] = value;
      }
    }

    return Agent;

  })();

  module.exports = Metro.Net.Agent;
