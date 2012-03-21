Tower.Model.Relations =
  ClassMethods:
    # One-to-one association, where the id is stored on the associated object.
    #
    # @example Basic example
    #   class App.User extends Tower.Model
    #     @hasOne "address"
    #
    #   class App.Address extends Tower.Model
    #     @belongsTo "user"
    #
    #   user    = App.User.create()
    #   address = user.createAddress()
    #
    # @example Example using all the `hasOne` options
    #   class App.User extends Tower.Model
    #     @hasOne "location", type: "Address", embed: true, as: "addressable"
    #
    #   class App.Address extends Tower.Model
    #     @belongsTo "addressable", polymorphic: true
    hasOne: (name, options = {}) ->
      @relations()[name]  = new Tower.Model.Relation.HasOne(@, name, options)

    # One-to-many association, where the id is stored on the associated object.
    #
    # @example Basic example
    #   class App.User extends Tower.Model
    #     @hasMany "comments"
    #
    #   class App.Comment extends Tower.Model
    #     @belongsTo "user"
    #
    #   user    = App.User.create()
    #   comment = user.comments().create()
    #
    # @example Example using all the `hasMany` options
    #   class App.User extends Tower.Model
    #     @hasMany "comments", as: "commentable", embed: true
    #
    #   class App.Comment extends Tower.Model
    #     @belongsTo "commentable", polymorphic: true
    #
    # @param [String] name Name of the association
    # @param [Object] options Association options
    # @option options [String] as Polymorphic key, if the associated object's relationship is polymorphic
    # @option options [Boolean] embed If true, the data store will try to embed the data in the record (MongoDB currently)
    hasMany: (name, options = {}) ->
      @relations()[name]  = new Tower.Model.Relation.HasMany(@, name, options)

    belongsTo: (name, options) ->
      @relations()[name]  = new Tower.Model.Relation.BelongsTo(@, name, options)

    relations: ->
      @_relations ||= {}

    relation: (name) ->
      relation = @relations()[name]
      throw new Error("Relation '#{name}' does not exist on '#{@name}'") unless relation
      relation

  relation: (name) ->
    @relations[name] ||= @constructor.relation(name).scoped(@)

  buildRelation: (name, attributes, callback) ->
    @relation(name).build(attributes, callback)

  createRelation: (name, attributes, callback) ->
    @relation(name).create(attributes, callback)

  destroyRelations: ->

module.exports = Tower.Model.Relations
