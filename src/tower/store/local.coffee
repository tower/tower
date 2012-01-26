class Tower.Store.Local extends Tower.Store.Memory
  initialize: ->
    @lastId   = 0
    
  _setRecord: (record) ->
    record.get("id")] = record
    
  _getRecord: (key) ->
    
  _removeRecord: (key) ->
    delete @records[record.id]
    
module.exports = Tower.Store.Local
