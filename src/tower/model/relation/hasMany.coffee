class Tower.Model.Relation.HasMany extends Tower.Model.Relation
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
  
  class @Scope extends @Scope
    # user.posts().create() # owner == user, foreignKey == userId, foreignKeys == userIds, foreignType == User
    # need to handle if owner.type changes
    create: ->
      unless @owner.isPersisted()
        throw new Error("You cannot call create unless the parent is saved")
        
      relation = @relation
      
      {criteria, attributes, options, callback} = @_extractArgs(arguments, attributes: true)
      
      id = @owner.get("id")
      
      if relation.foreignKey
        attributes[relation.foreignKey]     = id if id != undefined
        # must check here if owner is instance of foreignType
        attributes[relation.foreignType]  ||= @owner.constructor.name if @relation.foreignType
      
      # add the id to the array on the owner record
      if relation.cacheKey
        array = attributes[relation.cacheKey] || []
        array.push(id) if array.indexOf(id) == -1
        attributes[relation.cacheKey] = array
      
      # expect(attributes).toNotEqual { userId: 1, userIds: [1] }
      # Post.hasMany "users", cache: true
      # User.hasMany "posts", cache: true, inverseOf: "users", polymorphic: true, counterCache: true
      # Use `cache` when you don't care about _when_ the association was created, you just want the ids
      # expect(attributes).toEqual { userIds: [1] }
      # expect(attributes).toEqual { postIds: [{id: 1, type: "BlogPost"}], postCount: 10 }
      
      # This is right, but maybe you shouldn't be allowed?
      # Post.hasMany "users", cache: true, polymorphic: true
      # User.hasMany "posts", cache: true, counterCache: true
      # expect(attributes).toEqual { userIds: [{id: 1, type: "User"}] }
      # expect(attributes).toEqual { postIds: [1], postCount: 10 }
      
      # This is right
      # User.hasMany "posts"
      # Post.belongsTo "user", embed: true
      # expect(attributes).toEqual { posts: [{id: 1, createdAt: Date}], postCount: 1 }
      
      # This is right
      # User.hasMany "posts"
      # Post.belongsTo "user"
      # expect(attributes).toEqual { }
      # expect(attributes).toEqual { userId: 1 }
      
      # This is right
      # User.hasMany "posts", cache: true
      # Post.belongsTo "user"
      # expect(attributes).toEqual { postIds: [1] }
      # expect(attributes).toEqual { userId: 1 }
      
      # DOESNT WORK, BOTH MUST BE CACHE!  Well, it will work because auto-infer cache from relationship (if either has it and they're both hasMany)
      # User.hasMany "posts"
      # Post.hasMany "users", cache: true
      # expect(attributes).toEqual { }
      # expect(attributes).toEqual { userIds: [1] }
      
      # DOES WORK!
      # User.hasMany "posts", cache: true
      # Post.hasMany "users", cache: true
      # expect(attributes).toEqual { postIds: [1] }
      # expect(attributes).toEqual { userIds: [1] }
      
      # Post.hasMany "users", cache: true
      # User.hasMany "posts", cache: true, inverseOf: "users", polymorphic: true, counterCache: true
      # expect(attributes).toEqual { id: 0, userId: 1, postId: 1 }
      # expect(attributes).toEqual { }
      # expect(attributes).toEqual { }
      
      # This is right
      # User.hasMany "postings"
      # User.hasMany "posts", through: "postings"
      # Post.hasMany "postings"
      # Post.hasMany "users", through: "postings"
      # Posting.belongsTo "user"
      # Posting.belongsTo "post"
      # expect(attributes).toEqual { id: 0, userId: 1, postId: 1 }
      # expect(attributes).toEqual { }
      # expect(attributes).toEqual { }
      
      # If `embed` is specified on either side of the relationship it's used
      # User.hasMany "postings"
      # User.hasMany "posts", through: "postings"
      # Post.hasMany "postings"
      # Post.hasMany "users", through: "postings"
      # Posting.belongsTo "user", embed: true
      # Posting.belongsTo "post", embed: true
      # expect(attributes).toEqual { postings: [{id: 1, postId: 1}] }
      # expect(attributes).toEqual { postings: [{id: 1, userId: 10}] }
      
      # If `embed` is specified on either side of the relationship it's used
      # User.hasMany "postings"
      # User.hasMany "posts", through: "postings"
      # Post.hasMany "postings"
      # Post.hasMany "users", through: "postings"
      # Posting.belongsTo "user"
      # Posting.belongsTo "post", embed: true
      # expect(attributes).toEqual { postings: [{id: 1, postId: 1}] }
      # expect(attributes).toEqual { }
      
      # If `embed` is specified on either side of the relationship it's used
      # User.hasMany "postings", embed: true
      # User.hasMany "posts", through: "postings"
      # Post.hasMany "postings"
      # Post.hasMany "users", through: "postings"
      # Posting.belongsTo "user"
      # Posting.belongsTo "post"
      # expect(attributes).toEqual { postings: [{id: 1, postId: 1}] }
      # expect(attributes).toEqual { }
      
      # The above 4 produce the same results
      
      criteria.mergeAttributes(attributes)
      criteria.mergeOptions(options)
      
      @_create criteria.toCreate(), criteria.options, (error, record) => 
        unless error
          if relation && (relation.cache || relation.counterCache)
            push  = {}
            push[relation.cacheKey] = record.get("id") if relation.cache
            inc   = {}
            inc[relation.counterCacheKey] = 1
            @owner.updateAttributes "$push": push, "$inc": inc, callback
          else
            callback.call @, error, record if callback
        else
          callback.call @, error, record if callback
          
    update: ->
      {criteria, attributes, options, callback} = @_extractArgs(arguments, attributes: true)
      
      unless @owner.isPersisted()
        throw new Error("You cannot call update unless the parent is saved")
      
    destroy: ->
      
    concat: ->
    
    createRecord: (attributes, options, raise = false, callback) ->
      unless @owner.isPersisted()
        throw new Error("You cannot call create unless the parent is saved")
      
      if _.isArray(attributes)
        result = []
        for object in attributes
          result.push @createRecord(object, options, raise, callback)
        result
      else
        @transaction ->
          @addToTarget @buildRecord(attributes, options), (record) =>
            callback.call @, null, record if callback
            @insertRecord(record, true, raise)
      
    replace: (otherArray) ->
      if @owner.isNew()
        @replaceRecords(otherArray, originalTarget)
      else
        @transaction =>
          @replaceRecords(otherArray, originalTarget)
          
    _serializeAttributes: (attributes = {}) ->
      target = Tower.constant(@relation.targetClassName)
      
      for name, relation of target.relations()
        if attributes.hasOwnProperty(name)
          value = attributes[name]
          delete attributes[name]
          if relation instanceof Tower.Model.Relation.BelongsTo
            attributes[relation.foreignKey] = value.id
            attributes[relation.foreignType] = value.type if relation.polymorphic
            
      attributes
      
    toCriteria: ->
      criteria  = super
      relation  = @relation
      if relation.cache
        defaults = {}
        defaults[relation.foreignKey + "s"] = $in: [@owner.get("id")]
        criteria.where defaults
      criteria
  
module.exports = Tower.Model.Relation.HasMany
