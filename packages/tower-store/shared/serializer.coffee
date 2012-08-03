# This should all go into underscore, _.toString(), _.fromString()
Tower.StoreSerializerString =
  from: (serialized) ->
    if _.none(serialized) then null else String(serialized)

  to: (deserialized) ->
    if _.none(deserialized) then null else String(deserialized)

Tower.StoreSerializerNumber =
  from: (serialized) ->
    if _.none(serialized) then null else Number(serialized)

  to: (deserialized) ->
    if _.none(deserialized) then null else Number(deserialized)

Tower.StoreSerializerInteger =
  from: (serialized) ->
    if _.none(serialized) then null else parseInt(serialized)

  to: (deserialized) ->
    if _.none(deserialized) then null else parseInt(deserialized)

Tower.StoreSerializerFloat =
  from: (serialized) ->
    parseFloat(serialized)

  to: (deserialized) ->
    deserialized

Tower.StoreSerializerBoolean =
  from: (serialized) ->
    if typeof serialized == 'string'
      !!(serialized != 'false')
    else
      Boolean(serialized)

  to: (deserialized) ->
    Tower.StoreSerializerBoolean.from(deserialized)

Tower.StoreSerializerDate =
  # from ember.js, tmp
  from: (date) ->
    date

  to: (date) ->
    _.toDate(date)

Tower.StoreSerializerGeo =
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

Tower.StoreSerializerArray =
  from: (serialized) ->
    if _.none(serialized) then null else _.castArray(serialized)

  to: (deserialized) ->
    Tower.StoreSerializerArray.from(deserialized)

Tower.StoreSerializerDecimal  = Tower.StoreSerializerFloat
Tower.StoreSerializerTime     = Tower.StoreSerializerDate
Tower.StoreSerializerDateTime = Tower.StoreSerializerDate

module.exports = Tower.StoreSerializer
