class Tower.Net.Agent
  constructor: (attributes = {}) ->
    _.extend @, attributes

  toJSON: ->
    family:   @family
    major:    @major
    minor:    @minor
    patch:    @patch
    version:  @version
    os:       @os
    name:     @name

  get: ->
    @request 'get', arguments...

  post: ->
    @request 'post', arguments...

  head: ->
    @request 'head', arguments...

  put: ->
    @request 'put', arguments...

  destroy: ->
    @request 'del', arguments...

  request: (method, path, options, callback) ->
    if typeof options == 'function'
      callback  = options
      options   = {}
    options   ||= {}
    headers     = options.headers || {}
    params      = options.params  || {}
    redirects   = options.redirects || 5
    auth        = options.auth
    format      = options.format# || 'form-data'

    newRequest = Tower.modules.superagent[method.toLowerCase()]("http://localhost:#{Tower.port}#{path}")
      .set(headers)
      .send(params)
      .redirects(redirects)

    newRequest = newRequest.auth(auth.username, auth.password) if auth

    newRequest = newRequest.type(format) if format

    if callback
      newRequest.make(callback)
    else
      newRequest

module.exports = Tower.Net.Agent
