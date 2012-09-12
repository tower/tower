# This should somehow integrate with the future {Tower.StoreTransaction} class,
# to bundle up modifications.
# 
# This doesn't need to be used on the client.  The client just needs a set of cursors.
# e_dub: One way you could handle when to let go of the memory is when the user changes resources. so let's say the user is flipping through a list of users, and you keep that stuff in memory, then when they find the user they want, they click on that users posts, now you let go of your users list and start hanging onto the posts
# 
# This class should store the currentUser and currentAbility objects
# so there's a quick way to filter data by user and role.
class Tower.NetConnection extends Tower.NetConnection
  @reopenClass
    all: {}

    connect: (socket) ->
      id = @getId(socket)

      Tower.connections[id] = connection = Tower.NetConnection.create(socket: socket)

      # tmp solution to get data syncing working, then will refactor/robustify
      #connection.on 'sync', (data) ->
      #  @serverDidChange(data.action, data.records)

      connection.registerHandlers()

      connection.on 'disconnect', =>
        delete Tower.connections[id]

      connection

    disconnect: (socket) ->
      connection = @all[@getId(socket)]
      connection.destroy =>
        delete @all[@getId(socket)]

  @reopen
    notify: (action, records) ->
      # @todo
      records = [records] unless records instanceof Array

      @serverDidChange(action, records)

    # This is called when a record is modified from the client.
    # Not implemented yet, we're just using Ajax right now. This may go away
    # or it may be used like a router.
    # 
    # all records must be of the same type for now.
    clientDidChange: (action, records) ->

    # This is called when the server record changed
    serverDidChange: (action, records) ->
      @resolve action, records, (error, matches) =>
        @["serverDid#{_.camelize(action)}"](records)

    # 1. Once one record is matched against a controller it doesn't need to be matched against any other cursor.
    # 2. Once there are no more records for a specific controller type, the records don't need to be queried.
    serverDidCreate: (records) ->
      @notifyTransport('create', records)

    serverDidUpdate: (records) ->
      @notifyTransport('update', records)

    serverDidDestroy: (records) ->
      @notifyTransport('destroy', records)

    notifyTransport: (action, records) ->
      data =
        action:   action
        records:  _.map(records, (i) -> i.toJSON())
        port:     Tower.port # to get around multiple client connection socket problem (todo)
        type:     try records[0].constructor.className()

      @constructor.emit(@socket, data)
      #@constructor.transport[action](records, callback) if @constructor.transport?

module.exports = Tower.NetConnection
