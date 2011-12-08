Metro.Controller.Helpers =
  ClassMethods:
    helper: (object) ->
      @_helpers ||= []
      @_helpers.push(object)

  urlFor: ->
  
module.exports = Metro.Controller.Helpers
