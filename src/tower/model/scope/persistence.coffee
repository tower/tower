Tower.Model.Scope.Persistence =
  ClassMethods:
    persistenceMethods: [
      "create",
      "update",
      "destroy"
    ]

  build: (attributes, options) ->
    {conditions, options} = @_extractArgs(arguments, data: true)#@toCreate()
    @_build attributes, conditions, options

  # User.create(firstName: "Lance")
  # User.where(firstName: "Lance").create()
  # User.where(firstName: "Lance").create([{lastName: "Pollard"}, {lastName: "Smith"}])
  # User.where(firstName: "Lance").create(new User(lastName: "Pollard"))
  # create(attributes)
  # create([attributes, attributes])
  # create(attributes, options)
  create: ->
    {criteria, data, options, callback} = @_extractArgs(arguments, data: true)
    criteria.mergeOptions(options)
    @_create criteria, data, options, callback

  # User.where(firstName: "Lance").update(1, 2, 3)
  # User.update(User.first(), User.last(), firstName: "Lance")
  # User.update([User.first(), User.last()], firstName: "Lance")
  # User.update([1, 2], firstName: "Lance")
  update: ->
    {criteria, data, options, callback} = @_extractArgs(arguments, ids: true, data: true)
    criteria.mergeOptions(options)
    @_update criteria, data, options, callback

  destroy: ->
    {criteria, options, callback} = @_extractArgs(arguments, ids: true)
    criteria.mergeOptions(options)
    @_destroy criteria, options, callback

  # @todo
  sync: ->

  # @todo
  transaction: ->

  # @private
  _build: (attributes, conditions, options) ->
    store = @store
    
    if Tower.Support.Object.isArray(attributes)
      result  = []
      for object in attributes
        if object instanceof Tower.Model
          Tower.Support.Object.extend(object.attributes, conditions, object.attributes)
        else
          object = @store.serializeModel(Tower.Support.Object.extend({}, conditions, object))
          
        result.push object
      result
    else
      if attributes instanceof Tower.Model
        Tower.Support.Object.extend(attributes.attributes, conditions, attributes.attributes)
      else
        attributes = @store.serializeModel(Tower.Support.Object.extend({}, conditions, attributes))
      
      attributes

  # @private
  _create: (criteria, data, opts, callback) ->
    if opts.instantiate
      isArray = Tower.Support.Object.isArray(data)
      records = Tower.Support.Object.toArray(@build(data))

      iterator = (record, next) ->
        if record
          record.save(next)
        else
          next()

      Tower.async records, iterator, (error) =>
        unless callback
          throw error if error
        else
          return callback(error) if error
          if isArray
            callback(error, records)
          else
            callback(error, records[0])
    else
      @store.create data, opts, callback

  # @private
  _update: (criteria, data, opts, callback) ->
    {conditions, options} = criteria.toQuery()
    if opts.instantiate
      iterator = (record, next) ->
        record.updateAttributes(data, next)

      @_each conditions, options, iterator, callback
    else
      @store.update data, conditions, options, callback

  # @private
  _destroy: (criteria, opts, callback) ->
    {conditions, options} = criteria.toQuery()

    if opts.instantiate
      iterator = (record, next) ->
        record.destroy(next)

      @_each conditions, options, iterator, callback
    else
      @store.destroy conditions, options, callback

  # @private
  _each: (conditions, options, iterator, callback) ->
    @store.find conditions, options, (error, records) =>
      if error
        callback.call @, error, records
      else
        Tower.parallel records, iterator, (error) =>
          unless callback
            throw error if error
          else
            callback.call @, error, records if callback


module.exports = Tower.Model.Scope.Persistence
