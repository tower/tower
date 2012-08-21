# @module
Tower.ControllerCaching =
  # @todo
  freshWhen: ->

  # @todo
  stale: ->

  # @todo
  expiresIn: ->

  # Current store, used as an identity for the current request.
  # Then you have guids for the controllers, which makes it so you can have a global
  # cache of records.
  store: ->
    @_store ||= {}

module.exports = Tower.ControllerCaching
