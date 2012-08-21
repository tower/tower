# @todo Inspired from mongoid::versioning, http://railscasts.com/episodes/255-undo-with-paper-trail?view=asciicast
# @todo undo/redo example
Tower.ModelVersioning =
  ClassMethods:
    included: ->
      # Current version of the record
      @field 'version', type: 'Integer', default: 1

      # History of versions
      @hasMany 'versions', type: @className(), validate: false, cyclic: true, inverseOf: null, versioned: true, embedded: true

      @before 'save', 'revise', if: 'isRevisable'

    isCyclic:   true
    versionMax: undefined

    maxVersions: (number) ->
      @versionMax = parseInt(number)

  revise: (callback) ->
    @previousRevision (error, previous) =>
      if previous && @versionedAttributesChanged()
        versions    = @get('versions')
        newVersion  = versions.build(previous.get('versionedAttributes'), withoutProtection: true)
        versionMax  = @constructor.versionMax

        newVersion.set('id', null)
        @set('version', (@get('version') || 1 ) + 1)
        
        if versionMax?
          versions.count (error, count) =>
            if count > versionMax
              versions.first (error, deleted) =>
                if deleted.isParanoid
                  # do something different
                  callback.call(@)
                else
                  versions.destroy deleted, (error) =>
                    callback.call(@, error)
            else
              callback.call(@)
        else
          callback.call(@)
