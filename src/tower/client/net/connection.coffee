# This should somehow integrate with the future {Tower.Store.Transaction} class,
# to bundle up modifications.
# 
# This doesn't need to be used on the client.  The client just needs a set of cursors.
# e_dub: One way you could handle when to let go of the memory is when the user changes resources. so let's say the user is flipping through a list of users, and you keep that stuff in memory, then when they find the user they want, they click on that users posts, now you let go of your users list and start hanging onto the posts
# 
# This class should store the currentUser and currentAbility objects
# so there's a quick way to filter data by user and role.
class Tower.Net.Connection extends Tower.Net.Connection
  @connect: (socket) ->
    connection = Tower.Net.Connection.create(socket: socket).connect()
    Tower.connection = connection
    Tower.connections[@getId(socket)] = connection

  @disconnect: ->
    return unless Tower.connection

    Tower.connection.destroy =>
      Tower.connection = undefined

  connect: ->
    # tmp solution to get data syncing working, then will refactor/robustify
    @on 'sync', (data) =>
      @serverDidChange(data.action, data.records)

    @registerHandlers()

    @

  # This is called when a record is modified from the client
  # 
  # all records must be of the same type for now.
  clientDidChange: (action, records) ->
    @resolve action, records, (error, matches) =>
      @["clientDid#{_.camelize(action)}"](matches)

  # This is called when the server record changed
  serverDidChange: (action, records) ->
    @resolve(action, records)

  # 1. Once one record is matched against a controller it doesn't need to be matched against any other cursor.
  # 2. Once there are no more records for a specific controller type, the records don't need to be queried.
  clientDidCreate: (records) ->
    @notifyTransport('create', records)

  clientDidUpdate: (records) ->
    @notifyTransport('update', records)

  clientDidDelete: (records) ->
    @notifyTransport('destroy', records)

  notifyTransport: (action, records) ->
    @constructor.transport[action](records, callback) if @constructor.transport?

require './connection/socketio'
require './connection/sockjs'
