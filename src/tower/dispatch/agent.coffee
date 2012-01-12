class Tower.Dispatch.Agent
  constructor: (attributes = {}) ->
    _.extend @, attributes
    
  toJSON: ->
    family:   @family
    major:    @major
    minor:    @minor
    patch:    @patch
    version:  @version
    os:       @os
    name:     @name
    
module.exports = Tower.Dispatch.Agent
