Tower.Model.AutosaveAssociation =
  ClassMethods:
    _addAutosaveAssociationCallbacks: (association) ->
      name              = _.camelize(association.name)
      saveMethod        = "_autosaveAssociatedRecordsFor#{name}"
      validationMethod  = "_validateAssociatedRecordsFor#{name}"
      isCollection      = association.isCollection
      mixin             = {}

      # unless @methodDefined(saveMethod)
      if isCollection
        @before 'save', '_beforeSaveCollectionAssociation'

        # define_non_cyclic_method(saveMethod, association) { save_collection_association(association) }
        mixin[saveMethod] = (callback) ->
          @_saveCollectionAssociation(association, callback)

        # Doesn't use afterSave as that would save associations added in afterCreate/afterUpdate twice
        @after 'create', saveMethod
        @after 'update', saveMethod
      else if association.isHasOne
        # define_method(saveMethod) { save_has_one_association(association) }
        mixin[saveMethod] = (callback) ->
          @_saveHasOneAssociation(association, callback)
        # Configures two callbacks instead of a single after_save so that
        # the model may rely on their execution order relative to its
        # own callbacks.
        #
        # For example, given that after_creates run before after_saves, if
        # we configured instead an after_save there would be no way to fire
        # a custom after_create callback after the child association gets
        # created.
        @after 'create', saveMethod
        @after 'update', saveMethod
      else
        # define_non_cyclic_method(saveMethod, association) { save_belongs_to_association(association) }
        mixin[saveMethod] = (callback) ->
          @_saveBelongsToAssociation(association, callback)

        @before 'save', saveMethod

      if association.validate # && !@methodDefined(validationMethod)
        method = if isCollection then '_validateCollectionAssociation' else '_validateSingleAssociation'
        # define_non_cyclic_method(validationMethod, association) { send(method, association) }
        @validate validationMethod

        mixin[validationMethod] = -> @[method](association)

      @reopen(mixin)

  _beforeSaveCollectionAssociation: ->
    @newRecordBeforeSave = @get('isNew')
    true

  # Validate the association if <tt>:validate</tt> or <tt>:autosave</tt> is
  # turned on for the association.
  _validateSingleAssociation: (association) ->
    associationScope  = @getAssociationScope(association.name)
    record            = associationScope.reader if associationScope
    @_associationIsValid(associationScope, record) if record

  # Validate the associated records if <tt>:validate</tt> or
  # <tt>:autosave</tt> is turned on for the association specified by
  # +association+.
  _validateCollectionAssociation: (association) ->
    if associationScope = @getAssociationScope(association.name)
      if records = @_associatedRecordsToValidateOrSave(associationScope, @get('isNew'), associationScope.autosave)
        # should be executed in parallel with Tower.parallel iterator
        for record in records
          @_associationIsValid(association, record)

  # Returns whether or not the association is valid and applies any errors to
  # the parent, <tt>self</tt>, if it wasn't. Skips any <tt>:autosave</tt>
  # enabled records if they're marked_for_destruction? or destroyed.
  _associationIsValid: (association, record, callback) ->
    return true if record.get('isDeleted') || record.get('isMarkedForDestruction')

    record.validate (error) =>
      if error
        errors = @get('errors')
        if association.autosave
          for attribute, messages of record.get('errors')
            attribute = "#{association.name}.#{attribute}"
            array = errors[attribute] ||= []
            for message in messages
              array.push(message)
            errors[attribute] = _.uniq(array)
        else
          errors[association.name] = 'Something not right (todo)'

      callback.call(@, !error) if callback

      !error

  # Returns the record for an association collection that should be validated
  # or saved. If +autosave+ is +false+ only new records will be returned,
  # unless the parent is/was a new record itself.
  # 
  # @todo
  _associatedRecordsToValidateOrSave: (association, newRecord, autosave) ->
    if newRecord
      association && association.target # need to have one main association on the model instance, which you can still chain.
    else if autosave
      association.target.findAll (record) -> record.changedForAutosave()
    else
      association.target.findAll (record) -> record.get('isNew')

  _changedForAutosave: ->
    @get('isNew') || @get('isDirty') || @get('isMarkedForDestruction') || @_nestedRecordsChangedForAutosave()

  # @todo this looks like a pretty expensive method.
  _nestedRecordsChangedForAutosave: ->
    _.any @constructor.relations(), (association) =>
      association = @getAssociationScope(association.name)
      association && _.any(_.compact(_.castArray(association.target)), (a) -> a._changedForAutosave())

  # Saves any new associated records, or all loaded autosave associations if
  # <tt>:autosave</tt> is enabled on the association.
  #
  # In addition, it destroys all children that were marked for destruction
  # with `isMarkedForDestruction: true`.
  #
  # This all happens inside a transaction, _if_ the Transactions module is included into
  # Tower.Model after the AutosaveAssociation module, which it does by default.
  _saveCollectionAssociation: (association) ->
    if associationScope = @getAssociationScope(association.name)
      autosave  = association.autosave
      wasNew    = !!@newRecordBeforeSave

      if records = @_associatedRecordsToValidateOrSave(associationScope, wasNew, autosave)
        recordsToDestroy = []

        # Should be done in parallel with Tower.parallel iterator
        for record in records
          continue if record.get('isDeleted')

          saved = true

          if autosave && record.get('isMarkedForDestruction')
            recordsToDestroy.push(record)
          # autosave can be null/undefined/true/false
          else if autosave != false && (wasNew || record.get('isNew'))
            if autosave
              saved = associationScope.insertRecord(record, false)
            else
              associationScope.insertRecord(record) unless association.nested
          else if autosave
            saved = record.save(validate: false)

          throw new Error('rolled back') unless saved

        # This should also be done in parallel
        for record in recordsToDestroy
          associationScope.destroy(record)

      # reconstruct the scope now that we know the owner's id
      # associationScope.send(:reset_scope) if associationScope.respond_to?(:reset_scope)

  # Saves the associated record if it's new or <tt>:autosave</tt> is enabled
  # on the association.
  #
  # In addition, it will destroy the association if it was marked for
  # destruction with mark_for_destruction.
  #
  # This all happens inside a transaction, _if_ the Transactions module is included into
  # Tower.Model after the AutosaveAssociation module, which it does by default.
  _saveHasOneAssociation: (association, callback) ->
    associationScope  = @getAssociationScope(association.name)
    record            = @get(association.name) # associationScope.load_target if associationScope

    if record && !record.get('isDeleted')
      autosave = association.autosave

      if autosave && record.get('isMarkedForDestruction')
        record.destroy(callback)
      else
        key         = @get(if association.primaryKey then association.primaryKey else 'id')
        foreignKey  = association.foreignKey

        if autosave != false && !@get('isNew') && (record.get('isNew') || record.get(foreignKey) != key)
          unless association.isHasManyThrough
            record.set(foreignKey, key)

          record.save validate: !autosave, (error) =>
            callback.call(@, error)
            !error
        else
          callback.call(@)
    else
      callback.call(@) if callback
      true

  # Saves the associated record if it's new or `autosave` is enabled.
  #
  # In addition, it will destroy the association if it was marked for destruction.
  _saveBelongsToAssociation: (association, callback) ->
    #associationScope  = @getAssociationScope(association.name)
    #record            = associationScope && associationScope._getRecord()
    record = @get(association.name)

    if record && !record.get('isDeleted')
      autosave = association.autosave

      if autosave && record.get('isMarkedForDestruction')
        record.destroy(callback)
      else if autosave != false
        saved = false

        if record.get('isNew') || (autosave && record._changedForAutosave())
          record.save validate: !autosave, (error) =>
            saved = !error

            if !error # && associationScope.updated
              @set(association.foreignKey, record.get(association.primaryKey || 'id'))
              # associationScope.get('isLoaded')

            callback.call(@, error) if callback

        saved
    else
      callback.call(@) if callback
      true

module.exports = Tower.Model.AutosaveAssociation
