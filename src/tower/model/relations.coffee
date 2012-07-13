# @mixin
Tower.Model.Relations =
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
    #   user    = App.User.insert()
    #   address = user.get('address').insert()
    #
    # @example Example using all the `hasOne` options
    #   class App.User extends Tower.Model
    #     @hasOne 'location', type: 'Address', embed: true, as: 'addressable'
    #
    #   class App.Address extends Tower.Model
    #     @belongsTo 'addressable', polymorphic: true
    hasOne: (name, options = {}) ->
      @relations()[name]  = new Tower.Model.Relation.HasOne(@, name, options)

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
    #   comment = user.get('comments').insert()
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
    # @return [Tower.Model.Relation.HasMany]
    hasMany: (name, options = {}) ->
      if options.hasOwnProperty('through')
        @relations()[name]  = new Tower.Model.Relation.HasManyThrough(@, name, options)
      else
        @relations()[name]  = new Tower.Model.Relation.HasMany(@, name, options)

    # Many-to-one association, where the `id` is stored on this object.
    #
    # @param [String] name name of the association
    # @param [Object] options association options
    # @option options [String] as polymorphic key, if the associated object's relationship is polymorphic
    # @option options [Boolean] embed if true, the data store will try to embed the data in the record (Mongodb currently)
    #
    # @return [Tower.Model.Relation.BelongsTo]
    belongsTo: (name, options) ->
      @relations()[name] = new Tower.Model.Relation.BelongsTo(@, name, options)

    # Set of all relations for this model.
    #
    # @return [Object]
    relations: ->
      @metadata().relations

    # Find a relation by name, otherwise throw an error.
    #
    # @param [String] name
    #
    # @return [Tower.Model.Relation]
    relation: (name) ->
      relation = @relations()[name]
      throw new Error("Relation '#{name}' does not exist on '#{@name}'") unless relation
      relation

    # tmp until this is figured out more,
    # need to handle subclassing in associations better.
    shouldIncludeTypeInScope: ->
      @baseClass().className() != @className()

  InstanceMethods:
    getRelation: (key) ->
      @get(key)

    getAssociation: (key) ->
      @get("#{key}Association")

    getAssociationScope: (key) ->
      @getAssociation(key)

    getHasManyAssociation: (key) ->
      @getAssociation(key)

    setHasManyAssociation: (key, value) ->
      #data = Ember.get(@, 'data')
      #data.set(key, value)

    setHasOneAssociation: (key, value) ->
      data = Ember.get(@, 'data')
      data.set(key, value)
      relation        = @constructor.relation(key)
      foreignKey      = relation.foreignKey
      # set belongsTo id on associated object
      value.set(foreignKey, @get('id'))
      value

    getHasOneAssociation: (key) ->
      data  = Ember.get(@, 'data')
      value = data.get(key)
      value = @fetch(key) unless value?
      value

    setBelongsToAssociation: (key, value) ->
      data      = Ember.get(@, 'data')
      oldValue  = data.get("#{key}Id")
      
      if value instanceof Tower.Model
        newValue  = value.get('id')
        data.set("#{key}Id", newValue)
      else if value == null || value == undefined
        data.set("#{key}Id", value)
      else
        newValue  = value
        data.set(key, value)

      if Tower.isClient
        # This is notifying the hasMany associations.
        # Really, it should notify the "scopes" or "cursors"
        # that have been registered on the client app.
        # 
        # Better yet, whenever _any_ property changes on a model,
        # you want to run it through all the registered scopes.
        # Some scopes may sort records, others may select ones matching
        # certain fields, etc. So the ideal would be to have a map
        # of model properties to scopes watching those properties.
        # This way, when a model property changes, you find all scopes that need to be updated like:
        #   Tower.scopes[modelName][fieldName].refresh()
        notifyRecord = (id) =>
          relation        = @constructor.relation(key)
          inverseRelation = relation.inverse()
          record          = relation.klass().find(id)
          record.propertyDidChange(inverseRelation.name) if record && inverseRelation

        # notify oldValue that it's no longer associated
        notifyRecord(oldValue) if oldValue && oldValue != newValue
        notifyRecord(newValue) if newValue

      value

    getBelongsToAssociation: (key) ->
      data  = Ember.get(@, 'data')
      value = data.get(key)
      value = @fetch(key) unless value?
      value

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
      @getAssociation(key).first (error, result) =>
        record = result
        @set(key, record) if record && !error
        callback.call(@, error, record) if callback
        record
      
      record

    relation: (name) ->
      @relations[name] ||= @constructor.relation(name).scoped(@)

    createAssocation: (name, args...) ->
      association = @getAssociation(name)
      association.create.apply(association, args)

    buildAssocation: (name, args...) ->
      association = @getAssociation(name)
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

module.exports = Tower.Model.Relations
