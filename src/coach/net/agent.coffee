class Coach.Net.Agent
  constructor: (attributes = {}) ->
    @[key] = value for key, value of attributes
    
  toJSON: ->
    family:   @family
    major:    @major
    minor:    @minor
    patch:    @patch
    version:  @version
    os:       @os
    name:     @name
    
module.exports = Coach.Net.Agent
