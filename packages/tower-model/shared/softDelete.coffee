# @todo Inspired from acts_as_paranoid and mongoid::paranoia
Tower.Model.SoftDelete =
  ClassMethods:
    included: ->
      @field 'deletedAt', type: 'Date'
      # @isParanoid = true

      @defaultScope @where(deleted_at: null)
      @scope 'deleted', @ne(deleted_at: null)

  # Remove the record from the database completely.
  hardDestroy: ->

  destroy: (callback) ->
    @updateAttribute 'deletedAt', _.now(), =>
      @set('isDestroyed', true)
      callback(arguments...)

  restore: (callback) ->
    @updateAttribute('deletedAt', null, callback)

module.exports = Tower.Model.SoftDelete
