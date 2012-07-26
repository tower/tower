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
        # @todo this isn't setup
        # @validate validationMethod

        mixin[validationMethod] = (callback) ->
          @[method](association, callback)

      @reopen(mixin)

  _beforeSaveCollectionAssociation: ->
    @newRecordBeforeSave = @get('isNew')
    true

  # Validate the association if <tt>:validate</tt> or <tt>:autosave</tt> is
  # turned on for the association.
  _validateSingleAssociation: (association, callback) ->
    cursor  = @getAssociationCursor(association.name)
    record  = cursor[0] if cursor # @todo assumes it's the array cursor, not Tower.Model.Cursor

    if record
      @_associationIsValid(association, record, callback)
    else
      callback.call(@) if callback
      true

  # Validate the associated records if <tt>:validate</tt> or
  # <tt>:autosave</tt> is turned on for the association specified by
  # +association+.
  _validateCollectionAssociation: (association, callback) ->
    success = undefined
    cursor  = @getAssociationCursor(association.name)
    records = @_associatedRecordsToValidateOrSave(cursor, @get('isNew'), association.autosave) if cursor

    if records && records.length
      # should be executed in parallel with Tower.parallel iterator
      iterate = (record, next) =>
        @_associationIsValid association, record, (error) =>
          success = !error unless success == false
          next()

      Tower.parallel records, iterate, =>
        callback.call(@, success) if callback
    else
      callback.call(@, true) if callback

    success

  # Returns whether or not the association is valid and applies any errors to
  # the parent, <tt>self</tt>, if it wasn't. Skips any <tt>:autosave</tt>
  # enabled records if they're marked_for_destruction? or destroyed.
  _associationIsValid: (association, record, callback) ->
    return true if record.get('isDeleted') || record.get('isMarkedForDestruction')

    record.validate =>
      # @todo handle this in Validations mixin
      error = _.isPresent(record.get('errors'))
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
          errors[association.name] = ['Invalid']

      success = !error

      callback.call(@, error) if callback

      success

  # Returns the record for an association collection that should be validated
  # or saved. If +autosave+ is +false+ only new records will be returned,
  # unless the parent is/was a new record itself.
  # 
  # @todo
  _associatedRecordsToValidateOrSave: (cursor, newRecord, autosave) ->
    if newRecord
      cursor
    else if autosave
      cursor.filter (record) -> record._changedForAutosave()
    else
      cursor.filter (record) -> record.get('isNew')

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
  _saveCollectionAssociation: (association, callback) ->
    @_removeOldAssociations association, (error) =>
      console.log error if error
      if cursor = @getAssociationCursor(association.name)
        autosave  = association.autosave
        wasNew    = !!@newRecordBeforeSave

        if records = @_associatedRecordsToValidateOrSave(cursor, wasNew, autosave)
          recordsToDestroy = []
          delete cursor._markedForDestruction
          foreignKey  = association.foreignKey
          key         = @get('id')

          # Should be done in parallel with Tower.parallel iterator
          # @todo this may want to be moved directly onto the cursor class
          createRecord = (record, next) => 
            if record.get('isDeleted')
              next()
            else if autosave && record.get('isMarkedForDestruction')
              recordsToDestroy.push(record)
            # autosave can be null/undefined/true/false
            else if autosave != false && (wasNew || record.get('isNew'))
              if autosave
                record.set(foreignKey, key)
                # should not validate
                # cursor.insert record, next
                record.save(validate: false, next)
              else if !association.nested
                record.set(foreignKey, key)
                record.save(next)
                # cursor.insert record, next
              else
                next()
            else if autosave
              record.set(foreignKey, key)
              record.save validate: false, next
            else
              next()

          Tower.parallel records, createRecord, (error) =>
            if error
              callback.call(@, error) if callback
              return false
            else if recordsToDestroy.length
              # This should also be done in parallel
              cursor.destroy recordsToDestroy, (error) =>
                callback.call(@, error) if callback
                return !error
            else
              callback.call(@) if callback
              return true
        else
          callback.call(@) if callback
          return true

      # reconstruct the scope now that we know the owner's id
      # associationScope.send(:reset_scope) if associationScope.respond_to?(:reset_scope)

  # @todo tmp
  _removeOldAssociations: (association, callback) ->
    cursor = @getAssociationCursor(association.name)
    records = cursor._markedForDestruction
    delete cursor._markedForDestruction

    if records && records.length
      iterate = (record, next) =>
        record.save (error) =>
          next(error)

      Tower.parallel records, iterate, (error) =>
        callback.call(@, error)
    else
      callback.call(@)

  # Saves the associated record if it's new or <tt>:autosave</tt> is enabled
  # on the association.
  #
  # In addition, it will destroy the association if it was marked for
  # destruction with mark_for_destruction.
  #
  # This all happens inside a transaction, _if_ the Transactions module is included into
  # Tower.Model after the AutosaveAssociation module, which it does by default.
  _saveHasOneAssociation: (association, callback) ->
    record  = @get(association.name)

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

            unless error # && associationScope.updated
              @set(association.foreignKey, record.get(association.primaryKey || 'id'))
              # associationScope.get('isLoaded')

            _.return(@, callback, error)
        else
          saved = true
          callback.call(@) if callback

        saved
      else
        callback.call(@) if callback
        true
    else
      callback.call(@) if callback
      true

module.exports = Tower.Model.AutosaveAssociation
