Tower.Controller.Callbacks =
  ClassMethods:
    filters: ->
      @_filters ||= {before: [], after: []}
    
    # beforeFilter "method", key: "value"
    # beforeFilter (callback) -> "x"
    beforeFilter: ->
      args    = Tower.Support.Array.args(arguments)
      @filters().before.push method: args.shift(), options: args.shift()
      @
      
    afterFilter: ->
      
  runFilters: (block, callback) ->
    self          = @
    beforeFilters = @constructor.filters().before
    afterFilters  = @constructor.filters().after
    
    iterator = (filter, next) ->
      method = filter.method
      if typeof method == "string"
        throw new Error("Method '#{method}' not defined on #{self.constructor.name}") unless self[method]
        method = self[method]
        
      switch method.length
        when 0
          result = method.call self
          return next(new Error("did not pass filter")) unless result
          next()
        else
          method.call self, (error, result) ->
            return next(error) if error
            return next(new Error("did not pass filter")) unless result
            next()
    
    require('async').forEachSeries beforeFilters, iterator, (error) ->
      return callback(error) if error
      
      block.call self#, (error) ->
      #  
      #  async.forEachSeries afterFilters, iterator, (error) ->
      #    return false if error

module.exports = Tower.Controller.Callbacks
