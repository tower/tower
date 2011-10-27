class Serialization
  # https://github.com/oozcitak/xmlbuilder-js
  toXML: ->
    
  toJSON: ->
    JSON.stringify(@attributes)
    
  @fromJSON: (data) ->
    records = JSON.parse(data)
    records = [records] unless records instanceof Array
    
    for record, i in records
      records[i] = new @(record)
    
    records
    
module.exports = Serialization
