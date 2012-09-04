ioServer  = null
ioClient  = null

describe 'Tower.ControllerSockets', ->      
  beforeEach (done) ->
    Tower.startWithSocket =>
      ioServer = Tower.Application.instance().io
      ioClient = require('socket.io-client').connect "http://localhost:#{Tower.port}"
      done()

  afterEach ->
    Tower.stop()
      
  test 'connection', (done) ->
    # server
    ioServer.on "connection", (socket) ->
      assert.ok socket
      
    # client
    ioClient.on "connect", ->
      done()