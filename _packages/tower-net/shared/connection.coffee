# This doesn't need to be used on the client.  The client just needs a set of cursors.
# e_dub: One way you could handle when to let go of the memory is when the user changes resources. so let's say the user is flipping through a list of users, and you keep that stuff in memory, then when they find the user they want, they click on that users posts, now you let go of your users list and start hanging onto the posts
# 
# This class should store the currentUser and currentAbility objects
# so there's a quick way to filter data by user and role.
class Tower.NetConnectionBase extends Tower.Class

Tower.NetConnectionBase.reopenClass
  # still figuring out how to organize this stuff...
  transport:   undefined
  controllers: []
  handlers:    Ember.Map.create()

  # Try socket.io, then sockjs
  initialize: ->
    if Tower.module('socketio')
      @reopenClass Tower.NetConnectionSocketio
    else
      @reopenClass Tower.NetConnectionSockjs

  # @addHandler '/posts/something'
  addHandler: (name, handler) ->
    @handlers.set(name, handler)

Tower.NetConnectionBase.reopen
  registerHandlers: ->
    @constructor.handlers.forEach (eventType, handler) =>
      @on(eventType, handler)

  # @todo Need to merge the controller and model cursors.
  resolve: (action, records, callback) ->
    record    = records[0]
    return unless record
    matches   = Ember.Map.create() unless Tower.isClient

    iterator  = (controller, next) =>
      @get(controller).resolveAgainstCursors(action, records, matches, next)

    Tower.series @constructor.controllers, iterator, (error) =>
      matches = if Tower.isClient then records else matches.toArray()
      callback(error, matches) if callback

    matches

  notifyTransport: (action, records) ->
    @constructor.transport[action](records, callback) if @constructor.transport?

  # @todo
  destroy: (callback) ->
    callback()

  on: (eventType, handler) ->
    @constructor.registerHandler(@socket, eventType, handler)

module.exports = Tower.NetConnectionBase
