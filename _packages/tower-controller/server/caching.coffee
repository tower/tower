_ = Tower._

# @module
Tower.ControllerCaching =
  etag: (content) ->
    require('express/lib/utils').etag(content)

  # @todo the implementations of these getters should be refactored out.
  # 
  # True if headers 'if-modified-since' || 'if-none-match'
  isConditionalGET: Ember.computed(->
    require('connect').utils.conditionalGET(@request)
  ).cacheable()

  _freshWhenOptions: (record, options) ->
    if _.isHash(record)
      options = record
      # _.assertValidKeys('etag', 'lastModified', 'public')
    else
      defaultOptions =
        etag:         record
        lastModified: record.get('updatedAt')

      if options
        options = _.defaults(options, defaultOptions)
      else
        options = defaultOptions

    options

  # Called just before the request is sent.
  setDefaultCacheControl: ->
    response      = @response
    cacheControl  = response.cacheControl

    return if response.get('cache-control')?

    if _.isBlank(cacheControl)
      # default
      value = 'max-age=0, private, must-revalidate'
    else if cacheControl.noCache
      value = 'no-cache'
    else
      extras  = cacheControl.extras
      maxAge  = cacheControl.maxAge
      
      value = []
      value.push "max-age=#{_.toInt(maxAge)}" if maxAge?
      value.push if cacheControl.public then 'public' else 'private'
      value.push 'must-revalidate' if cacheControl.mustRevalidate
      value = value.concat(extras) if extras
      value = value.join(', ')

    response.set('cache-control', value)

  expiresIn: (seconds, options = {}) ->
    _.extend @response.cacheControl,
      maxAge: seconds
      public: !!options.public
      mustRevalidate: !!options.mustRevalidate

    delete options.public
    delete options.mustRevalidate

    keys = _.keys(options)

    response.cacheControl.extras = _.map(keys, (k) -> "#{k}=#{options[k]}")
    response.set('Date', new Date().toUTCString()) unless response.get('Date')

  freshWhen: (record, options) ->
    options   = @_freshWhenOptions(options)
    request   = @request
    response  = @response

    response.set('ETag', @etag(options.etag)) if options.etag? && !response.get('ETag')
    response.cacheControl.public = options.public if options.hasOwnProperty('public')
    response.set('Last-Modified', options.lastModified.toUTCString()) if options.lastModified && !response.get('Last-Modified')

    @head 304 unless @_requestIsFresh()

  # @example
  #   show: ->
  #     App.Post.find @params.id, (error, post) =>
  #       unless @isFresh(post)
  #         @render json: @post
  isFresh: (record, options) ->
    @get('isConditionalGET')

    @freshWhen(record, options)

  # @todo add to request object
  _requestIsFresh: ->
    require('fresh')(@request, @response)


  # Current store, used as an identity for the current request.
  # Then you have guids for the controllers, which makes it so you can have a global
  # cache of records.
  store: ->
    @_store ||= {}

module.exports = Tower.ControllerCaching
