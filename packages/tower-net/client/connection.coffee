# This doesn't need to be used on the client.  The client just needs a set of cursors.
# e_dub: One way you could handle when to let go of the memory is when the user changes resources. so let's say the user is flipping through a list of users, and you keep that stuff in memory, then when they find the user they want, they click on that users posts, now you let go of your users list and start hanging onto the posts
# 
# This class should store the currentUser and currentAbility objects
# so there's a quick way to filter data by user and role.
class Tower.NetConnection extends Tower.NetConnectionBase
  @reopenClass
    connect: (socket, callback) ->
      socket.on 'connect', =>
        id = @getId(socket)
        connection = Tower.NetConnection.create(socket: socket).connect()
        connection.id = id
        Tower.connection = connection
        Tower.connections[id] = connection
        callback(null, connection) if callback

    disconnect: ->
      return unless Tower.connection

      Tower.connection.destroy =>
        Tower.connection = undefined

  @reopen
    connect: ->
      # tmp solution to get data syncing working, then will refactor/robustify
      @on 'sync', (data) =>
        # tmp hack to prevent client data from appearing twice (only on the one who performed action)
        if !Tower.NetConnection.transport || !Tower.NetConnection.transport.requesting
          @serverDidChange(data)

      @registerHandlers()

      @

    notify: (action, records, callback) ->
      # @todo
      records = _.castArray(records)#[records] unless records instanceof Array

      @clientDidChange(action, records, callback)

    resolve: (action, records, callback) ->
      record    = records[0]
      return unless record
      matches   = []
      app       = Tower.Application.instance()

      iterator  = (controller, next) =>
        app.get(controller).resolveAgainstCursors(action, records, matches, next)

      Tower.series @constructor.controllers, iterator, (error) =>
        callback(error, records) if callback

      matches

    # This is called when a record is modified from the client
    # 
    # all records must be of the same type for now.
    clientDidChange: (action, records, callback) ->
      @resolve action, records, (error, matches) =>
        @["clientDid#{_.camelize(action)}"](matches, callback)

    # This is called when the server record changed
    serverDidChange: (data) ->
      @["serverDid#{_.camelize(data.action)}"](data)

    serverDidCreate: (data) ->
      try Tower.constant(data.type).load(data.records)

    serverDidUpdate: (data) ->
      try Tower.constant(data.type).load(data.records, "update")

    # @todo
    serverDidDestroy: (data) ->
      try Tower.constant(data.type).unload(data.records)

    clientDidLoad: (records) ->
      @resolve('create', records)

    # 1. Once one record is matched against a controller it doesn't need to be matched against any other cursor.
    # 2. Once there are no more records for a specific controller type, the records don't need to be queried.
    clientDidCreate: (records, callback) ->
      @notifyTransport('create', records, callback)

    clientDidUpdate: (records) ->
      @notifyTransport('update', records)

    clientDidDestroy: (records) ->
      @notifyTransport('destroy', records)

    notifyTransport: (action, records, callback) ->
      @constructor.transport[action](records, callback) if @constructor.transport?

require './connection/socketio'
require './connection/sockjs'
