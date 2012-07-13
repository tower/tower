# @mixin
Tower.Model.Dirty =
  changes: Ember.computed(->
    @get('data').changes()
  ).volatile()

  dirtyAttributes: Ember.computed(->
    if @get('isNew')
      @attributesForCreate()
    else
      @attributesForUpdate()
  ).volatile()

  attributeChanged: (name) ->
    @get('changedAttributes').hasOwnProperty(name)

  attributeWas: (name) ->
    @get('changedAttributes')[name]

  resetAttribute: (key) ->
    changedAttributes = @get('changedAttributes')
    attributes        = @get('attributes')

    if changedAttributes.hasOwnProperty(key)
      old = changedAttributes[key]
      delete changedAttributes[key]
      attributes[key] = old
    else
      attributes[key] = @get('data')._defaultValue(key)

    # @get('data').resetAttribute(name, undefined)

  attributesForCreate: ->
    @get('data').attributesForCreate()

  attributesForUpdate: ->
    @get('data').attributesForUpdate()

  changedAttributes: Ember.computed(->
    @get('data').changedAttributes
  ).volatile()

module.exports = Tower.Model.Dirty
