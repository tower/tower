_ = Tower._

# @example Set arrays
#   post.changes #=> {}
#   post.tags = ['ruby', 'javascript']
#   post.changes #=> {tags: [undefined, ['ruby', 'javascript']]}
#   post.push('tags', 'node')
#   post.changes #=> {tags: [undefined, ['ruby', 'javascript', 'node']]}
#   post.pushEach('tags', ['rails', 'tower'])
#   post.changes #=> {tags: [undefined, ['ruby', 'javascript', 'node', 'rails', 'tower']]}
#
# @example Set arrays through parameters
#   post.setProperties(tags: ['ruby', 'javascript'])
#   post.setProperties($push: tags: 'node')
#   post.setProperties($pushEach: tags: ['rails', 'tower'])
#
# @example Set nested attributes
#   post.push 'comments', message: 'First comment'
#   post.set $push: comments: {message: 'First comment'}
#
# @example Increment attributes
#   post.inc('likeCount', 1)
#   post.atomicallySetAttribute('$inc', 'likeCount', 1)
#   post.atomicallyUpdateAttribute('$inc', 'likeCount', 1)
#   post.updateAttribute('$inc', 'likeCount', 1)
#
# @example Decrement attributes
#   post.inc('likeCount', -1)
#   post.set $inc: likeCount: -1
#
# @example Add item to array
#   post.add 'tags', 'coffeescript'
#   post.set $add: tags: 'coffeescript'
#   post.addEach 'tags', ['javascript', 'coffeescript']
#   post.set $addEach: tags: ['javascript', 'coffeescript']
#
# @example Remove item from array
#   post.remove 'tags', 'coffeescript'
#   post.set $remove: tags: 'coffeescript'
#   post.removeEach 'tags', ['javascript', 'coffeescript']
#   post.set $removeEach: tags: ['javascript', 'coffeescript']
#
# @example Pull item from array (same as remove)
#   post.pull 'tags', 'coffeescript'
#   post.set $pull: tags: 'coffeescript'
#   post.pullEach 'tags', ['javascript', 'coffeescript']
#   post.set $pullEach: tags: ['javascript', 'coffeescript']
#
# @example Each together
#   user = App.User.first() # id == 1
#   post = new App.Post(user: user, title: 'First Post')
#   post.changes #=> {userId: [undefined, 1], title: [undefined, 'First Post']}
#   post.attributeWas('title') #=> undefined
#   post.tags = ['ruby', 'javascript']
#   post.changes #=> {userId: [undefined, 1], title: [undefined, 'First Post'], tags: [undefined, ['ruby', 'javascript']]}
#
# @example Crazy params example
#   post.updateAttributes(title: 'Renamed Post', $add: {tags: 'node'}, $removeEach: {tags: ['ruby', 'jasmine']})
#
Tower.ModelOperations =
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

  addEach: (key, value) ->
    _.oneOrMany(@, @_add, key, value, true)

  unset: ->
    keys = _.flatten _.args(arguments)
    delete @[key] for key in keys
    undefined

  # @private
  _set: (key, value) ->
    if Tower.StoreModifiers.MAP.hasOwnProperty(key)
      @[key.replace('$', '')](value)
    else
      @

  # @private
  _push: (key, value, array = false) ->
    currentValue = @getAttribute(key)
    currentValue ||= []
    currentValue = @_clonedValue(currentValue)

    if array
      currentValue = currentValue.concat(_.castArray(value))
    else
      currentValue.push(value)

    # probably shouldn't reset it, need to consider
    @_actualSet(key, currentValue, true)

  # @private
  _pull: (key, value, array = false) ->
    currentValue = @_clonedValue @getAttribute(key)
    return null unless currentValue

    if array
      for item in _.castArray(value)
        currentValue.splice(_.toStringIndexOf(currentValue, item), 1)
    else
      currentValue.splice(_.toStringIndexOf(currentValue, value), 1)

    # probably shouldn't reset it, need to consider
    @_actualSet(key, currentValue, true)

  # @private
  _add: (key, value, array = false) ->
    currentValue = @getAttribute(key)
    currentValue ||= []
    # @todo need to figure out better way of comparing old/new values, not based on actual javascript object instance
    currentValue = @_clonedValue(currentValue, true)

    if array
      for item in _.castArray(value)
        currentValue.push(item) if _.indexOf(currentValue, item) == -1
    else
      currentValue.push(value) if _.indexOf(currentValue, value) == -1

    # probably shouldn't reset it, need to consider
    @_actualSet(key, currentValue, true)

  # @private
  _inc: (key, value) ->
    currentValue = @getAttribute(key)
    currentValue ||= 0
    currentValue += value

    @_actualSet(key, currentValue, true)

  _getField: (key) ->
    @constructor.fields()[key]

  _clonedValue: (value) ->
    if _.isArray(value)
      value.concat()
    else if _.isDate(value)
      new Date(value.getTime())
    else if typeof value == 'object'
      _.clone(value)
    else
      value

  _defaultValue: (key) ->
    return field.defaultValue(@) if field = @_getField(key)

Tower.ModelOperations.remove = Tower.ModelOperations.pull
Tower.ModelOperations.removeEach = Tower.ModelOperations.pullEach

module.exports = Tower.ModelOperations
