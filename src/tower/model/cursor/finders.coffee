# @mixin
# This is basically an Ember.Pagination module.
Tower.Model.Cursor.Finders =
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
  
  publish: ->
    @constructor.subscriptions.pushObject(@)

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

  find: (callback) ->
    @_find(callback)

  _find: (callback) ->
    if @one
      @store.findOne(@, callback)
    else
      @store.find @, (error, records) =>
        records = @export(records) if !error && records.length

        # need to do something like this...
        if _.isArray(records)

          Ember.setProperties @,
            hasFirstPage:     !!records.length
            hasPreviousPage:  !!records.length
            hasNextPage:      !!records.length
            hasLastPage:      !!records.length
            currentPage:      records.length

          @addObjects(records) if Tower.isClient

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
    @store.count @, (error, count) =>
      Ember.set(@, 'totalCount', count)
      callback.apply @, arguments

  exists: (callback) ->
    @_exists(callback)

  _exists: (callback) ->
    @store.exists @, (error, exists) =>
      Ember.set(@, 'isEmpty', !exists)
      callback.apply @, arguments

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
