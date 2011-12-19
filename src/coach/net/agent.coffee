class Coach.Net.Agent
  constructor: (attributes = {}) ->
    @[key] = value for key, value of attributes
    
module.exports = Coach.Net.Agent
