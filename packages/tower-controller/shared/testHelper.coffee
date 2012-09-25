# @todo Add method to mocha so you can both pass
#   args to the test description and use those args in the test.
# @example
#   testWith '/users.json', {user: firstName: 'John'}, (params, done) ->
#     post '/users.json', params, ->
#       assert.equal @body.firstName, 'John'
# 
#       done()
global.testWith = ->
  if arguments.length > 2
    args  = _.args(arguments)
    fn    = if typeof args[args.length - 1] == 'function' then args.pop() else null
    title = _.map(args, (arg) -> JSON.stringify(arg)).join(' ')
    args.shift() # remote title
    test title, (done) ->
      # if it's the same length of the args + 1
      if fn.length == (args.length + 1)
        args.push(done)
        fn.apply(@, args)
      else
        fn.apply(@, args)
        done()
  else
    test(arguments...)

# https://raw.github.com/plessbd/superagent/f6e7a85555bbd1a70babf62b4d0c0ec674f3d2f5/lib/node/index.js
Tower.start = (port, callback) ->
  if typeof port == 'function'
    callback  = port
    port      = undefined

  Tower.port  = parseInt(port || 3010)
  Tower.Application.instance().server.listen Tower.port, callback

Tower.startWithSocket = (port, callback) ->
  if typeof port == 'function'
    callback  = port
    port      = undefined

  Tower.port  = port || 3010
  app         = Tower.Application.instance()
  app.io      = require('socket.io').listen(app.server, log: false)
  app.io.set('client store expiration', 0)
  app.io.set('log level', -1)
  #app.io.set('transports', ['websocket'])
  app.server.listen Tower.port, callback

Tower.stop = (callback) ->
  Tower.port = 3010
  delete Tower.Controller.testCase
  Tower.Application.instance().server.close()
  callback() if callback

Tower.module('superagent').Request::make = (callback) ->
  @end (response) ->
    controller = Tower.Controller.testCase
    if controller
      response.controller = controller
      callback.call controller, response
    else
      callback.call @, response

_.get     = ->
  _.request 'get', arguments...

_.post    = ->
  _.request 'post', arguments...

_.head    = ->
  _.request 'head', arguments...

_.put     = ->
  _.request 'put', arguments...

_.destroy = ->
  _.request 'del', arguments...

_.request = (method, path, options, callback) ->
  if typeof options == 'function'
    callback  = options
    options   = {}
  options   ||= {}
  headers     = options.headers || {}
  params      = options.params  || {}
  redirects   = if options.redirects? then options.redirects else 5
  auth        = options.auth
  format      = options.format# || "form-data"
  method      = method.toLowerCase()

  # @todo maybe we want to give some slack and convert to `accept` header?
  throw new Error('The "content-type" header is only valid for PUT/POST') if headers['content-type'] && method == 'get'

  newRequest = Tower.module('superagent')[method]("http://localhost:#{Tower.port}#{path}")
    .set(headers)
    .redirects(redirects)

  params.format = format if format

  isBlank = _.isBlank(params)

  if method == 'get'
    # since we want it to deserialize the JSON numbers as numbers not strings.
    if params.conditions? && typeof params.conditions == 'object'
      params.conditions = JSON.stringify(params.conditions)

    newRequest.query(params) unless isBlank
  else
    newRequest = newRequest.send(params) unless isBlank

  newRequest = newRequest.auth(auth.username, auth.password) if auth

  # content-type of json on a GET request throws error if `strict` in connect json parser
  newRequest = newRequest.type(format) if format && method != 'get'

  if callback
    newRequest.make(callback)
  else
    newRequest

global.testIndex = global.testShow = ->
  testRequest 'get', arguments...
  
global.testCreate = ->
  testRequest 'post', arguments...

global.testUpdate = ->
  testRequest 'put', arguments...

global.testDestroy = ->
  testRequest 'destroy', arguments...

# @example This is without the helper
#   test '/posts.json', (done) ->
#     params =
#       post:
#         title: 'Three'
#   
#     post '/posts.json', params: params, (response) =>
#       result = response.body
#   
#       assert.equal result.title, 'Three'
#       assert.equal result.slug, 'three'
#   
#       done()
# 
# @example This is with the helper
#   testCreate '/posts.json', post: title: 'Three', (done) ->
#     result = @result
#
#     assert.equal result.title, 'Three'
#     assert.equal result.slug, 'three'
#
#     done()
# 
# @example Overloading this method
#   testShow '/posts/:id.json', urlFor(post)
global.testRequest = (method, url, params, block, other) ->
  description = url

  if typeof params == 'function'
    unless block? # both params and block are functions
      block   = params
      params  = {}
  else if typeof params == 'string'
    url     = params
    if typeof block == 'object'
      params  = block
      block   = other
    else
      params  = {}

  description += " #{JSON.stringify(params)}" if !!params && typeof params == 'object'

  test description, (done) ->
    # so we can wait until after the before blocks
    params = params() if typeof params == 'function'
    
    if typeof params == 'string'
      url     = params
      params  = null

    if typeof block == 'object'
      params  = block
      block   = other

    params ||= {}

    _[method] url, params: params, (response) ->
      if block
        if block.length
          block.call(response, done)
        else
          block.call(response)
          done()
      else
        done()
