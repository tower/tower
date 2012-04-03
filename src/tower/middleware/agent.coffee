Tower.Middleware.Agent = (request, response, next) ->
  agent = require('useragent').parse(request.headers['user-agent'])

  attributes = _.extend require('useragent').is(request.headers['user-agent']),
    family:   agent.family
    major:    agent.major
    minor:    agent.minor
    patch:    agent.patch
    version:  agent.toVersion()
    os:       agent.os
    name:     agent.toAgent()
    mac:      !!agent.os.match(/mac/i)
    windows:  !!agent.os.match(/win/i)
    linux:    !!agent.os.match(/linux/i)

  request.agent = new Tower.HTTP.Agent(attributes)

  # so we can easily parse it out
  # response.cookie("user-agent", JSON.stringify(attributes))

  next() if next

module.exports = Tower.Middleware.Agent
