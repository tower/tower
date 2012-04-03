# @module
Tower.Model.Indexing =
  ClassMethods:
    # Add indexing to the model.
    # 
    # @todo
    # 
    # @example Simple field
    #   class App.User extends Tower.Model
    #     @index "ssn", unique: true, background: true
    # 
    # @example Indexing on multiple fields
    #   class App.User extends Tower.Model
    #     @index [["firstName", "asc"], ["lastName", "asc"]], unique: true
    # 
    # @example Embedded field
    #   class App.User extends Tower.Model
    #     @hasMany "locations", embed: true
    #     @index "locations.city"
    # 
    # @example Geospatial indexing
    #   class App.Location extends Tower.Model
    #     @field "coordinates", type: "Array"
    #     @index [["coordinates", "2d"]], min: 200, max: 200
    # 
    # @example Index a relationship
    #   class App.Location extends Tower.Model
    #     @belongsTo "user", index: true
    # 
    # @param [String] key name of the index
    # @param [Object] options name of the index
    # 
    # @option options [Boolean] unique whether the index has to be unique or not
    index: (key, options = {}) ->
      @metadata().indices[key] = options
    
module.exports = Tower.Model.Indexing
