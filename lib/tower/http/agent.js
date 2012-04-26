(function() {

  Tower.HTTP.Agent = (function() {

    function Agent(attributes) {
      if (attributes == null) attributes = {};
      _.extend(this, attributes);
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

}).call(this);
