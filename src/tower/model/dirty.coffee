# @mixin
Tower.Model.Dirty =
  InstanceMethods:
    attributeChanged: (name) ->
      @get('changes').hasOwnProperty(name)

    attributeChange: (name) ->

    attributeWas: (name) ->
      @get('data').savedData[name]

    resetAttribute: (name) ->
      @get('data').set(name, undefined)

module.exports = Tower.Model.Dirty
