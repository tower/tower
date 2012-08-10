_ = Tower._

# @mixin
Tower.ModelRelations =
  ClassMethods:
    # One-to-one association, where the id is stored on the associated object.
    #
    # @example Basic example
    #   class App.User extends Tower.Model
    #     @hasOne 'address'
    #
    #   class App.Address extends Tower.Model
    #     @belongsTo 'user'
    #
    #   user    = App.User.create()
    #   address = user.get('address').create()
    #
    # @example Example using all the `hasOne` options
    #   class App.User extends Tower.Model
    #     @hasOne 'location', type: 'Address', embed: true, as: 'addressable'
    #
    #   class App.Address extends Tower.Model
    #     @belongsTo 'addressable', polymorphic: true
    hasOne: (name, options = {}) ->
      @relations()[name]  = new Tower.ModelRelationHasOne(@, name, options)

    # One-to-many association, where the id is stored on the associated object.
    #
    # @example Basic example
    #   class App.User extends Tower.Model
    #     @hasMany 'comments'
    #
    #   class App.Comment extends Tower.Model
    #     @belongsTo 'user'
    #
    #   user    = App.User.create()
    #   comment = user.get('comments').create()
    #
    # @example Example using all the `hasMany` options
    #   class App.User extends Tower.Model
    #     @hasMany 'comments', as: 'commentable', embed: true
    #
    #   class App.Comment extends Tower.Model
    #     @belongsTo 'commentable', polymorphic: true
    #
    # @param [String] name name of the association
    # @param [Object] options association options
    # @option options [String] as polymorphic key, if the associated object's relationship is polymorphic
    # @option options [Boolean] embed if true, the data store will try to embed the data in the record (Mongodb currently)
    #
    # @return [Tower.ModelRelationHasMany]
    hasMany: (name, options = {}) ->
      if options.hasOwnProperty('through')
        @relations()[name]  = new Tower.ModelRelationHasManyThrough(@, name, options)
      else
        @relations()[name]  = new Tower.ModelRelationHasMany(@, name, options)

    # Many-to-one association, where the `id` is stored on this object.
    #
    # @param [String] name name of the association
    # @param [Object] options association options
    # @option options [String] as polymorphic key, if the associated object's relationship is polymorphic
    # @option options [Boolean] embed if true, the data store will try to embed the data in the record (Mongodb currently)
    #
    # @return [Tower.ModelRelationBelongsTo]
    belongsTo: (name, options) ->
      @relations()[name] = new Tower.ModelRelationBelongsTo(@, name, options)

    # Set of all relations for this model.
    #
    # @return [Object]
    relations: ->
      @metadata().relations

    # Find a relation by name, otherwise throw an error.
    #
    # @param [String] name
    #
    # @return [Tower.ModelRelation]
    relation: (name) ->
      relation = @relations()[name]
      throw new Error("Relation '#{name}' does not exist on '#{@name}'") unless relation
      relation

    # @todo tmp until this is figured out more,
    # need to handle subclassing in associations better.
    shouldIncludeTypeInScope: ->
      @baseClass().className() != @className()

  InstanceMethods:
    # @todo probably should remove, reduntant.
    getAssociation: (key) ->
      @constructor.relations()[key]

    # This lazily instantiates, caches, and returns an association scope.
    # 
    # This is considered a 'top-level' scope, meaning you chain queries and it will be
    # cloned like normal, but this original association scope will keep reference to the
    # loaded records (if they've been loaded). This way it can be used to create/update/delete
    # associated records, similar to the way attributes are managed.
    getAssociationScope: (key) ->
      @get("#{key}AssociationScope")

    getAssociationCursor: (key) ->
      @getAssociationScope(key).cursor

    # Currently only used for the `belongsTo` association.
    # 
    # It will make the async database call.
    # 
    # @example You must use `fetch` on the server b/c Mongodb is async.
    #   class App.Post extends Tower.Model
    #     @belongsTo 'user'
    #   
    #   App.Post.first (error, post) =>
    #     # fetch will set the 'user' property on post, 
    #     # so you can do `post.get('user')` next call.
    #     post.fetch 'user', (error, user) =>
    #
    # @example If you've loaded the record already on the client, use `get`
    #   App.Post.first (error, post) =>
    #     post.get('user')
    fetch: (key, callback) ->
      #record = @get(key)
      record = undefined
      
      #if record
      #  callback.call(@, null, record) if callback
      #else
      @getAssociationScope(key).first (error, result) =>
        record = result
        @set(key, record) if record && !error
        callback.call(@, error, record) if callback
        record
      
      record

    createAssocation: (name, args...) ->
      association = @getAssociationScope(name)
      association.create.apply(association, args)

    buildAssocation: (name, args...) ->
      association = @getAssociationScope(name)
      association.build.apply(association, args)

    destroyRelations: (callback) ->
      relations   = @constructor.relations()
      dependents  = []

      for name, relation of relations
        if relation.dependent == true || relation.dependent == 'destroy'
          dependents.push(name)

      iterator = (name, next) =>
        @get(name).destroy(next)

      Tower.async dependents, iterator, callback

    # @todo Find all the models/records that have an association pointing to this record.
    # For models with hasMany of this record, remove it from the array.
    # For models with hasOne of this record, clear the cache
    # For models with belongsTo pointing to this record, remove the id.
    notifyRelations: ->
      relations   = @constructor.relations()

      for name, relation of relations
        relation.inverse()

    # @private
    # @todo maybe this should be a custom `cursor.replace` method
    _setHasManyAssociation: (key, value, association, options = {}) ->
      cursor      = @getAssociationScope(key).cursor
      # @todo this should actually make a database call
      # @todo cursor.difference(value)
      value       = _.castArray(value)
      # @todo should be possible to accomplish the same thing with `cursor.build(value)`.
      #   also, it should set default properties from the cursor/defaultScope
      for item, i in value
        value[i]  = cursor.store.serializeModel(item) unless item instanceof Tower.Model

      # calculate difference
      # cursor.removeFromTarget(oldValues)
      if @get('isNew')
        @
      else
        # @todo find a better way to accomplish this
        cursor._markedForDestruction ||= []
        toRemove = cursor._markedForDestruction.concat()
        ids = []
        for item in value
          id = Ember.get(item, 'id')
          ids.push(id.toString()) if id?

        for item in cursor
          if @_checkAssociationRecordForDestroy(item, association)
            if _.indexOf(ids, item.get('id').toString()) == -1
              item.set(association.foreignKey, undefined)
              toRemove.push(item)

        cursor._markedForDestruction = toRemove if toRemove.length

      # @todo convert value into array of Tower.Model instances
      if value && value.length
        for item in value
          if item instanceof Tower.Model
            item.set(association.foreignKey, @get('id'))
          else if item == null || item == undefined
            @ # @todo
          else
            @ # @todo
        # @todo you don't actually want to remove them yet because previous ones haven't been deleted.
        #cursor.addObjects(value)
        cursor.load(value)
      else
        cursor.clear()
        #cursor.load(cursor.build(value, options))

    # @private
    _getHasManyAssociation: (key) ->
      @getAssociationScope(key)

    # @private
    # @todo tmp way
    _checkAssociationRecordForDestroy: (record, association) ->
      foreignId = record.get(association.foreignKey)
      id        = @get('id')
      foreignId? && id? && foreignId.toString() == id.toString() && !record.attributeChanged(association.foreignKey)

    # @private
    _setHasOneAssociation: (key, value, association) ->
      cursor          = @getAssociationCursor(key)
      existingRecord  = cursor[0]
      # need some way of keeping a reference to these to destroy them.
      # need to get the previous/database value from the associated record

      # @todo there needs to be a global observer setup for this
      # clearCursor = (exRecord, attribute) -> Ember.removeObserver(existingRecord, 'id', clearCursor)
      # Ember.addObserver(existingRecord, 'id', clearCursor)
      # Ember.addObserver(existingRecord, 'isDirty', clearCursor)
      # 
      # Say someone else saves the associated hasOne record, and the sockets send back the new attributes
      # for the record. Then we need to remove cursor._markedForDestruction because it was already changed.
      # Actually, in that case, would you want to provide a warning before saving? Not sure... For now though,
      # it will remove the attribute, so you need to setup temporary Ember observers:
      #   Ember.addObserver(obj, this._from, this, this.fromDidChange);
      #   @see Ember.Binding.prototype.connect method for twoWay binding implementation (its just observers)
      # Ember.addObserver(existingRecord, 'id', this, 'changed')
      # Ember.listenersFor(existingRecord, 'id:change')
      # Ember.listenersFor(existingRecord, 'id:change')
      # manually setup bindings
      # binding = Ember.bind(existingRecord, 'id', 'this.foreignId')
      # binding.disconnect(existingRecord)
      # 
      # For now, we can just assume you're eventually going to call save.

      # You could also just check if the record has any changes once you get to saving it from the owner.
      # If it doesn't then it probably got saved some other way, and you can just ignore _markedForDestruction.
      # But, the record may have been saved then re-dirtified somewhere else, then you call save on the owner...
      # it doesn't make sense at that time to then call save on the record because the changes came from somewhere else.
      if existingRecord && !cursor._markedForDestruction # should only happen once before a save
        # @todo maybe it should just be pushed into the cursor array, which you should never be accessing directly anyway.
        foreignId = existingRecord.get(association.foreignKey)
        id        = @get('id')
        if foreignId? && id? && foreignId.toString() == id.toString() && !existingRecord.attributeChanged(association.foreignKey)
          cursor._markedForDestruction = existingRecord

      if value instanceof Tower.Model
        record  = value
        value.set(association.foreignKey, @get('id'))
      else if value == null || value == undefined
        @ # @todo
      else
        @ # @todo

      if record
        cursor.clear()
        cursor.addObject(record)

      record

    # @private
    _getHasOneAssociation: (key) ->
      @getAssociationCursor(key)[0] || @fetch(key)

    # @private
    # 
    # @example
    #   record.setBelongsToAssociation('user', user)
    #   # in this case we need to do some rerouting
    #   record.setBelongsToAssociation('user', user.id)
    #   record.setBelongsToAssociation('user', null)
    # 
    # @todo pass association in as optimization (as first parameter)
    _setBelongsToAssociation: (key, value, association) ->
      if value instanceof Tower.Model
        record  = value
        id      = value.get('id')
        @set(association.foreignKey, id)
      else if value == null || value == undefined
        @set(association.foreignKey, undefined)
      else
        id      = value
        @set(association.foreignKey, id)

      if record
        cursor = @getAssociationCursor(key)
        cursor.clear()
        cursor.addObject(record)

      # need to notify the hasMany/hasOne in reverse from here

      record

    # @private
    _getBelongsToAssociation: (key) ->
      # @todo shouldn't use try, but testing out polymorphic assoc.
      @getAssociationCursor(key)[0] || try @fetch(key)

module.exports = Tower.ModelRelations
