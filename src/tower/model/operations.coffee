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
Tower.Model.Operations =  
  push: (key, value) ->
    _.oneOrMany(@, @_push, key, value)

module.exports = Tower.Model.Operations
