_ = Tower._

# @mixin
# This is basically an Ember.Pagination module.
Tower.ModelCursorFinders =
  # These are for binding to pagination controls in a view
  # https://gist.github.com/1608481
  # https://github.com/interline/travelstar-pagination/blob/master/lib/mixins/paginatable.js
  hasFirstPage: false
  hasPreviousPage: false

  # Whether or not there is a "next page" in the collection.
  # 
  # If no records are present or the cursor has not yet performed a query, 
  # it will be false.  If there is at least one more page of 
  # matching records it will be true, otherwise it's false.
  hasNextPage: false

  # Whether or not there is a "last page" in the collection.
  # 
  # If no records are present or the cursor has not yet performed a query, 
  # it will be false.  If there is at least one more page of 
  # matching records it will be true, otherwise it's false.
  hasLastPage: false

  # Whether or not there are no matching records.
  # 
  # If no records are present or the cursor has not yet performed a query, 
  # it will be true. Otherwise it's false.
  isEmpty: true

  # The total number of matching records in the collection.
  # 
  # If no records are present or the cursor has not yet performed a query, 
  # it will be 0. Otherwise it's the total number of records in the database.
  # 
  # @note This is not the `length` of the records in the cursor's array,
  # which could be a subset of the total set of records.
  totalCount: 0

  # The total number of pages in the collection of matching records.
  # 
  # If no records are present or the cursor has not yet performed a query, 
  # it will be 0. If no `limit` is set but a query has been made, then it will be 1.
  # If a limit has been set, then it's a multiple of the limit.
  totalPageCount: 0

  # The current page in the collection of matching records.
  # 
  # If no records are present or the cursor has not yet performed a query, 
  # it will be 0. If no `limit` is set but a query has been made, then it will be 1.
  # If a limit has been set, then it's a multiple of the limit.
  currentPage: 0

  # will make a find AND a count, to get the total pages
  # or maybe this should be in one.
  #paginate: (callback) ->
  #  @find (error, records) =>
  #    @count (error, count) =>
  #      @set('totalCount', count)
  #
  #      callback.call(@, error, records) if callback

  # Helper method to traverse the pages of records.
  firstPage: ->
    @page(1)
    @
  
  # Helper method to traverse the pages of records.
  lastPage: ->
    @page(@totalPageCount)
    @
  
  # Helper method to traverse the pages of records.
  nextPage: ->
    @page(@currentPage + 1)
    @
  
  # Helper method to traverse the pages of records.
  previousPage: ->
    @page(@currentPage - 1)
    @

  all: (callback) ->
    delete @returnArray # tmp
    @find(callback)

  find: (callback) ->
    @_find(callback)

  # hack
  findOne: (callback) ->
    @limit(1)
    @returnArray = false
    @find(callback)

  count: (callback) ->
    @_count(callback)

  exists: (callback) ->
    @_exists(callback)

  fetch: (callback) ->
    @store.fetch(@, callback)

  mergeCreatedRecords: (records) ->
    @pushMatching(records)

  mergeUpdatedRecords: (records) ->
    @pushMatching(records)
    @pullNotMatching(records)

  mergeDeletedRecords: (records) ->
    @pullMatching(records)

  # on create or update
  pushMatching: (records) ->
    return [] if records.length == 0 || records[0].constructor.toString() != @store.className

    matching = Tower.StoreOperators.select(records, @conditions())

    # see https://github.com/emberjs/ember.js/issues/773
    # need to change this so it works with model.get('id')
    Ember.beginPropertyChanges(@)

    for item in matching
      @addObject(item) unless @contains(item)

    Ember.endPropertyChanges(@)

    matching

  # on destroy
  pullMatching: (records) ->
    return [] if records.length == 0 || records[0].constructor.toString() != @store.className

    matching = Tower.StoreOperators.select(records, @conditions())

    # see https://github.com/emberjs/ember.js/issues/773
    @removeObjects(matching)

    matching

  # on update
  pullNotMatching: (records) ->
    return [] if records.length == 0 || records[0].constructor.toString() != @store.className

    notMatching = Tower.StoreOperators.notMatching(records, @conditions())

    # see https://github.com/emberjs/ember.js/issues/773
    @removeObjects(notMatching)

    notMatching

  # not sure if this will happen automtically yet, on the client
  commit: ->
    Ember.beginPropertyChanges(@)
    content = @get('content')
    @mergeUpdatedRecords(content)
    # Ember.SortableMixin
    Ember.endPropertyChanges(@)

  # @protected
  _find: (callback) ->
    returnArray = @returnArray
    result = undefined

    if @one
      @store.findOne(@, callback)
    else
      @store.find @, (error, records) =>
        if records
          if @returnArray == false && !records.length
            records = null
          else
            records = @export(records) if !error && records.length

        result = records

        @clear() if Tower.isClient

        if _.isArray(records)
          # need to do something like this...
          Ember.setProperties @,
            hasFirstPage:     !!records.length
            hasPreviousPage:  !!records.length
            hasNextPage:      !!records.length
            hasLastPage:      !!records.length
            # currentPage:      records.length

          @addObjects(records)# if Tower.isClient

        callback.call(@, error, records) if callback
        records
    
    if returnArray == false then result else @

  # @protected
  _count: (callback) ->
    @store.count @, (error, count) =>
      Ember.set(@, 'totalCount', count)
      callback.apply(@, arguments) if callback

  # @protected
  _exists: (callback) ->
    @store.exists @, (error, exists) =>
      Ember.set(@, 'isEmpty', !exists)
      callback.apply(@, arguments) if callback

  # @private
  _hasContent: (callback) ->
    if Tower.isClient && @_invalidated
      delete @_invalidated
      callback.call(@) if callback
      return false

    # records = if Ember.EXTEND_PROTOTYPES then @ else Ember.get(@, 'content')
    records = Ember.get(@, 'content')
    if records && records.length
      callback.call(@, null, records) if callback
      true
    else
      false

for phase in ['Before', 'After']
  for action in ['Insert', 'Update', 'Destroy', 'Find']
    do (phase, action) =>
      Tower.ModelCursorFinders["_run#{phase}#{action}CallbacksOnStore"] = (done, records) ->
        @store["run#{phase}#{action}"](@, done, records)

Tower.ModelCursorFinders = Ember.Mixin.create(Tower.ModelCursorFinders)

module.exports = Tower.ModelCursorFinders
