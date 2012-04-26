(function() {

  Tower.Middleware.Agent = function(request, response, next) {
    var agent, attributes;
    agent = require('useragent').parse(request.headers['user-agent']);
    attributes = _.extend(require('useragent').is(request.headers['user-agent']), {
      family: agent.family,
      major: agent.major,
      minor: agent.minor,
      patch: agent.patch,
      version: agent.toVersion(),
      os: agent.os,
      name: agent.toAgent(),
      mac: !!agent.os.match(/mac/i),
      windows: !!agent.os.match(/win/i),
      linux: !!agent.os.match(/linux/i)
    });
    request.agent = new Tower.HTTP.Agent(attributes);
    if (next) return next();
  };

  module.exports = Tower.Middleware.Agent;

}).call(this);
