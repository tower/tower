class Metro.Net.Agent
  constructor: (attributes = {}) ->
    @[key] = value for key, value of attributes
    
module.exports = Metro.Net.Agent
