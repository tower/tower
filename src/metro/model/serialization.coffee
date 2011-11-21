Metro.Model.Serialization =
  ClassMethods:
    fromJSON: (data) ->
      records = JSON.parse(data)
      records = [records] unless records instanceof Array

      for record, i in records
        records[i] = new @(record)

      records

    fromForm: (data) ->
  
  # https://github.com/oozcitak/xmlbuilder-js
  toXML: ->
  
  toJSON: ->
    JSON.stringify(@attributes)
  
  toForm: ->
  
  toObject: ->
    @attributes
  
  clone: ->
    new @constructor(Metro.Support.Object.clone(@attributes))
  
module.exports = Metro.Model.Serialization
