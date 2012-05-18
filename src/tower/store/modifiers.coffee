Tower.Store.Modifiers =
  MAP:
    '$set':         '$set'
    '$unset':       '$unset'
    '$push':        '$push'
    '$pushEach':    '$pushEach'
    '$pull':        '$pull'
    '$pullEach':    '$pullEach'
    '$remove':      '$pull'
    '$removeEach':  '$pullEach'
    '$inc':         '$inc'
    '$pop':         '$pop'
    '$add':         '$add'
    '$addEach':     '$addEach'
    '$addToSet':    '$add'

  SET: [
    'push'
    'pushEach'
    'pull'
    'pullEach'
    'inc'
    'add'
    'addEach'
    'remove'
    'removeEach'
    'unset'
  ]

  set: (key, value) ->
    _.oneOrMany(@, @_set, key, value)

  push: (key, value) ->
    _.oneOrMany(@, @_push, key, value)

  pushEach: (key, value) ->
    _.oneOrMany(@, @_push, key, value, true)

  pull: (key, value) ->
    _.oneOrMany(@, @_pull, key, value)

  pullEach: (key, value) ->
    _.oneOrMany(@, @_pull, key, value, true)

  inc: (key, value) ->
    _.oneOrMany(@, @_inc, key, value)

  add: (key, value) ->
    _.oneOrMany(@, @_add, key, value)

  unset: ->
    keys = _.flatten _.args(arguments)
    delete @[key] for key in keys
    undefined

  # @private
  _set: (key, value) ->

  # @private
  _push: (key, value, array = false) ->

  # @private
  _pull: (key, value, array = false) ->

  # @private
  _inc: (key, value) ->

  # @private
  _add: (key, value) ->

  _remove: (key, value) ->

module.exports = Tower.Store.Modifiers
