# @module
Tower.ModelTimestamp =
  ClassMethods:
    # Adds `createdAt` and `updatedAt` attributes to your records.
    timestamps: ->
      @field 'createdAt', type: 'Date'
      @field 'updatedAt', type: 'Date'

      @before 'create', 'setCreatedAt'
      @before 'save', 'setUpdatedAt'

      @include
        setCreatedAt: ->
          @set 'createdAt', new Date

        setUpdatedAt: ->
          @set 'updatedAt', new Date

module.exports = Tower.ModelTimestamp
