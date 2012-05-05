# This should all go into underscore, _.toString(), _.fromString()
Tower.Store.Serializer =
  String:
    from: (serialized) ->
      if _.none(serialized) then null else String(serialized)

    to: (deserialized) ->
      if _.none(deserialized) then null else String(deserialized)

  Number:
    from: (serialized) ->
      if _.none(serialized) then null else Number(serialized)

    to: (deserialized) ->
      if _.none(deserialized) then null else Number(deserialized)

  Integer:
    from: (serialized) ->
      if _.none(serialized) then null else parseInt(serialized)

    to: (deserialized) ->
      if _.none(deserialized) then null else parseInt(deserialized)

  Float:
    from: (serialized) ->
      parseFloat(serialized)

    to: (deserialized) ->
      deserialized

  Boolean:
    from: (serialized) ->
      if typeof serialized == 'string'
        !!(serialized != 'false')
      else
        Boolean(serialized)

    to: (deserialized) ->
      Tower.Store.Serializer.Boolean.from(deserialized)

  Date:
    # from ember.js, tmp
    from: (date) ->
      date

    to: (date) ->
      _.toDate(date)

  Geo:
    from: (serialized) ->
      serialized

    to: (deserialized) ->
      switch _.kind(deserialized)
        when 'array'
          lat: deserialized[0], lng: deserialized[1]
        when 'object'
          lat: deserialized.lat || deserialized.latitude
          lng: deserialized.lng || deserialized.longitude
        else
          deserialized = deserialized.split(/,\ */)
          lat: parseFloat(deserialized[0]), lng: parseFloat(deserialized[1])

  Array:
    from: (serialized) ->
      if _.none(serialized) then null else _.castArray(serialized)

    to: (deserialized) ->
      Tower.Store.Serializer.Array.from(deserialized)
      
Tower.Store.Serializer.Decimal  = Tower.Store.Serializer.Float
Tower.Store.Serializer.Time     = Tower.Store.Serializer.Date
Tower.Store.Serializer.DateTime = Tower.Store.Serializer.Date

module.exports = Tower.Store.Serializer
