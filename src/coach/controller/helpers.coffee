Coach.Controller.Helpers =
  ClassMethods:
    helper: (object) ->
      @_helpers ||= []
      @_helpers.push(object)

  urlFor: ->
  
module.exports = Coach.Controller.Helpers
