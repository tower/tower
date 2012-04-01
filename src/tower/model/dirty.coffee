# @module
Tower.Model.Dirty =
  # @example simple sequence of operations
  #   post.set title: "A Post!"
  #   post.set tags: ["javascript"]
  #   post.operations
  #     #=> [{$set: {title: "A Post!"}}, {$set: {tags: ["javascript"]}}]
  # 
  # @example combining operations
  #   post.operation ->
  #     post.set title: "A Post!"
  #     # it's in the post's context, so same thing
  #     @set tags: ["javascript"]
  #   post.operations
  #     #=> [{$set: {title: "A Post!", tags: ["javascript"]}}]
  # 
  # @example implicit operations
  #   post.set title: "A Post!", tags: ["javascript"]
  #   post.operations
  #     #=> [{$set: {title: "A Post!", tags: ["javascript"]}}]
  operation: (block) ->
    return block() if @_currentOperation
    
    if @operationIndex != @operations.length
      @operations.splice(@operationIndex, @operations.length)
    
    @_currentOperation  = {}
    
    completeOperation = =>
      @operations.push @_currentOperation
      delete @_currentOperation
      @operationIndex = @operations.length
    
    switch block.length
      when 0
        block.call(@)
        completeOperation()
      else
        block.call @, => completeOperation()
        
  undo: (amount = 1) ->
    prevIndex   = @operationIndex
    nextIndex   = @operationIndex = Math.max(@operationIndex - amount, -1)
    return if prevIndex == nextIndex
    operations  = @operations.slice(nextIndex, prevIndex).reverse()
    for operation in operations
      for key, value of operation.$before
        @attributes[key] = value
    @
  
  redo: (amount = 1) ->
    prevIndex   = @operationIndex
    nextIndex   = @operationIndex = Math.min(@operationIndex + amount, @operations.length)
    return if prevIndex == nextIndex
    operations  = @operations.slice(prevIndex, nextIndex)
    
    for operation in operations
      for key, value of operation.$after
        @attributes[key] = value
    @

  # Check if the model has any attributes that have been changed.
  # 
  # @return [Boolean]
  isDirty: ->
    _.isPresent(@changes)
  
  attributeChanged: (name) ->
    {before, after} = @changes
    return false if _.isBlank(before)
    before  = before[name]
    
    for key, value of after
      if value.hasOwnProperty(name)
        after = value
        break
        
    return false unless after
    before != after

  attributeChange: (name) ->
    change = @changes[name]
    return undefined unless change
    change[1]

  attributeWas: (name) ->
    change = @changes.before[name]
    return undefined if change == undefined
    change

  resetAttribute: (name) ->
    array = @changes[name]
    @set(name, array[0]) if array
    @

  toUpdates: ->
    result      = {}
    attributes  = @attributes
    
    for key, array of @changes
      result[key] = attributes[key]

    result.updatedAt ||= new Date

    result

  # @private
  _attributeChange: (attribute, value) ->
    array       = @changes[attribute] ||= []
    beforeValue = array[0] ||= @attributes[attribute]
    array[1]    = value
    array       = null if array[0] == array[1]

    if array then @changes[attribute] = array else delete @changes[attribute]

    beforeValue
  
  # @private
  _resetChanges: ->
    @changes =
      before: {}
      after:  {}

module.exports = Tower.Model.Dirty
