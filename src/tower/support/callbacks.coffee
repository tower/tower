# @todo
Tower.Support.Callbacks =
  ClassMethods:
    # (name, filterList, block) ->
    setCallback: (name) ->
      mapped = null
      
      @_updateCallbacks name, filter_list, block, (target, chain, type, filters, options) ->
        mapped ||= filters.map (filter) ->
          Callback.new(chain, filter, type, options.dup, self)

        filters.each (filter) ->
          chain.delete_if (c) -> c.matches?(type, filter)
        
        if options.prepend then chain.unshift(mapped.reverse) else chain.push(mapped)

        target["_#{name}Callbacks"] = chain
    
    resetCallbacks: (name) ->
      
    # This is used internally to append, prepend and skip callbacks to the
    # CallbackChain.
    #
    _updateCallbacks: (name, filters = [], block = nil) ->
      type    = if filters.first.in?(["before", "after", "around"]) then filters.shift else "before"
      options = if filters.last.is_a?(Hash) then filters.pop else {}
      filters.unshift(block) if block
      
      targets = [@] + Tower.Support.DescendantsTracker.descendants(@)
      
      for target in targets
        chain = target["_#{name}Callbacks"]
        yield target, chain.dup, type, filters, options
        target._defineCallback(name)
    
    defineCallbacks: (callbacks...) ->
      options = if typeof callbacks[callbacks.length - 1] == "object" then callbacks.pop() else {}
      
    _defineCallback: (name) ->
      body = send("_#{symbol}_callbacks").compile
      
      @["_run#{Tower.Support.String.camelize(name)}Callbacks"] = (key = null, block) ->
        
  
  # runCallbacks "save", ->
  runCallbacks: (kind) ->
    @["_run#{Tower.Support.String.camelize(kind)}Callbacks"]

module.exports = Tower.Support.Callbacks
