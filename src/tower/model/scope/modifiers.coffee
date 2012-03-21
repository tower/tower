# @todo
Tower.Model.Scope.Modifiers =
  ClassMethods:
    atomicModifiers:
      "$set":     "$set"
      "$unset":   "$unset"
      "$push":    "$push"
      "$pushAll": "$pushAll"
      "$pull":    "$pull"
      "$pullAll": "$pullAll"
      "$inc":     "$inc"
      "$pop":     "$pop"

  # { $push : { field : value } }
  push: (record, updates, all) ->
    attributes  = record.attributes
    schema      = record.constructor.schema()
    changes     = record.changes

    for key, value of updates
      oldValue = attributes[key]

      attributes[key] ||= []

      # @todo check if valid type from schema!
      if all && _.isArray(value)
        attributes[key] = attributes[key].concat(value)
      else
        attributes[key].push(value)

      @changeAttribute(changes, key, oldValue, attributes[key])

    changes

  changeAttribute: (changes, key, oldValue, newValue) ->
    unless !!changes[key]
      changes[key]    = [oldValue, newValue]
    else
      changes[key][1] = newValue

    delete changes[key] if changes[key][0] == changes[key][1]

    changes

  # { $pushAll : { field : array } }
  pushAll: (record, updates) ->
    @push record, updates, true

  pull: (record, updates, all) ->
    attributes  = record.attributes
    schema      = record.constructor.schema()
    changes     = record.changes

    for key, value of updates
      attributeValue  = attributes[key]
      oldValue  = undefined
      if attributeValue && _.isArray(attributeValue)
        oldValue = attributeValue.concat()
        if all && _.isArray(value)
          for item in value
            attributeValue.splice _attributeValue.indexOf(item), 1
        else
          attributeValue.splice _attributeValue.indexOf(value), 1

      @changeAttribute(changes, key, oldValue, attributeValue)

    changes

  pullAll: (record, updates) ->
    @pull record, updates, true

  inc: (record, updates) ->
    attributes  = record.attributes
    schema      = record.constructor.schema()
    changes     = record.changes

    for key, value of updates
      oldValue = attributes[key]
      attributes[key] ||= 0
      attributes[key] += value

      @changeAttribute changes, key, oldValue, attributes[key]

    attributes

  set: (record, updates) ->
    attributes  = record.attributes
    schema      = record.constructor.schema()
    changes     = record.changes

    for key, value of updates
      field     = schema[key]
      oldValue  = attributes[key]
      if field && field.type == "Array" && !Tower.Support.Object.isArray(value)
        attributes[key] ||= []
        attributes[key].push value
      else
        attributes[key] = value

      @changeAttribute changes, key, oldValue, attributes[key]

    changes

  unset: (record, updates) ->
    attributes  = record.attributes
    changes     = record.changes

    for key, value of updates
      oldValue = attributes[key]
      attributes[key] = undefined

      @changeAttribute changes, key, oldValue, attributes[key]

    changes

  update: (record, updates) ->
    set     = null

    for key, value of updates
      if @isAtomicModifier(key)
        @["#{key.replace("$", "")}"](record, value)
      else
        set ||= {}
        set[key] = value

    @set(record, set) if set

    record

  assignAttributes: (attributes) ->
    for key, value of attributes
      delete @changes[key]
      @attributes[key] = value
    @

  resetAttributes: (keys) ->
    @resetAttributes(key) for key in keys
    @

  resetAttribute: (key) ->
    array = @changes[key]
    if array
      delete @changes[key]
      @attributes[key] = array[0]
    @

  toUpdates: (record) ->
    result  = {}
    changes = record.changes
    schema  = record.constructor.schema()

    for key, value of changes
      field = field[key]
      if field
        if field.type == "Array"
          pop   = _.difference(value[0], value[1])

          if pop.length > 0
            result.$pop ||= {}
            result.$pop[key] = pop

          push  = _.difference(value[1], value[0])

          if push.length > 0
            result.$push ||= {}
            result.$push[key] = push
        else if field.type == "Integer"
          result.$inc ||= {}
          result.$inc[key] = (value[1] || 0) - (value[0] || 0)
      else
        result[key]

    result

module.exports = Tower.Model.Scope.Modifiers
