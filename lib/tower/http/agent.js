var __defineProperty = function(clazz, key, value) {
  if(typeof clazz.__defineProperty == 'function') return clazz.__defineProperty(key, value);
  return clazz.prototype[key] = value;
};

Tower.HTTP.Agent = (function() {

  function Agent(attributes) {
    if (attributes == null) {
      attributes = {};
    }
    _.extend(this, attributes);
  }

  __defineProperty(Agent,  "toJSON", function() {
    return {
      family: this.family,
      major: this.major,
      minor: this.minor,
      patch: this.patch,
      version: this.version,
      os: this.os,
      name: this.name
    };
  });

  return Agent;

})();

module.exports = Tower.HTTP.Agent;
