# https://github.com/andris9/jStorage/blob/master/jstorage.js
# https://github.com/marcuswestin/store.js
# https://raw.github.com/marcuswestin/store.js/master/store.js
# https://raw.github.com/marcuswestin/store.js/master/json.js
class Tower.Store.LocalStorage extends Tower.Store.Memory
  initialize: ->
    @lastId   = 0

  _setRecord: (record) ->
    #record.get("id")] = record

  _getRecord: (key) ->
    @

  _removeRecord: (key) ->
    delete @records[record.id]

module.exports = Tower.Store.LocalStorage
