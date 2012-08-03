Tower.ModelNestedAttributes =
  ClassMethods:
    acceptsNestedAttributesFor: (keys...) ->
      mixin = {}

      for key in keys
        mixin["#{key}Attributes"] = @_defineMethodForNestedAttributes(key)

      @reopen(mixin)

    # @private
    _defineMethodForNestedAttributes: (key) ->
      relation = @relation(key)
      relation.autosave = true
      @_addAutosaveAssociationCallbacks(relation)
      type = _.camelize(relation.relationType)

      (attributes, massAssignmentOptions = {}) ->
        @["_assignNestedAttributesFor#{type}Association"](key, attributes, massAssignmentOptions)

  # @protected
  _assignNestedAttributesForCollectionAssociation: (key, attributesCollection, assignmentOptions) ->
    unless _.isHash(attributesCollection) || _.isArray(attributesCollection)
      throw new Error("Hash or Array expected, got #{_.camelize(_.kind(attributesCollection))}", attributesCollection)

    options = {}# self.nested_attributes_options[key]
    limit   = options.limit

    # if limit && attributesCollection.size > limit
    #  throw new Error("Maximum #{limit} records are allowed. Got #{attributesCollection.size} records instead.")

    attributesCollection = _.castArray(attributesCollection) # not sure what this means: _.values(attributesCollection)

    #association = @relation(key)
    association = @constructor.relations()[key].scoped(@)

    existingRecords = if association.isLoaded
      association.target
    else
      attributeIds = _.map(attributesCollection, (i) -> i.id)
      if _.isEmpty(attributeIds)
        attributeIds
      else
        association.where(association.cursor.relation.klass().primaryKey, attributeIds)

    for attributes in attributesCollection
      if _.isBlank(attributes['id'])
        unless @_callRejectIf(key, attributes)
          association.build(_.except(attributes, @_unassignableKeys(assignmentOptions)), assignmentOptions)
      else if existingRecord = _.detect(existingRecords, (record) -> record.id.toString() == attributes['id'].toString())
        rejected = @_callRejectIf(key, attributes)

        unless association.isLoaded || rejected
          # Make sure we are operating on the actual object which is in the association's
          # proxy_target array (either by finding it, or adding it if not found)
          targetRecord = _.detect(association.target, (record) -> record.equals(existingRecord))

          if targetRecord
            existingRecord = targetRecord
          else
            association.addToTarget(existingRecord)

        if !rejected
          @_assignToOrMarkForDestruction(existingRecord, attributes, options.allow_destroy, assignmentOptions)
      else if assignmentOptions.withoutProtection
        association.build(_.except(attributes, @_unassignableKeys(assignmentOptions)), assignmentOptions)
      else
        @#raise_nested_attributes_record_not_found(key, attributes['id'])

  # @protected
  _assignNestedAttributesForSingularAssociation: (key, attributes, assignmentOptions = {}) ->
    options     = {} # @nested_attributes_options[key]
    hasId       = !_.isBlank(attributes['id'])
    record      = @get(key)
    updatable   = !!(options.updateOnly || (hasId && record && record.get('id').toString() == attributes['id'].toString()))
    rejected    = @_callRejectIf(key, attributes)

    if updatable && !rejected
      @_assignToOrMarkForDestruction(record, attributes, options.allowDestroy, assignmentOptions)
    else if !hasId && !assignmentOptions.withoutProtection
      @ #raise_nested_attributes_record_not_found(key, attributes['id'])
    else if !rejected
      association = @getAssociationScope(key)
      if association
        association.build(_.except(attributes, @_unassignableKeys(assignmentOptions)), assignmentOptions)
      else
        throw new Error("Cannot build association #{key}. Are you trying to build a polymorphic one-to-one association?")

  # Updates a record with the +attributes+ or marks it for destruction if
  # +allow_destroy+ is +true+ and has_destroy_flag? returns +true+.
  # @private
  _assignToOrMarkForDestruction: (record, attributes, allowDestroy, assignmentOptions) ->
    record.assignAttributes(_.except(attributes, @_unassignableKeys(assignmentOptions)), assignmentOptions)
    record.markForDestruction() if @_hasDestroyFlag(attributes) && allowDestroy

  # @private
  _callRejectIf: (key, attributes) ->
    return false if @_hasDestroyFlag(attributes)
    callback = null#@nested_attributes_options[key].rejectIf
    
    switch typeof(callback)
      when 'string'
        @[callback].call(@, attributes)
      when 'function'
        callback.call(@, attributes)

  # @private
  _unassignableKeys: (assignmentOptions) ->
    if assignmentOptions.withoutProtection then ['_destroy'] else ['id', '_destroy']

  # @private
  _hasDestroyFlag: (attributes) ->
    attributes.hasOwnProperty('_destroy')

module.exports = Tower.ModelNestedAttributes
