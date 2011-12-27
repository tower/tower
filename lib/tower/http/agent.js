
Tower.HTTP.Agent = (function() {

  function Agent(attributes) {
    var key, value;
    if (attributes == null) attributes = {};
    for (key in attributes) {
      value = attributes[key];
      this[key] = value;
    }
  }

  Agent.prototype.toJSON = function() {
    return {
      family: this.family,
      major: this.major,
      minor: this.minor,
      patch: this.patch,
      version: this.version,
      os: this.os,
      name: this.name
    };
  };

  return Agent;

})();

module.exports = Tower.HTTP.Agent;
