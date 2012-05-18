# @mixin
Tower.Model.Cursor.Finders =
  ClassMethods:
    subscriptions: []
    
    pushMatching: (records) ->
      @applyMatching('pushMatching', records)

    pullMatching: (records) ->
      @applyMatching('pullMatching', records)
      
    applyMatching: (method, records) ->
      subscriptions = Tower.Model.Cursor.subscriptions
      
      return records unless subscriptions.length
      
      app = Tower.Application.instance()
      
      for key in subscriptions
        app[key][method](records)
        
      records
      
  find: (callback) ->
    @_find(callback)

  _find: (callback) ->
    if @one
      @store.findOne(@, callback)
    else
      @store.find @, (error, records) =>
        records = @export(records) if !error && records.length
        callback.call(@, error, records) if callback
        records
    @

  # hack
  findOne: (callback) ->
    @limit(1)
    @returnArray = false
    @find(callback)

  count: (callback) ->
    @_count(callback)

  _count: (callback) ->
    @store.count(@, callback)

  exists: (callback) ->
    @_exists(callback)

  _exists: (callback) ->
    @store.exists(@, callback)

  getType: ->
    @model

  # on create or update
  pushMatching: (records) ->
    return [] if records.length == 0 || records[0].constructor.toString() != @store.className
    
    matching = Tower.Store.Operators.select(records, @conditions())
    
    # see https://github.com/emberjs/ember.js/issues/773
    @addObjects(matching)

    matching
  
  # on destroy
  pullMatching: (records) ->
    return [] if records.length == 0 || records[0].constructor.toString() != @store.className
    
    matching = Tower.Store.Operators.select(records, @conditions())

    # see https://github.com/emberjs/ember.js/issues/773
    @removeObjects(matching)

    matching
  
  # on update
  pullNotMatching: (records) ->
    return [] if records.length == 0 || records[0].constructor.toString() != @store.className
    
    notMatching = Tower.Store.Operators.notMatching(records, @conditions())

    # see https://github.com/emberjs/ember.js/issues/773
    @removeObjects(notMatching)

    notMatching

module.exports = Tower.Model.Cursor.Finders
