# @todo Going to break tower into smaller sub-projects similar to Ember at some point.
Tower.AttachmentProcessingMixin =
  included: ->
    @field 'fingerprint', type: 'String'
    # This gets set to true after the background job has processed the file
    @field 'processed',   type: 'Boolean', default: false

    @protected 'processed'

    @before 'save', 'prepareForDestroy'
    @before 'save', 'setAttachmentAttributes'

    @after 'save', 'destroyOldFiles'
    @after 'save', 'saveFiles'

    @before 'destroy', 'prepareForDestroy'
    @after 'destroy', 'destroyFiles'

    @defaults
      defaultStyle:           'original'
      defaultUrl:             '/uploads/:class-:style/missing.png'
      restrictedCharacters:   /[&$+,\/:;=?@<>\[\]\{\}\|\\\^~%# ]/
      # So people can't guess the urls
      # hashData:              ':class/:id/:style/:updatedAt'
      # hashDigest:            'SHA1'
      onlyProcess:            []
      path:                   ':root/public:url'
      preserveFiles:          false
      processors:             ['thumbnail']
      storage:                'filesystem'
      styles:                 {}
      # @todo if you switch your urls, it should know how to delete the old files
      #   (maybe stores a json file in tmp directory with old config)
      url:                    '/uploads/:class/:style/:name' # '/uploads/:class/:name-:style-:geometry.:format'

  ClassMethods:
    DELAYED_POST_PROCESSING: false

    parseDimensions: (string) ->
      string.match(/\b(\d*)x?(\d*)\b([\>\<\#\@\%^!])?/i)

      width: RegExp.$1, height: RegExp.$2, modifier: RegExp.$3

    # Called from the background job, which finds the instance and postprocesses it.
    postProcessAndSave: (id, callback) ->
      @find id, (error, record) =>
        record.postProcessAndSave(callback)

    # Adds a new class method to the class
    # 
    # @todo for each style, it should create a nested model (e.g. thumb/medium/large)
    # that we can save properties for if desired (embedded docs).
    styles: (styles) ->
      @reopen styles: Ember.computed(->
        _.extend({}, styles)
      ).cacheable()

  isUploading: false

  files: Ember.computed((key, value) ->
    if arguments.length == 2
      {original: value[0]}
    else
      {}
  ).cacheable()

  # https://github.com/rsms/node-imagemagick/
  processors: #Ember.computed(->).cacheable()
    [
      # thumbnail processor
      (file, style, callback) ->
        im      = require('imagemagick')
        temp    = require('temp')
        fs      = require('fs')

        newPath = file.path + style[0]
        parts   = file.filename.split('.')
        ext     = parts.pop()
        newName = parts.join('.') + style[0] + '.' + ext

        {width, height} = @constructor.parseDimensions(style[0])

        # @todo abstract away
        createTempFile = (opts, callback) =>
          temp.open opts, (error, info) =>
            # don't need to write anything, just create
            fs.close info.fd, (error) =>
              callback(error, info)

        createTempFile {suffix: ".#{ext}"}, (error, info) =>
          options =
            # @todo what is more optimized if this gets executed multiple times for the same "original",
            #   passing in srcData or srcPath?
            #srcData: file._data
            srcPath:  file.path
            width:    width
            height:   height
            dstPath:  info.path
            # format:   style[1] || ext

          im.resize options, (error) =>
            info.filename = newName
            info.mime     = file.mime
            # info.temp     = true
            callback.call(@, error, info)
    ]

  prepareForDestroy: ->
    return if @constructor.defaults().preserveFiles || @get('isNew') #!@get('files').original
    
    paths   = []
    styles  = _.keys @get('styles')
    styles.push('original') if _.indexOf(styles, 'original') == -1

    for style in styles
      path = @urlFor(style, true)
      paths.push(path) if path?

    Ember.set(@, '_queuedForDestroy', paths)

    # @setProperties(name: null, contentType: null, size: null, fingerprint: null, updatedAt: null)

    undefined

  destroyFiles: ->

  destroyOldFiles: (callback) ->
    paths = Ember.get(@, '_queuedForDestroy')

    delete @_queuedForDestroy

    if paths && paths.length
      @constructor.fileStore.destroy paths, callback
    else
      callback()

  # @todo Might want to make these accessible from the thumbnails as well
  setAttachmentAttributes: (callback) ->
    file = @get('files').original
    
    if file
      Ember.beginPropertyChanges()

      @set('name', @_sanitizeFilename(file.name)) unless @get('name')?
      @set('contentType', file.mime) unless @get('contentType')?
      @set('size', file.length) unless @get('size')?

      # @todo calculate md5 digest
      # @set('fingerprint', file.print) unless @get('fingerprint')?
      
      unless @get('width')? && @get('height')?
        # @todo imagemagick library needs to be updated to use `close` event instead of `exit`.
        # I manually changed this in the local node module.
        require('imagemagick').identify file.path, (error, features) =>
          @set('width', features.width)
          @set('height', features.height)

          Ember.endPropertyChanges()

          callback()
      else
        callback()
    else
      callback()

    undefined

  # @todo should this be a generic attribute helper (cleaning strings in general)?
  _sanitizeFilename: (string) ->
    restricted = @constructor.defaults().restrictedCharacters
    if restricted
      string.replace(restricted, '-')
    else
      string

  # If you have async operations enabled in Tower, it will enqueue
  # the post processing of the files, and only save the original to wherever it needs
  # to be saved (s3 or file system by default). Otherwise, it will post process 
  # them in the after save callback.
  saveFiles: (callback) ->
    # first, save original file (to s3 or file system)
    @saveFile 'original', (error) =>
      # then, if background processing is enabled, run in background job
      if @constructor.DELAYED_POST_PROCESSING
        @enqueue 'postProcessAndSave', @get('id'), callback
      else
        @postProcessAndSave(callback)

  # This is what you want to call in the background job
  postProcessAndSave: (callback) ->
    @postProcess (error) =>
      styleNames  = _.keys(@get('files'))

      saveFile = (styleName, next) =>
        return next() if styleName == 'original'
        @saveFile(styleName, next)

      Tower.series styleNames, saveFile, callback

  saveFile: (styleName, callback) ->
    @set('isUploading', true)

    files = @get('files')
    # @todo this pattern, getting property and deleting, is `object.delete(:prop)` in rails, 
    # maybe make an underscore helper, `_.remove(obj, styleName)` which deletes and returns
    file  = files[styleName]
    # delete files[styleName]
    file.to ||= @urlFor(styleName)

    @constructor.fileStore.create file, (error) =>
      # if file.isTemp ...
      @set('isUploading', false)
      #require('fs').unlink file.path, =>
      callback.call(@, error) if callback

    undefined

  postProcess: (callback) ->
    styles      = @get('styles')
    styleNames  = _.keys(styles)
    files       = @get('files')
    file        = files.original

    file._data ||= require('fs').readFileSync(file.path, 'binary')

    postProcessIterator = (styleName, styleComplete) =>
      return styleComplete() if styleName == 'original'

      style       = styles[styleName]
      processors  = style.processors
      processors ||= @get('processors')
      file        = files.original

      processorIterator = (processor, processorComplete) =>
        # processor = (file, options, callback) ->
        #   # generatThumb...
        processor.call @, file, style, (error, resultFile) =>
          files[styleName] = file = resultFile # the next processor gets the output from the previous
          processorComplete(error)

      Tower.series processors, processorIterator, styleComplete

    Tower.series styleNames, postProcessIterator, callback

  urlFor: (style, oldValue) ->
    @_parsePath(@constructor.defaults().url, style, oldValue)

  pathFor: (style, oldValue) ->
    @_parsePath(@constructor.defaults().path, style, oldValue)

  _parsePath: (path, style, oldValue) ->
    data = @get('styles')[style] || {}
    # @todo normalize styles
    data.format ||= 'png'

    # @todo refactor into generic interpolator
    path.replace /:(\w+)/g, (__, attribute) =>
      switch attribute
        when 'bucket', 'format'
          data[attribute]
        when 'url'
          @urlFor(style)
        when 'root'
          Tower.root
        when 'style'
          style
        when 'class'
          _.parameterize(@constructor.className())
        when 'name', 'filename'
          if oldValue
            # @todo need to fix the _updateChangedAttribute function
            @attributeWas('name')
          else
            @get('name')
        when 'geometry'
          "#{@get('width')}x#{@get('height')}"
        else
          @get(attribute)
